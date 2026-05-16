import React from "react";
import styles from "./Footer.module.css";
import logo from "../../../assets/Care.com.svg";
const Footer = () => {
  return (
    <>
      <div className={styles.footer}>
        <div className={styles.logo}>
          <img src={logo} alt="" />
        </div>
        <div className={styles.data}>
          <p>&copy; {new Date().getFullYear()} Care. All Rights Reserved.</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
