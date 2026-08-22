import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import styles from "./Auth.module.css";

const Auth = () => {
  const location = useLocation();
  const isForgetPassword = location.pathname.includes("forget-password");

  return (
    <div className={styles.auth}>
      <div className={styles.container}>
        <div className={styles.formPanel}>
          {!isForgetPassword && (
            <nav className={styles.tabs}>
              <NavLink
                to="login"
                className={({ isActive }) =>
                  isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab
                }
              >
                Login
              </NavLink>
              <NavLink
                to="sign-up"
                className={({ isActive }) =>
                  isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab
                }
              >
                Sign Up
              </NavLink>
            </nav>
          )}

          <div className={styles.formContent}>
            <Outlet />
          </div>
        </div>

        <div className={styles.imagePanel}>
          <div className={styles.circle1}></div>
          <div className={styles.circle2}></div>
          <div className={styles.circle3}></div>
          <div className={styles.circle4}></div>
          <div className={styles.header}>
            <h2>Welcome Back !</h2>
            <h2>Simple Healthcare for Everyone.</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
