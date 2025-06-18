import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
  const { userInfo, logout } = useContext(UserContext);

  const handleLogout = async () => {
    await logout();
  };

  const username = userInfo?.first_name;

  return (
    <header>
      <Link to="/?page=1" className="logo">
        Express Blog
      </Link>

      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <Link to="/author-posts">View Your Blogs</Link>
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
