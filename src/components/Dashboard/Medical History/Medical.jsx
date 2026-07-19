import React, { useState } from "react";
import styles from "./Medical.module.css";
import MedicalFolder from "../../ui/Medical Folder/MedicalFolder";
import MedicalRecord from "../../ui/Medical Record/MedicalRecord";

const Medical = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);

  return (
    <div className={styles.medicalHistory}>
      <h1>Medical History</h1>
      <MedicalFolder onSelectFolder={setSelectedFolder} />

      {selectedFolder ? (
        <MedicalRecord folderId={selectedFolder._id} />
      ) : (
        <p className={styles.emptyState}>
          Select a folder above to see its medical history.
        </p>
      )}
    </div>
  );
};

export default Medical;
