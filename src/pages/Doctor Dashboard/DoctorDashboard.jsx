import React from 'react'
import styles from './DoctorDashboard.module.css'
import Sidebar from '../../components/Dashboard/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { MdCancel } from 'react-icons/md';
import { CiMenuKebab } from 'react-icons/ci';
import { useState } from 'react';
const DoctorDashboard = () => {
      const [menuOpen, setMenuOpen] = useState(false);
    const sidebarLinks = [
      {
        title: "Profile",
        icon: "fa-regular fa-user",
        path: "/doctor-dashboard/profile",
      },
      {
        title: "Update profile",
        icon: "fa-solid fa-arrows-rotate",
        path: "/doctor-dashboard/doctor-profile",
      },
      {
        title: "Medical History",
        icon: "fa-solid fa-clock-rotate-left",
        path: "/doctor-dashboard/medical-history",
      },
      {
        title: "NID Search",
        icon: "fa-brands fa-sistrix",
        path: "/doctor-dashboard/nid",
      },
      {
        title: "My appointment",
        icon: "fa-regular fa-calendar-days",
        path: "/doctor-dashboard/my-appointement",
      },
      {
        title: "Messages",
        icon: "fa-regular fa-message",
        path: "/doctor-dashboard/messages",
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
}

export default DoctorDashboard