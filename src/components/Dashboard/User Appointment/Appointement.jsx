import React, { useState } from "react";
import styles from "./Appointement.module.css";
import AppoinCard from "../../ui/User Appointement Card/AppoinCard";

const Appointement = ({
  appointments = [],
  getStatusClass,
  getImageUrl,
  formatDateTime,
  handleStatusClick,
  imgdoc,
}) => {
  const [filter, setFilter] = useState("All");

  const filters = ["Coming", "Completed", "Cancelled", "Pending", "All"];

  return (
    <div className={styles.appointmentContainer}>
      <h1>My Appointments</h1>
      <div className={styles.filterButtons}>
        {filters.map((status) => (
          <button
            key={status}
            className={`${styles.filterBtn} ${styles[status.toLowerCase()] || ""} ${
              filter === status ? styles.active : ""
            }`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>
      <div className={styles.cardsList}>
        <AppoinCard
          filter={filter}
          appointments={appointments}
          getStatusClass={getStatusClass}
          getImageUrl={getImageUrl}
          formatDateTime={formatDateTime}
          handleStatusClick={handleStatusClick}
          imgdoc={imgdoc}
        />
      </div>
    </div>
  );
};

export default Appointement;
