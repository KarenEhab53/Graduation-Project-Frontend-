import React, { useState } from "react";
import styles from "./SignUp.module.css";
import { NavLink } from "react-router-dom";
const SignUp = () => {
  const [role, setRole] = useState("");

  return (
    <div className={styles.inputs}>
      <input type="text" placeholder="Enter your name" />
      <input type="email" placeholder="Enter your email" />
      <input type="number" placeholder="National ID" />
      <input type="password" placeholder="Enter your Password" />
      <input type="password" placeholder="Confirm password" />

      {role === "doctor" && (
        <div className={styles.uploads}>
          <label className={styles.uploadBox}>
            <span> Upload Syndicate Card</span>
            <input type="file" hidden />
          </label>

          <label className={styles.uploadBox}>
            <span> Upload University Certificate</span>
            <input type="file" hidden />
          </label>

          <label className={styles.uploadBox}>
            <span> Upload National ID</span>
            <input type="file" hidden />
          </label>
        </div>
      )}
      <div className={styles.role}>
        <label>
          <input
            type="radio"
            name="role"
            value="patient"
            onChange={(e) => setRole(e.target.value)}
          />
          Patient
        </label>

        <label>
          <input
            type="radio"
            name="role"
            value="doctor"
            onChange={(e) => setRole(e.target.value)}
          />
          Doctor
        </label>
      </div>
      <button className={styles.sign}>Sign-Up</button>

      <NavLink to="/auth/login">You already have account</NavLink>
    </div>
  );
};

export default SignUp;
