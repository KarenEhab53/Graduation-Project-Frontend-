// src/pages/NotFound/NotFound.jsx
import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

function NotFound() {
  return (
    <div className={styles.notfound}>
      <div className={styles.pulse} aria-hidden="true">
        <svg viewBox="0 0 600 120" className={styles.pulseSvg}>
          <polyline
            className={styles.pulseLine}
            points="0,60 80,60 100,60 115,20 130,100 145,60 160,60 220,60 240,60 255,30 270,90 285,60 300,60 600,60"
            fill="none"
          />
        </svg>
      </div>

      <p className={styles.eyebrow}>Page not found</p>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>
        This page flatlined. The link might be broken, or the page may have
        moved.
      </p>

      <Link to="/" className={styles.cta}>
        Back to safety
      </Link>
    </div>
  );
}

export default NotFound;
