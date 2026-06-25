// src/components/Auth/Sign up/SignUp.jsx
import React, { useState } from "react";
import styles from "./SignUp.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../../api/api";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext.jsx";

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("user");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    NID: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [files, setFiles] = useState({
    syndicateCardImage: null,
    universityCertificateImage: null,
    nationalIdImage: null,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: fileList[0],
    }));
  };

  const validate = () => {
    if (
      !form.name ||
      !form.email ||
      !form.NID ||
      !form.password ||
      !form.confirmPassword ||
      !form.phone
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please fill in all fields.",
      });
      return false;
    }

    if (form.password !== form.confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Passwords do not match",
      });
      return false;
    }

    if (form.password.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "Weak password",
        text: "Password must be at least 8 characters.",
      });
      return false;
    }

    if (role === "doctor") {
      const {
        syndicateCardImage,
        universityCertificateImage,
        nationalIdImage,
      } = files;
      if (
        !syndicateCardImage ||
        !universityCertificateImage ||
        !nationalIdImage
      ) {
        Swal.fire({
          icon: "warning",
          title: "Missing documents",
          text: "Please upload all required documents to register as a doctor.",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("NID", form.NID);
      formData.append("password", form.password);
      formData.append("confirmPassword", form.confirmPassword);
      formData.append("phone", form.phone);
      formData.append("role", role);

      if (role === "doctor") {
        formData.append("syndicateCardImage", files.syndicateCardImage);
        formData.append(
          "universityCertificateImage",
          files.universityCertificateImage,
        );
        formData.append("nationalIdImage", files.nationalIdImage);
      }

      const res = await api.post("/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (role === "user") {
        const { user, token } = res.data;
        login(user, token);

        Swal.fire({
          icon: "success",
          title: "Account Created!",
          text: "Welcome aboard.",
        });

        navigate("/user-dashboard", { replace: true });
        return;
      }

      if (role === "doctor") {
        Swal.fire({
          icon: "info",
          title: "Registration Successful",
          text: "Your account is under review by admin.",
        });

        navigate("/auth/login", { replace: true });
        return;
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.inputs}>
      <input
        name="name"
        placeholder="Enter your name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        name="email"
        type="email"
        placeholder="Enter your email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        name="NID"
        placeholder="National ID"
        value={form.NID}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Enter your Password"
        value={form.password}
        onChange={handleChange}
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        value={form.confirmPassword}
        onChange={handleChange}
      />

      <input
        type="text"
        name="phone"
        placeholder="phone"
        value={form.phone}
        onChange={handleChange}
      />

      {role === "doctor" && (
        <div className={styles.uploads}>
          <label className={styles.uploadBox}>
            <span>Upload Syndicate Card</span>
            <input
              type="file"
              name="syndicateCardImage"
              hidden
              onChange={handleFileChange}
            />
            {files.syndicateCardImage && (
              <p className={styles.fileName}>{files.syndicateCardImage.name}</p>
            )}
          </label>

          <label className={styles.uploadBox}>
            <span>Upload University Certificate</span>
            <input
              type="file"
              name="universityCertificateImage"
              hidden
              onChange={handleFileChange}
            />
            {files.universityCertificateImage && (
              <p className={styles.fileName}>
                {files.universityCertificateImage.name}
              </p>
            )}
          </label>

          <label className={styles.uploadBox}>
            <span>Upload National ID</span>
            <input
              type="file"
              name="nationalIdImage"
              hidden
              onChange={handleFileChange}
            />
            {files.nationalIdImage && (
              <p className={styles.fileName}>{files.nationalIdImage.name}</p>
            )}
          </label>
        </div>
      )}

      <div className={styles.role}>
        <label>
          <input
            type="radio"
            value="user"
            checked={role === "user"}
            onChange={(e) => setRole(e.target.value)}
          />
          Patient
        </label>

        <label>
          <input
            type="radio"
            value="doctor"
            checked={role === "doctor"}
            onChange={(e) => setRole(e.target.value)}
          />
          Doctor
        </label>
      </div>

      <button
        className={styles.sign}
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "Signing up..." : "Sign-Up"}
      </button>

      <NavLink to="/auth/login">You already have account</NavLink>
    </div>
  );
};

export default SignUp;
