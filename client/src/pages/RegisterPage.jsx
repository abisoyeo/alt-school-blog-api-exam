import { useState } from "react";

export default function RegisterPage() {
  const [first_name, setFirstname] = useState("");
  const [last_name, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(ev) {
    ev.preventDefault();

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ first_name, last_name, email, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.status === 201) {
      // setRedirect(true);
      alert("registration successful");
    } else {
      alert("registration failed");
    }
  }

  //   if (redirect) {
  // or navigate to homepage
  //     return <Navigate to={"/profile"} />;
  //     }

  return (
    <div className="form-group">
      <form className="register" onSubmit={handleRegister}>
        <h1>Register</h1>
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
        <button>Sign Up</button>
      </form>
    </div>
  );
}
