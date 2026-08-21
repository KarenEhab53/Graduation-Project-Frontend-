import React, { useState } from "react";
import styles from "./ViewDoc.module.css";
import api from "../../../api/api";

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

const isImageUrl = (url) => /\.(png|jpe?g|webp|gif)$/i.test(url.split("?")[0]);

const ViewDoc = ({ record, onClose, onSaved }) => {
  // documents mirrors the server's current state — every action below
  // updates it optimistically, then confirms (or reverts) against the
  // actual response, so the list is always "live" rather than staged.
  const [documents, setDocuments] = useState(record?.documents || []);
  const [removingUrl, setRemovingUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  if (!record) return null;

  const persist = async (formExtras) => {
    const formData = new FormData();
    // Resend the rest of the record unchanged since update-file only
    // overwrites fields present in the body.
    formData.append("title", record.title);
    formData.append("description", record.description);
    formData.append("doctorName", record.doctorName);
    formData.append("recordDate", record.recordDate);
    formExtras(formData);

    const res = await api.put(`/update-file/${record._id}`, formData);
    return res.data?.record?.documents ?? null;
  };

  const handleFilePick = async (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    if (picked.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      const updatedDocs = await persist((formData) => {
        picked.forEach((file) => formData.append("documents", file));
      });
      setDocuments(updatedDocs || documents);
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (url) => {
    setRemovingUrl(url);
    setError(null);
    const prev = documents;
    setDocuments((docs) => docs.filter((d) => d !== url)); // optimistic
    try {
      const updatedDocs = await persist((formData) => {
        formData.append("removeDocuments", url);
      });
      if (updatedDocs) setDocuments(updatedDocs);
      if (onSaved) onSaved();
    } catch (err) {
      setDocuments(prev); // revert on failure
      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not remove document",
      );
    } finally {
      setRemovingUrl(null);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{record.title}</h3>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className={styles.subtitle}>Documents</p>

        {documents.length > 0 ? (
          <ul className={styles.docList}>
            {documents.map((url) => (
              <li key={url} className={styles.docItem}>
                {isImageUrl(url) ? (
                  <img src={url} alt="" className={styles.thumb} />
                ) : (
                  <span className={styles.docIcon}>📄</span>
                )}
                <span className={styles.docName}>{fileNameFromUrl(url)}</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.openLink}
                >
                  Open
                </a>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemove(url)}
                  disabled={removingUrl === url}
                  aria-label="Remove document"
                >
                  {removingUrl === url ? (
                    <span className={styles.spinner} />
                  ) : (
                    "×"
                  )}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>No documents attached to this record.</p>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <label
          className={`${styles.uploadBtn} ${uploading ? styles.uploadBtnBusy : ""}`}
        >
          {uploading ? (
            <>
              <span className={styles.spinner} /> Uploading…
            </>
          ) : (
            "+ Add documents"
          )}
          <input
            type="file"
            multiple
            onChange={handleFilePick}
            disabled={uploading}
            className={styles.hiddenFileInput}
          />
        </label>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.closeFooterBtn}
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDoc;
