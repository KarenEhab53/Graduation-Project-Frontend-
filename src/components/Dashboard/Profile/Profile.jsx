import React, { useEffect, useMemo, useState } from "react";
import styles from "./Profile.module.css";
import Swal from "sweetalert2";
import { useProfile } from "../../../context/ProfileContext.jsx";

const Profile = () => {
  const {
    profile,
    loading,
    fetchProfile,
    updateProfile,
    locations,
    fetchLocations,
  } = useProfile();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({});

  const profileForm = useMemo(
    () => ({
      name: profile?.name || "",
      email: profile?.email || "",
      NID: profile?.NID || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
    }),
    [profile]
  );

  const mergedForm = { ...profileForm, ...form };

  useEffect(() => {
    fetchProfile().catch(() => {
      Swal.fire({
        icon: "error",
        title: "Couldn't load profile",
        text: "Please try refreshing the page.",
      });
    });
    fetchLocations();
  }, [fetchProfile, fetchLocations]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        location: form.location,
      });

      Swal.fire({
        icon: "success",
        title: "Profile updated",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className={styles.profile}>
        <h1>Profile</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      <h1>Profile</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter Your Name"
            value={mergedForm.name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.input}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={mergedForm.email}
            disabled
            readOnly
          />
        </div>

        <div className={styles.input}>
          <label htmlFor="location">Location</label>
          <select
            id="location"
            name="location"
            value={mergedForm.location}
            onChange={handleChange}
          >
            {locations.length === 0 ? (
              <option value="">Loading...</option>
            ) : (
              locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))
            )}
          </select>
        </div>

        <div className={styles.input}>
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="Enter Your Phone"
            value={mergedForm.phone}
            onChange={handleChange}
          />
        </div>

        <div className={styles.input}>
          <label htmlFor="NID">National Id</label>
          <input
            type="text"
            id="NID"
            name="NID"
            value={mergedForm.NID}
            disabled
            readOnly
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
