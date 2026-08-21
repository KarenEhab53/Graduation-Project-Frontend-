import React from "react";
import styles from "./SpecialityButtons.module.css";

const SpecialityButtons = ({
  doctors,
  selectedSpeciality,
  setSelectedSpeciality,
}) => {
  const specialities = [
    "All",
    ...new Set(doctors.map((doc) => doc.specialty).filter(Boolean)),
  ];

  return (
    <div className={styles.filters}>
      {specialities.map((spec) => (
        <button
          key={spec}
          onClick={() => setSelectedSpeciality(spec)}
          className={`${styles.button} ${
            selectedSpeciality === spec ? styles.active : ""
          }`}
        >
          {spec}
        </button>
      ))}
    </div>
  );
};

export default SpecialityButtons;
