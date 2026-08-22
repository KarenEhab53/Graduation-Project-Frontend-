import React, { useState } from "react";
import styles from "./PatientDashboard.module.css";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import { MdCancel } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import { Outlet } from "react-router-dom";

const PatientDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
const sidebarLinks = [
  {
    title: "Profile",
    icon: "fa-regular fa-user",
    path: "/user-dashboard/profile",
  },
  {
    title: "Medical History",
    icon: "fa-solid fa-clock-rotate-left",
    path: "/user-dashboard/medical-history",
  },
  {
    title: "NID Search",
    icon: "fa-brands fa-sistrix",
    path: "/user-dashboard/nid",
  },
  {
    title: "My appointment",
    icon: "fa-regular fa-calendar-days",
    path: "/user-dashboard/my-appointement",
  },
  {

    title: "AI Assistant",
    icon: "fa-solid fa-robot",
    path: "/user-dashboard/ai-assistant",
  },
  {

    title: "Messages",
    icon: "fa-regular fa-message",
    path: "/user-dashboard/messages",
  },
  {
    title: "Logout",
    icon: "fa-solid fa-arrow-right-from-bracket",
    path: "/",
  },
];

  return (
    <section className={styles.dashboard}>
      <div className={styles.menuIcon} onClick={() => setMenuOpen(true)}>
        <CiMenuKebab />
      </div>

      <div
        className={`${styles.sidebarWrapper} ${
          menuOpen ? styles.showSidebar : ""
        }`}
      >
        <div className={styles.closeBtn} onClick={() => setMenuOpen(false)}>
          <MdCancel />
        </div>

        <Sidebar links={sidebarLinks} />
      </div>
      <main>
        <Outlet />
      </main>
    </section>
  );
};

export default PatientDashboard;
