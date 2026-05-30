import React, { useState } from "react";
import styles from "./SignUp.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../../api/api";
import Swal from "sweetalert2";

const SignUp = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");

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

  const handleSubmit = async () => {
    try {
      if (form.password !== form.confirmPassword) {
        Swal.fire({
          icon: "warning",
          title: "Passwords do not match",
        });
        return;
      }

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
        formData.append("universityCertificateImage", files.universityCertificateImage);
        formData.append("nationalIdImage", files.nationalIdImage);
      }

      await api.post("/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (role === "user") {
        Swal.fire({
          icon: "success",
          title: "Account Created!",
          text: "You can now login to your account.",
        });

        navigate("/auth/login");
        return;
      }

      if (role === "doctor") {
        Swal.fire({
          icon: "info",
          title: "Registration Successful",
          text: "Your account is under review by admin.",
        });

        navigate("/auth/login");
        return;
      }

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className={styles.inputs}>
      <input name="name" placeholder="Enter your name" onChange={handleChange} />

      <input name="email" placeholder="Enter your email" onChange={handleChange} />

      <input name="NID" placeholder="National ID" onChange={handleChange} />

      <input
        type="password"
        name="password"
        placeholder="Enter your Password"
        onChange={handleChange}
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        onChange={handleChange}
      />

      <input
        type="text"
        name="phone"
        placeholder="phone"
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
        <p className={styles.fileName}>
           {files.syndicateCardImage.name}
        </p>
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
        <p className={styles.fileName}>
           {files.nationalIdImage.name}
        </p>
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

      <button className={styles.sign} onClick={handleSubmit}>
        Sign-Up
      </button>

      <NavLink to="/auth/login">
        You already have account
      </NavLink>
    </div>
  );
};

export default SignUp;