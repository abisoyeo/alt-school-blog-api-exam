import { useState, useContext } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../components/UserContext";

export default function RegisterPage() {
  const [first_name, setFirstname] = useState("");
  const [last_name, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useContext(UserContext);
  const location = useLocation();

  async function handleRegister(ev) {
    ev.preventDefault();
    setLoading(true);
    setError("");

    const result = await register(first_name, last_name, email, password);

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
      <form className="register" onSubmit={handleRegister}>
        <h1>Register</h1>
        {error && (
          <div className="error" style={{ color: "red", marginBottom: "10px" }}>
            {error}
          </div>
        )}
        <input
          type="text"
          placeholder="First Name"
          value={first_name}
          onChange={(ev) => setFirstname(ev.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={last_name}
          onChange={(ev) => setLastname(ev.target.value)}
        />
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
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <div className="footer">
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
