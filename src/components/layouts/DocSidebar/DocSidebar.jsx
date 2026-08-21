import React from "react";
import styles from "./DocSidebar.module.css";
import profile from "../../../assets/doctor1.png";

const DocSidebar = ({ doctor }) => {
  const name = doctor?.userId?.name || "Doctor";
  const image = doctor?.userId?.profileImage || profile;
  const rating = doctor?.rating?.average ?? 0;
  const fee = doctor?.consultationFee;

  return (
    <div className={styles.DocSidebar}>
      <img
        src={image}
        alt={name}
        onError={(e) => {
          e.currentTarget.src = profile;
        }}
      />

      <p className={styles.name}>{name}</p>
      {doctor?.specialty && (
        <p className={styles.specialty}>{doctor.specialty}</p>
      )}

      <div className={styles.rate}>
        <span>★</span>
        <span>{rating.toFixed ? rating.toFixed(1) : rating}</span>
      </div>

      <div className={styles.data}>
        <button aria-label="Schedule">
          <i className="fa-regular fa-calendar"></i>
        </button>
        <button aria-label="Call">
          <i className="fa-solid fa-phone"></i>
        </button>
        <button aria-label="Message">
          <i className="fa-regular fa-envelope"></i>
        </button>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.info}>
        {fee != null && <p className={styles.feeRange}>{fee} $</p>}
        <p className={styles.availability}>Online / Offline</p>
        {fee != null && (
          <div className={styles.infoRow}>
            <i className="fa-regular fa-envelope"></i>
            <span>Price : {fee}</span>
          </div>
        )}
      </div>

      <button className={styles.bookBtn}>Book Appointment</button>
    </div>
  );
};

export default DocSidebar;
