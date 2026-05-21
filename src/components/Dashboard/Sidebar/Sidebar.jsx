import React from "react";
import styles from "./Sidebar.module.css";
import { NavLink, useLocation } from "react-router-dom";
import profile from "../../../assets/user.png";

const Sidebar = ({ links }) => {
  const location = useLocation();

  return (
    <div className={styles.sidebar}>
      <div className={styles.info}>
        <div className={styles.image}>
          <img src={profile} alt="profile" />
        </div>

        <h4>User Name</h4>
      </div>

      <ul className={styles.links}>
        {links.map((item) => (
          <li
            key={item.title}
            className={`
              ${item.title === "Logout" ? styles.logout : ""}
              ${location.pathname === item.path ? styles.active : ""}
            `}
          >
            <i className={item.icon}></i>

            <NavLink to={item.path}>{item.title}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
