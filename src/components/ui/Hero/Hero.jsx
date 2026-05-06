import React from 'react'
import styles from './Hero.module.css'
import hero from '../../../assets/hero.png'
const Hero = () => {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.content}>
          <h2>
            <span>Have an emergency?</span> Search by national ID number to find
            out the patient's record <span>OR</span> Find the nearest hospital
            with an ambulance
          </h2>
          <div className={styles.buttons}>
            <button>Search by ID</button>
            <button>Search for Doctors</button>
          </div>
        </div>
        <div className={styles.image}>
            <img src={hero} alt="Hero" />
        </div>
      </div>
    </>
  );
}

export default Hero