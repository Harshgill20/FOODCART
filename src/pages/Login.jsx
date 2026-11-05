import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import "./Login.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(mode, f) {
  const errors = {};
  if (mode === "register" && f.name.trim().length < 2) errors.name = "Name must be at least 2 characters";
  if (!EMAIL_RE.test(f.email.trim())) errors.email = "Enter a valid email address";
  if (mode === "register") {
    if (f.password.length < 8) errors.password = "Password must be at least 8 characters";
    else if (!/[A-Za-z]/.test(f.password) || !/\d/.test(f.password))
      errors.password = "Password needs at least one letter and one number";
    if (f.confirm !== f.password) errors.confirm = "Passwords do not match";
  } else if (!f.password) {
    errors.password = "Password is required";
  }
  return errors;
}

function Login({ onAuth }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); 
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setErrors({});
    setServerError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError("");
    const found = validate(mode, form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      onAuth(data.token, data.user);
      navigate("/menu");
    } catch (err) {
      setServerError(err.message === "Failed to fetch" ? "Cannot reach the server" : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit} noValidate>
        <h2>{mode === "login" ? "Login to FoodMap" : "Create your account"}</h2>

        {mode === "register" && (
          <label>
            Name
            <input name="name" value={form.name} onChange={change} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>
        )}

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={change} />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>

        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={change} />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>

        {mode === "register" && (
          <label>
            Confirm password
            <input name="confirm" type="password" value={form.confirm} onChange={change} />
            {errors.confirm && <span className="field-error">{errors.confirm}</span>}
          </label>
        )}

        {serverError && <p className="server-error">{serverError}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>

        <p className="switch-mode">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button type="button" className="link-btn" onClick={switchMode}>
            {mode === "login" ? "Create an account" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
