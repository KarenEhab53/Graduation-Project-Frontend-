import { NavLink } from "react-router-dom";
import styles from "./SuccessStep.module.css";

export default function SuccessStep({ onDone }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>✓</div>
      <h2 className={styles.title}>Password Updated</h2>
      <p className={styles.sub}>You can now log in with your new password.</p>

      <NavLink to="/auth/login" className={styles.btn} onClick={onDone}>
        Go to Login
      </NavLink>
    </div>
  );
}
