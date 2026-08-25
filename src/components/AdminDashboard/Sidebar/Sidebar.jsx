import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, Stethoscope, Users, MessageSquare, LogOut, X } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext.jsx";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { to: "", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "doctors", label: "Doctor", icon: Stethoscope },
  { to: "users", label: "Users", icon: Users },
  { to: "chat", label: "Chat", icon: MessageSquare },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Log out?",
      text: "You'll need to sign in again to access the dashboard.",
      showCancelButton: true,
      confirmButtonText: "Log out",
      confirmButtonColor: "#cb2027",
    });
    if (!result.isConfirmed) return;

    logout?.();
    navigate("/admin/login", { replace: true });
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      <div className={styles.topRow}>
        <NavLink to="/">
          <div className={styles.logo}>
            SWIFT<span>care</span>
          </div>
        </NavLink>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={20} strokeWidth={2} />
        </button>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const IconComponent = item.icon;
          return item.disabled ? (
            <span
              key={item.label}
              className={`${styles.navItem} ${styles.navItemDisabled}`}
              title="Coming soon"
            >
              <IconComponent size={20} strokeWidth={1.8} />
              <span>{item.label}</span>
            </span>
          ) : (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                isActive
                  ? `${styles.navItem} ${styles.navItemActive}`
                  : styles.navItem
              }
            >
              <IconComponent size={20} strokeWidth={1.8} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
        <LogOut size={20} strokeWidth={1.8} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;