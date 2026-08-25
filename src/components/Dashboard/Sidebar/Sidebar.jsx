import  { useRef, useState } from "react";
import styles from "./Sidebar.module.css";
import { NavLink, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useProfile } from "../../../context/ProfileContext.jsx";
import defaultProfile from "../../../assets/user.png";

const Sidebar = ({ links }) => {
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const { updateProfileImage } = useProfile();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleImageClick = () => {
    if (uploading) return;
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleImageClick();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const updatedUser = await updateProfileImage(file);
      updateUser({ profileImage: updatedUser.profileImage });

      Swal.fire({
        icon: "success",
        title: "Photo updated",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.info}>
        <div
          className={styles.image}
          onClick={handleImageClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Change profile photo"
        >
          <img src={user?.profileImage || defaultProfile} alt="profile" />
          <div className={styles.imageOverlay}>
            {uploading ? "..." : "Edit"}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            hidden
          />
        </div>

        <h4>{user?.name || "User"}</h4>
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