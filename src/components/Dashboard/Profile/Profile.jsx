import React from "react";
import styles from "./Profile.module.css";
const Profile = () => {
  return (
    <>
      <div className={styles.profile}>
        <h1>Profile</h1>
        <form className={styles.form}>
          <div className={styles.input}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Enter Your Name" />
          </div>
          <div className={styles.input}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter Your Email" />
          </div>
          <div className={styles.input}>
            <label htmlFor="location">Location</label>
            <select name="" id="location">
              <option value="cairo">Cairo</option>
              <option value="giza">Giza</option>
            </select>
          </div>
          <div className={styles.input}>
            <label htmlFor="phone">Phone Number</label>
            <input type="text" id="phone" placeholder="Enter Your Phone" />
          </div>
           <div className={styles.input}>
            <label htmlFor="nid">National Id</label>
            <input type="text" id="nid" placeholder="Enter Your National Id" />
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
