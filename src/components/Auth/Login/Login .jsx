import  { useState } from "react";
import styles from "./Login.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../../api/api";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (submitting) return;

    if (!form.email || !form.password) {
      Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please enter both email and password.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/login", {
        email: form.email,
        password: form.password,
      });

      const { user, token } = res.data;
      login(user, token);

      Swal.fire({
        icon: "success",
        title: "Welcome back!",
        timer: 1200,
        showConfirmButton: false,
      });


      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: error.response?.data?.message || "Invalid email or password",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.inputs}>
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Enter your Password"
        value={form.password}
        onChange={handleChange}
      />

      <button
        className={styles.login}
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "Logging in..." : "Login"}
      </button>

      <NavLink to="/auth/forgot-password">Forget your password?</NavLink>
      <NavLink to="/auth/sign-up">You Don't have account</NavLink>
    </div>
  );
};

export default Login;
