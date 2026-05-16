import React, { useState } from "react";
import SpecialityButtons from "../../components/ui/Speciality buttons/SpecialityButtons";
import DoctorCard from "../../components/ui/Doctor Card/DoctorCard";
import styles from "./OurDoctors.module.css";
import doctorData from "../../Data";
import { NavLink } from "react-router-dom";

const OurDoctors = () => {
  const [selectedSpeciality, setSelectedSpeciality] = useState("All");

  const filteredDoctors =
    selectedSpeciality === "All"
      ? doctorData
      : doctorData.filter((doc) => doc.speciality === selectedSpeciality);

  return (
    <div className={styles.OurDoctors}>
        <div className={styles.headers}>
            <h2>Our Doctors</h2>
            <NavLink to='/our-doctors'>see all</NavLink>
        </div>
      <div className={styles.doctorCard}>
        <SpecialityButtons
          selectedSpeciality={selectedSpeciality}
          setSelectedSpeciality={setSelectedSpeciality}
        />

        <div className={styles.cards}>
          <DoctorCard filteredDoctors={filteredDoctors} />
        </div>
      </div>
    </div>
  );
};

export default OurDoctors;
