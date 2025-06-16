import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const refreshToken = async () => {
    try {
      const response = await fetch("/api/auth/refresh-token", {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const newToken = responseData.data.token;

        localStorage.setItem("token", newToken);
        setToken(newToken);
        return newToken;
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUserInfo(null);
        return null;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUserInfo(null);
      return null;
    }
  };

  const fetchUserProfile = async (authToken) => {
    try {
      const response = await fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const responseData = await response.json();
        const userData = responseData.data.user;

        setUserInfo(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      } else if (response.status === 401) {
        // Token expired, try refresh
        const newToken = await refreshToken();
        if (newToken) {
          // Retry with new token
          return fetchUserProfile(newToken);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
    return null;
  };

  // Authenticated fetch wrapper for other API calls
  const fetchWithAuth = async (url, options = {}) => {
    let currentToken = token || localStorage.getItem("token");

    if (!currentToken) return null;

    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${currentToken}`,
      },
      credentials: "include",
    });

    // If 401, try token refresh
    if (response.status === 401) {
      const newToken = await refreshToken();
      if (newToken) {
        // Retry original request with new token
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          },
          credentials: "include",
        });
      }
    }

    return response;
  };

  // Logout function
  const logout = async () => {
    try {
      const currentToken = token || localStorage.getItem("token");
      if (currentToken) {
        await fetch("/api/auth/logout", {
          headers: {
            Authorization: `Bearer ${currentToken}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          credentials: "include",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state regardless of API call success
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUserInfo(null);
    }
  };

  // Initialize auth state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && !storedUser) {
        // Have token but no user data - fetch profile
        await fetchUserProfile(storedToken);
      } else if (storedToken && storedUser) {
        // Have both - verify token is still valid by making a quick API call
        try {
          const response = await fetchUserProfile(storedToken);

          if (response.status === 401) {
            // Token expired, try refresh
            await refreshToken();
          }
        } catch (error) {
          console.error("Token verification failed:", error);
        }
      }
    };

    initializeAuth();
  }, []); // Only run once on app start

  const contextValue = {
    userInfo,
    setUserInfo,
    token,
    setToken,
    refreshToken,
    fetchWithAuth,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
