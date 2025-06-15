import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // this is where u try the refresh for token and setuserinfo on refresh of dom

    setUserInfo(userInfo);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUserInfo(null);
        }
      })
      .catch((error) => console.error("Logout  err:", error));
  };

  const username = userInfo?.email;

  return (
    <header>
      <Link to="/" className="logo">
        Express Blog
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <a onClick={handleLogout}>Logout ({username})</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
