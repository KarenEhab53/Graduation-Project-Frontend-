import styles from "./DoctorCard.module.css";
import docimg from "../../../assets/doctor1.png";
import { NavLink } from "react-router-dom";

const DoctorCard = ({ filteredDoctors }) => {
  return (
    <>
      {filteredDoctors.map((data) => {
        console.log("Doctor data:", data);

        return (
          <NavLink
            key={data._id}
            to={`/doctor-profile/${data._id}`}
            className={styles.card}
          >
            <div className={styles.image}>
              <img
                src={data.userId?.profileImage || docimg}
                alt={data.userId?.name || "doctor"}
                onError={(e) => {
                  e.currentTarget.src = docimg;
                }}
              />
            </div>

            <div className={styles.data}>
              <p className={styles.name}>{data.userId?.name}</p>

              <p className={styles.speciality}>{data.specialty}</p>
            </div>
          </NavLink>
        );
      })}
    </>
  );
};

export default DoctorCard;
