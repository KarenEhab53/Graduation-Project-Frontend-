import React from 'react'
import styles from './DocSidebar.module.css'
import profile from '../../../assets/doctor1.png'

const DocSidebar = () => {
  return (
    <div className={styles.DocSidebar}>
      <img src={profile} alt="Doctor profile" />

      <div className={styles.rate}>
        <span style={{ color: '#ffe066' }}>★</span>
        <span>4.8</span>
      </div>

      <div className={styles.data}>
        <button aria-label="Schedule"><i className="fa-regular fa-calendar"></i></button>
        <button aria-label="Call"><i className="fa-solid fa-phone"></i></button>
        <button aria-label="Message"><i className="fa-regular fa-envelope"></i></button>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.info}>
        <p className={styles.feeRange}>200-450 $</p>
        <p className={styles.availability}>Online / Offline</p>
        <div className={styles.infoRow}>
          <i className="fa-regular fa-envelope"></i>
          <span>Price : 200</span>
        </div>
        <div className={styles.infoRow}>
          <i className="fa-regular fa-clock"></i>
          <span>Waiting Time : 18 Minutes</span>
        </div>
        <div className={styles.infoRow}>
          <i className="fa-solid fa-phone"></i>
          <span>1599 : Cost of regular call</span>
        </div>
      </div>

      <button className={styles.bookBtn}>Book Appointment</button>
    </div>
  )
}

export default DocSidebar