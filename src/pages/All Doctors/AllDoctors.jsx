import React, { useEffect, useState } from "react";
import SpecialityButtons from "../../components/ui/Speciality buttons/SpecialityButtons";
import DoctorCard from "../../components/ui/Doctor Card/DoctorCard";
import styles from "./AllDoctors.module.css";
import api from "../../api/api";

const AllDoctors = () => {
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
    <div className={styles.AllDoctors}>
      <div className={styles.headers}>
        <h2>Our Doctors</h2>
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

export default AllDoctors;
