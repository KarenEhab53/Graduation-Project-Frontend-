import React, { useEffect, useState } from "react";
import SpecialityButtons from "../../ui/Speciality buttons/SpecialityButtons";
import DoctorCard from "../../ui/Doctor Card/DoctorCard";
import styles from "./OurDoctors.module.css";
import api from "../../../api/api";
import { NavLink } from "react-router-dom";

const OurDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("All");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/get-all-doctor-data")
      .then((res) => {
        if (cancelled) return;
        setDoctors(res.data?.data || []);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to load doctors");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredDoctors =
    selectedSpeciality === "All"
      ? doctors
      : doctors.filter((doc) => doc.specialty === selectedSpeciality);

  return (
    <div className={styles.OurDoctors}>
      <div className={styles.headers}>
        <h2>Our Doctors</h2>
        <NavLink to="/alldoctors">see all</NavLink>
      </div>
      <div className={styles.doctorCard}>
        <SpecialityButtons
          doctors={doctors}
          selectedSpeciality={selectedSpeciality}
          setSelectedSpeciality={setSelectedSpeciality}
        />

        <div className={styles.cards}>
          {loading && <p>Loading doctors…</p>}
          {!loading && error && <p>{error}</p>}
          {!loading && !error && filteredDoctors.length === 0 && (
            <p>No doctors found.</p>
          )}
          {!loading && !error && filteredDoctors.length > 0 && (
            <DoctorCard filteredDoctors={filteredDoctors} />
          )}
        </div>
      </div>
    </div>
  );
};

export default OurDoctors;
