import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, UserRound, Camera, Menu } from "lucide-react";
import Swal from "sweetalert2";
import { getProfile, updateProfile } from "../../../services/adminService";
import styles from "./Topbar.module.css";

const Topbar = ({ onMenuClick }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  );
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    setLoadingUser(true);
    try {
      const res = await getProfile();
      const fetchedUser = res.data?.user || res.data?.data || res.data;
      setUser(fetchedUser || null);
    } catch (error) {
      console.error("Couldn't load profile:", error);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    setSearchParams(params, { replace: true });
  };

  const handleAvatarClick = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    setUploading(true);
    try {
      const res = await updateProfile(formData);
      const updatedUser = res.data?.user || res.data?.data || res.data;

      if (updatedUser) {
        setUser((prev) => ({ ...prev, ...updatedUser }));
      } else {
        // fall back to a full refetch if the response shape is unexpected
        await fetchProfile();
      }

      Swal.fire({
        icon: "success",
        title: "Profile photo updated",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Couldn't update photo",
        text: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <header className={styles.topbar}>
      <button
        type="button"
        className={styles.menuBtn}
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={22} strokeWidth={2} />
      </button>

      <div className={styles.search}>
        <Search size={18} strokeWidth={2} />
        <input
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      <div className={styles.profile}>
        <button
          type="button"
          className={styles.avatar}
          onClick={handleAvatarClick}
          disabled={uploading || loadingUser}
          title="Change profile photo"
        >
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user?.name || "Admin"}
              className={styles.avatarImg}
            />
          ) : (
            <UserRound size={20} strokeWidth={1.8} />
          )}
          <span className={styles.avatarOverlay}>
            <Camera size={13} strokeWidth={2} />
          </span>
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <span className={styles.profileName}>
          {loadingUser ? "…" : user?.name || "Admin"}
        </span>
      </div>
    </header>
  );
};

export default Topbar;
