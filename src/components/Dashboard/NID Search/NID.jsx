import React from 'react'
import styles from './NID.module.css'
const NID = () => {
  return (
    <>
      <div className={styles.nid}>
        <h1>ID Search</h1>
        <form className={styles.form}>
          <div className={styles.input}>
            <label htmlFor="phone">My Phone number</label>
            <input type="text" id="phone" placeholder="Enter Your Phone" />
          </div>
          <div className={styles.input}>
            <label htmlFor="emergency">First emergency number</label>
            <input
              type="text"
              id="emergency"
              placeholder="Enter emergency number"
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="Address">Address</label>
            <input type="text" id="Address" placeholder="Enter Your Address" />
          </div>
          <div className={styles.input}>
            <label htmlFor="Note">Note</label>
            <p>
              Do you have any chronic diseases or medications? Please write in
              case of emergency.
            </p>
            <input type="text" id="Note" placeholder="Enter Your Note" />
          </div>
          <div className={styles.input}>
            <label htmlFor="Photo">Photo</label>
            <input type="file" id="Photo"/>
          </div>
          <button type="submit">Add NID</button>
        </form>
      </div>
    </>
  );
}

export default NID