import React from 'react'
import styles from './Hero.module.css'
import hero from '../../../assets/hero.png'
import { Link } from 'react-router-dom';
const Hero = () => {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h2>
              <span>Have an emergency?</span> Search by national ID number to
              find out the patient's record <span>OR</span> Find the nearest
              hospital with an ambulance
            </h2>
            <div className={styles.buttons}>
              <Link to="/search-patient"><button>Search by ID</button></Link>
              <button>Search for Doctors</button>
            </div>
          </div>
          <div className={styles.image}>
            <img src={hero} alt="Hero" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero