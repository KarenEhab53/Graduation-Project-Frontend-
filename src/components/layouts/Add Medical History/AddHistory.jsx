import React, { useState } from "react";
import styles from "./AddHistory.module.css";
import api from "../../../api/api";
import { MdCancel } from "react-icons/md";

const toInputDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().slice(0, 10);
};

const fileNameFromUrl = (url) => {
  try {
    const clean = url.split("?")[0];
    return decodeURIComponent(clean.substring(clean.lastIndexOf("/") + 1));
  } catch {
    return url;
  }
};

const AddHistory = ({ folderId, record, onClose, onSaved }) => {
  const isEdit = Boolean(record);
  const [title, setTitle] = useState(record?.title || "");
  const [doctorName, setDoctorName] = useState(record?.doctorName || "");
  const [recordDate, setRecordDate] = useState(
    toInputDate(record?.recordDate) || toInputDate(new Date()),
  );
  const [description, setDescription] = useState(record?.description || "");

  const [existingDocuments, setExistingDocuments] = useState(
    record?.documents || [],
  );
  const [newFiles, setNewFiles] = useState([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleFilePick = (e) => {
    const picked = Array.from(e.target.files || []);
    setNewFiles((prev) => [...prev, ...picked]);
    e.target.value = "";
  };

  const removeNewFile = (idx) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExistingDocument = (url) => {
    setExistingDocuments((prev) => prev.filter((d) => d !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("doctorName", doctorName);
      formData.append("recordDate", recordDate);
      formData.append("description", description);
      if (!isEdit) formData.append("folderId", folderId);

      existingDocuments.forEach((url) =>
        formData.append("existingDocuments", url),
      );

      // Newly added files to upload — this is the part that was missing,
      // which is why images never actually got sent to the server.
      // If your multer route uses a different field name than "files"
      // (e.g. upload.array("attachments")), change it here to match.
      newFiles.forEach((file) => formData.append("files", file));

      if (isEdit) {
        await api.put(`/update-file/${record._id}`, formData);
      } else {
        await api.post(`/create-file/${folderId}`, formData);
      }
      onSaved();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          (isEdit ? "Could not update history" : "Could not add history"),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <form
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className={styles.header}>
          <h3>{isEdit ? "Edit History" : "Add New History"}</h3>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <MdCancel />
          </button>
        </div>

        <label className={styles.field}>
          <span>Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label className={styles.field}>
          <span>Treating Physician</span>
          <input
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            required
          />
        </label>

        <label className={styles.field}>
          <span>Date</span>
          <input
            type="date"
            value={recordDate}
            onChange={(e) => setRecordDate(e.target.value)}
            required
          />
        </label>

        <label className={styles.field}>
          <span>Note</span>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <div className={styles.field}>
          <span>Documents</span>

          {existingDocuments.length > 0 && (
            <ul className={styles.docList}>
              {existingDocuments.map((url) => (
                <li key={url} className={styles.docItem}>
                  <span className={styles.docName}>{fileNameFromUrl(url)}</span>
                  <button
                    type="button"
                    className={styles.docRemoveBtn}
                    onClick={() => removeExistingDocument(url)}
                    aria-label="Remove document"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          {newFiles.length > 0 && (
            <ul className={styles.docList}>
              {newFiles.map((file, idx) => (
                <li key={`${file.name}-${idx}`} className={styles.docItem}>
                  <span className={styles.docName}>{file.name}</span>
                  <span className={styles.docBadge}>new</span>
                  <button
                    type="button"
                    className={styles.docRemoveBtn}
                    onClick={() => removeNewFile(idx)}
                    aria-label="Remove file"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          <label className={styles.uploadBtn}>
            + Add documents
            <input
              type="file"
              multiple
              onChange={handleFilePick}
              className={styles.hiddenFileInput}
            />
          </label>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHistory;
