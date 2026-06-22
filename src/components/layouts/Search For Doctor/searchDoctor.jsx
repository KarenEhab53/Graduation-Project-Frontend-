import { useState, useEffect } from "react";
import { useDoctors } from "../../../context/DoctorContext";
import styles from "./searchDoctor.module.css";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const SearchDoctor = () => {
  const {
    doctors,
    loading,
    error,
    specialties,
    cities,
    searchDoctors,
    resetDoctors,
    fetchFilterOptions,
  } = useDoctors();

  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [name, setName] = useState("");

  const hasFilters = specialty || city || name;

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  const handleSearch = () => searchDoctors({ specialty, city, name });

  const handleReset = () => {
    setSpecialty("");
    setCity("");
    setName("");
    resetDoctors();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={styles.wrap}>
      <h1 className={styles.pageTitle}>Schedule a Doctor Appointment</h1>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <i className={`ti ti-calendar-event ${styles.cardIcon}`} />
          <div>
            <p className={styles.cardTitle}>Book a doctor</p>
            <p className={styles.cardSub}>Examination or procedure</p>
          </div>
        </div>

        <div className={styles.filters}>
          <div className={styles.filterCell}>
            <span className={styles.filterLabel}>
              <i className="ti ti-chevron-down" /> Select a specialty
            </span>
            <div className={styles.filterInput}>
              <i className="ti ti-stethoscope" />
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              >
                <option value="">Choose specialty</option>
                {specialties.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.filterCell}>
            <span className={styles.filterLabel}>
              <i className="ti ti-chevron-down" /> In this city
            </span>
            <div className={styles.filterInput}>
              <i className="ti ti-map-pin" />
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">Choose city</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.filterCell}>
            <span className={styles.filterLabel}>
              <i className="ti ti-chevron-down" /> Search by name
            </span>
            <div className={styles.filterInput}>
              <i className="ti ti-user-search" />
              <input
                type="text"
                placeholder="Name of the doctor..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <button className={styles.searchBtn} onClick={handleSearch}>
            Search
          </button>
        </div>

        {hasFilters && (
          <button className={styles.resetBtn} onClick={handleReset}>
            <i className="ti ti-x" /> Clear filters
          </button>
        )}

        <div className={styles.results}>
          {loading && (
            <p className={styles.loading}>
              <i className="ti ti-loader-2" /> Loading doctors...
            </p>
          )}

          {!loading && error && <p className={styles.error}>{error}</p>}

          {!loading && !error && doctors.length === 0 && (
            <p className={styles.empty}>No doctors match your search.</p>
          )}

          {!loading &&
            !error &&
            doctors.map((doc) => (
              <div key={doc._id} className={styles.resultCard}>
                {doc.userId?.profileImage ? (
                  <img
                    src={doc.userId.profileImage}
                    alt={doc.userId.name}
                    className={styles.avatar}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={styles.avatarFallback}
                  style={{
                    display: doc.userId?.profileImage ? "none" : "flex",
                  }}
                >
                  {getInitials(doc.userId?.name)}
                </div>

                <div className={styles.docInfo}>
                  <p className={styles.docName}>Dr. {doc.userId?.name}</p>
                  <div className={styles.docMeta}>
                    <span>
                      <i className="ti ti-stethoscope" /> {doc.specialty}
                    </span>
                    <span>
                      <i className="ti ti-map-pin" />{" "}
                      {doc.userId?.location || "—"}
                    </span>
                    <span>
                      <i className="ti ti-briefcase" /> {doc.experienceYears}{" "}
                      yrs exp
                    </span>

                  </div>
                </div>

                <span className={styles.badge}>Available</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SearchDoctor;
