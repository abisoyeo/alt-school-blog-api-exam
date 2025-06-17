import { createContext, useState, useEffect, useRef } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // TODO: Finish up refresh tokens management
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshPromiseRef = useRef(null);

  const clearAuth = () => {
    setUserInfo(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsRefreshing(false);
    refreshPromiseRef.current = null;
  };

  const refreshToken = async () => {
    // If already refreshing, wait for the existing refresh to complete
    if (isRefreshing && refreshPromiseRef.current) {
      console.log("Refresh already in progress, waiting for completion...");
      return refreshPromiseRef.current;
    }

    console.log("Starting new token refresh...");
    setIsRefreshing(true);

    // Create and store the refresh promise
    const refreshPromise = (async () => {
      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          const newToken = result.data.token;

          localStorage.setItem("token", newToken);
          setToken(newToken);

          console.log("Token refreshed successfully");
          return newToken;
        } else {
          console.log("Refresh failed with status:", response.status);
          const errorData = await response.json().catch(() => ({}));
          console.log("Refresh error details:", errorData);

          clearAuth();
          return null;
        }
      } catch (error) {
        console.error("Refresh token network error:", error);
        clearAuth();
        return null;
      } finally {
        setIsRefreshing(false);
        refreshPromiseRef.current = null;
      }
    })();

    refreshPromiseRef.current = refreshPromise;
    return refreshPromise;
  };

  const fetchUserProfile = async (authToken) => {
    if (!authToken) {
      console.log("No auth token provided for profile fetch");
      return null;
    }

    console.log(
      "Fetching profile with token:",
      authToken.substring(0, 20) + "..."
    );

    try {
      const response = await fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        console.log("Profile fetch successful");

        const responseData = await response.json();
        const userData = responseData.data.user;

        setUserInfo(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      } else if (response.status === 401) {
        console.log("Token expired, attempting refresh...");

        // Token expired, try refresh
        const newToken = await refreshToken();
        if (newToken) {
          console.log("Refresh successful, retrying profile fetch...");

          // Retry with new token
          return fetchUserProfile(newToken);
        } else {
          // Refresh failed - clear invalid auth data
          clearAuth();
        }
      } else {
        // Other HTTP errors (403, 404, 500, etc.) - don't clear auth data
        console.error("Profile fetch failed with status:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }

    return null;
  };

  // Authenticated fetch wrapper for other API calls
  const fetchWithAuth = async (url, options = {}) => {
    let currentToken = token || localStorage.getItem("token");

    try {
      if (!currentToken) return null;

      let response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${currentToken}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        return {
          success: true,
          message: response,
        };
      } else if (response.status === 401) {
        // If 401, try token refresh
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
          if (response.ok) {
            return {
              success: true,
              message: response,
            };
          }
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Fetch failed:", response.status, errorData);
        return {
          success: false,
          message: errorData.error || "Fetch failed",
        };
      }
    } catch (error) {
      console.error("Fetch error:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  };

  // Register function
  const register = async (first_name, last_name, email, password) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ first_name, last_name, email, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.status === 201) {
        const userInfo = await response.json();

        const token = userInfo.data.token;
        const user = userInfo.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUserInfo(user);
        setToken(token);

        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Registration failed:", response.status, errorData);
        return {
          success: false,
          message: errorData.error || "Registration failed",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const userInfo = await response.json();

        const token = userInfo.data.token;
        const user = userInfo.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUserInfo(user);
        setToken(token);

        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Login failed:", response.status, errorData);
        return {
          success: false,
          message: errorData.error || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
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
      clearAuth();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          console.log("Found stored auth, attempting to fetch profile...");
          setToken(storedToken);

          // Try to fetch profile with stored token
          const userData = await fetchUserProfile(storedToken);

          if (!userData) {
            console.log("Profile fetch failed, clearing stored auth");
            clearAuth();
          }
        } else {
          console.log("No stored auth found");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        clearAuth();
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const contextValue = {
    userInfo,
    setUserInfo,
    token,
    setToken,
    refreshToken,
    fetchWithAuth,
    register,
    login,
    logout,
    isLoading,
    isInitialized,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
