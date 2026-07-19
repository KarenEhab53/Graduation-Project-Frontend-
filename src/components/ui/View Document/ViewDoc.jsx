import React from "react";
import styles from "./ViewDoc.module.css";

const fileNameFromUrl = (url) => {
  try {
    const clean = url.split("?")[0];
    return (
      decodeURIComponent(clean.substring(clean.lastIndexOf("/") + 1)) ||
      "Document"
    );
  } catch {
    return "Document";
  }
};

const ViewDoc = ({ record, onClose }) => {
  if (!record) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{record.title} — Documents</h3>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {record.documents && record.documents.length > 0 ? (
          <ul className={styles.docList}>
            {record.documents.map((url, i) => (
              <li key={i} className={styles.docItem}>
                <span className={styles.docIcon}>📄</span>
                <span className={styles.docName}>{fileNameFromUrl(url)}</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.openLink}
                >
                  Open
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>No documents attached to this record.</p>
        )}
      </div>
    </div>
  );
};

export default ViewDoc;
