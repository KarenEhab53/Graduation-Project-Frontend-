import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/care.com.svg";
import { TiThMenu } from "react-icons/ti";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
const [isActive, setIsActive] = useState(false);
 const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>

      <div className={styles.logo}>
        <img src={logo} alt="Logo" />
      </div>

      <div className={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)}>
        <TiThMenu />
      </div>

      <div
        className={`${styles.navLinks} ${menuOpen ? styles.activeMenu : ""}`}
      >
        <ul>
          <li>
            <NavLink to="/"  end onClick={() => setMenuOpen(false),() => setIsActive(true)} className={({ isActive }) => (isActive ? styles.active : "")}>
              Home
            </NavLink>
          </li>

          <li>
            <NavLink to="/reservation" onClick={() => setMenuOpen(false),() => setIsActive(false)} className={({ isActive }) => (isActive ? styles.active : "")}>
              Reservation
            </NavLink>
          </li>

          <li>
            <NavLink to="/alldoctors" onClick={() => setMenuOpen(false),() => setIsActive(false)} className={({ isActive }) => (isActive ? styles.active : "")}>
              All Doctors
            </NavLink>
          </li>

          <li className={styles.mobileLogin}>
            <NavLink to="/auth" onClick={() => setMenuOpen(false)}>
              Login
            </NavLink>
          </li>
        </ul>
      </div>

      <div className={styles.userActions}>
        <NavLink to="/auth" className={styles.loginBtn}>
          Login
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
