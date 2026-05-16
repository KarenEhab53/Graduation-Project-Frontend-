import React from "react";
import styles from "./Offer.module.css";

const Offer = () => {
  const offers = [
    {
      icon: " fa-truck-medical",
      title: "Ambulance",
      description:
        "We provide communication between you and the ambulances to the nearest hospital or the most efficient hospital",
    },
    {
      icon: "fa-stethoscope",
      title: "Appointments",
      description:
        "We provide communication between you and the ambulances to the nearest hospital or the most efficient hospital",
    },
    {
      icon: "fa-file-medical",
      title: "Ambulance",
      description:
        "We provide communication between you and the ambulances to the nearest hospital or the most efficient hospital",
    },
    {
      icon: "fa-message",
      title: "Chat",
      description:
        "We provide communication between you and the ambulances to the nearest hospital or the most efficient hospital",
    },
  ];
  return (
    <div className={styles.Offer}>
      <h2>What we Offer</h2>
      <div className={styles.card}>
        <h3>Our Medical Services</h3>
        <div className={styles.items}>
          {offers.map((data, index) => (
            <div className={styles.data} key={index}>
              <div className={styles.icon}>
                <i className={`fa-solid ${data.icon}`}></i>
              </div>
              <h4>{data.title}</h4>
              <p>{data.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Offer;
