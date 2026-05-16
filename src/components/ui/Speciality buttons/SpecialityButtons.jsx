import React, { useState } from 'react'
import styles from "./SpecialityButtons.module.css"
import doctorData from '../../../Data';
const SpecialityButtons = ({ selectedSpeciality, setSelectedSpeciality }) => {
  const specialities = [
    "All",
    ...new Set(doctorData.map((doc) => doc.speciality)),
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

export default SpecialityButtons