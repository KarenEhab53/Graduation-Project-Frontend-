import React, { useEffect, useState, useRef } from "react";
import styles from "./Navbar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../../assets/care.com.svg";
import { TiThMenu } from "react-icons/ti";
import { FiUser, FiGrid, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext.jsx";
import Swal from "sweetalert2";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDoctor = user?.role === "doctor";
  const dashboardPath = isDoctor ? "/doctor-dashboard" : "/user-dashboard";
  const profilePath = isDoctor
    ? "/doctor-dashboard/profile"
    : "/user-dashboard/profile";

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMenuOpen(false);

    const result = await Swal.fire({
      icon: "warning",
      title: "Logout?",
      text: "Are you sure you want to log out?",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#cb2027",
      cancelButtonColor: "#a8a8a8",
    });

    if (result.isConfirmed) {
      logout();
      navigate("/");
      Swal.fire({
        icon: "success",
        title: "Logged out",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

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
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/reservation"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Reservation
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/alldoctors"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              All Doctors
            </NavLink>
          </li>

          {!user && (
            <li className={styles.mobileOnly}>
              <NavLink to="/auth" onClick={() => setMenuOpen(false)}>
                Login
              </NavLink>
            </li>
          )}

          {user && (
            <>
              <li className={styles.mobileOnly}>
                <NavLink to={profilePath} onClick={() => setMenuOpen(false)}>
                  Profile
                </NavLink>
              </li>
              <li className={styles.mobileOnly}>
                <NavLink to={dashboardPath} onClick={() => setMenuOpen(false)}>
                  Dashboard
                </NavLink>
              </li>
              <li className={styles.mobileOnly}>
                <button
                  className={styles.mobileLogoutBtn}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className={styles.userActions}>
        {!user ? (
          <NavLink to="/auth" className={styles.loginBtn}>
            Login
          </NavLink>
        ) : (
          <div className={styles.userMenu} ref={dropdownRef}>
            <button
              className={styles.avatarBtn}
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <img
                src={user.profileImage}
                alt={user.name || "User"}
                className={styles.avatar}
              />
              <FiChevronDown className={styles.chevron} />
            </button>

            {dropdownOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <img
                    src={user.profileImage}
                    alt=""
                    className={styles.dropdownAvatar}
                  />
                  <div className={styles.dropdownUserInfo}>
                    <p className={styles.dropdownName}>{user.name}</p>
                    <p className={styles.dropdownEmail}>{user.email}</p>
                  </div>
                </div>

                <div className={styles.dropdownGroup}>
                  <NavLink
                    to={profilePath}
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiUser className={styles.dropdownIcon} />
                    Profile
                  </NavLink>
                </div>

                <div className={styles.dropdownGroup}>
                  <button
                    className={styles.dropdownItemDanger}
                    onClick={handleLogout}
                  >
                    <FiLogOut className={styles.dropdownIcon} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
