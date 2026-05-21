import React from "react";
import styles from "./Footer.module.css";
import logo from "../../../assets/Care.com.svg";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Logo + Brand */}
        <div className={styles.brand}>
          <img src={logo} alt="Care logo" />
          <p>Your health, our priority.</p>
        </div>

        

        {/* Copyright */}
        <div className={styles.copy}>
          <p>© {new Date().getFullYear()} Care. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
