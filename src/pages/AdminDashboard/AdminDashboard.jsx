import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../../components/AdminDashboard/Sidebar/Sidebar.jsx";
import Topbar from "../../components/AdminDashboard/Topbar/Topbar.jsx";

import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const adminLinks = [
    {
      title: "Dashboard",
      path: "/admin-dashboard",
      icon: "fas fa-home",
    },
    {
      title: "Doctors",
      path: "/admin-dashboard/doctors",
      icon: "fas fa-user-md",
    },
    {
      title: "Users",
      path: "/admin-dashboard/users",
      icon: "fas fa-users",
    },
    {
      title: "Chat",
      path: "/admin-dashboard/chat",
      icon: "fas fa-comments",
    },
  ];

  return (
    <div className={styles.shell}>
      <Sidebar
        links={adminLinks}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {isSidebarOpen && (
        <div
          className={styles.overlay}
          onClick={closeSidebar}
        />
      )}

      <div className={styles.main}>
        <Topbar onMenuClick={toggleSidebar} />

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;