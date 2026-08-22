import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../api/api"; // عدّل المسار لو ملف الـ axios instance عندك في مكان تاني
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./AdminLogin.module.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      // مهم: تأكيد إن الحساب ده أدمن فعلاً قبل ما نكمل.
      // ده تحقق على مستوى الفرونت بس، لسهولة الاستخدام - التحقق الحقيقي
      // والآمن لازم يكون في الباك إند (شوف الملاحظة تحت الكود).
      if (user.role !== "admin") {
        Swal.fire({
          icon: "error",
          title: "Access denied",
          text: "This login is for admins only.",
        });
        return;
      }

      login(user, token);

      Swal.fire({
        icon: "success",
        title: "Welcome back, Admin",
        timer: 1000,
        showConfirmButton: false,
      });

      navigate("/admin-dashboard");
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
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.sub}>
          Restricted access — authorized personnel only
        </p>

        <input
          type="email"
          name="email"
          placeholder="Enter admin email"
          value={form.email}
          onChange={handleChange}
          autoFocus
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
        />

        <button className={styles.btn} type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
