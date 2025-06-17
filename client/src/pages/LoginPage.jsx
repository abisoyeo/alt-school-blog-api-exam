import { useState, useContext } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../components/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, userInfo, isLoading, isInitialized } = useContext(UserContext);
  const location = useLocation();

  // Don't redirect until auth is fully initialized
  if (isLoading || !isInitialized) {
    return <div>Loading...</div>;
  }

  if (userInfo) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  async function handleLogin(ev) {
    ev.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(email, password);

    if (result.success === true) {
      setRedirect(true);
    } else {
      setError(result.message || "Wrong credentials");
    }

    setLoading(false);
  }

  if (redirect) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return (
    <div className="form-group">
      <form className="login" onSubmit={handleLogin}>
        <h1>Login</h1>
        {error && (
          <div className="error" style={{ color: "red", marginBottom: "10px" }}>
            {error}
          </div>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="footer">
        <p>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
