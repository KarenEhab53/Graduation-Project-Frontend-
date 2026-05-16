import styles from "./DoctorCard.module.css";
import doctorData from "../../../Data";
import docimg from "../../../assets/doctor1.png";
import { NavLink } from "react-router-dom";

const DoctorCard = ({ filteredDoctors }) => {
  return (
    <>
    
      {filteredDoctors.map((data) => (
        <div key={data.id} className={styles.card}>
          <div className={styles.image}>
            <img src={docimg} alt="doctor" />
          </div>

          <div className={styles.data}>
            <p className={styles.name}>{data.name}</p>
            <p className={styles.speciality}>{data.speciality}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default DoctorCard;
