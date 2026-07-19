import React, { useEffect, useState, useCallback } from "react";
import styles from "./MedicalRecord.module.css";
import ViewDoc from "../View Document/ViewDoc";
import AddHistoryModal from "../../layouts/Add Medical History/AddHistory";
import api from "../../../api/api";

const monthYear = (dateStr) => {
  const d = new Date(dateStr);
  return {
    month: d.toLocaleString("en-US", { month: "short" }),
    year: d.getFullYear(),
  };
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

const MedicalRecord = ({ folderId }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [viewDocRecord, setViewDocRecord] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/get-file/${folderId}`);
      const data = res.data;
      // Be defensive about response shape until confirmed against the API
      const list = Array.isArray(data)
        ? data
        : data.records || data.file || data.files || [];
      const sorted = [...list].sort(
        (a, b) => new Date(b.recordDate) - new Date(a.recordDate),
      );
      setRecords(sorted);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    if (folderId) fetchRecords();
  }, [folderId, fetchRecords]);

  const handleDelete = async (recordId) => {
    setOpenMenuId(null);
    const prev = records;
    setRecords((r) => r.filter((rec) => rec._id !== recordId));
    try {
      await api.delete(`/delete-file/${recordId}`);
    } catch (err) {
      setRecords(prev); // revert on failure
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleEdit = (record) => {
    setOpenMenuId(null);
    setEditingRecord(record);
    setAddModalOpen(true);
  };

  const handleSaved = () => {
    setAddModalOpen(false);
    setEditingRecord(null);
    fetchRecords();
  };

  const addEntryRow = (
    <div className={styles.addEntry}>
      <div className={styles.dateCol}>
        <span>Now</span>
      </div>
      <div className={styles.rail}>
        <div className={styles.diamond} />
      </div>
      <button
        className={styles.addLink}
        onClick={() => {
          setEditingRecord(null);
          setAddModalOpen(true);
        }}
      >
        Add New History
      </button>
    </div>
  );

  if (loading) {
    return <div className={styles.status}>Loading history…</div>;
  }

  if (error) {
    return (
      <div className={styles.status}>
        Couldn't load medical history. {error}
        <button className={styles.retryBtn} onClick={fetchRecords}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.timeline}>
      {records.length === 0 && (
        <p className={styles.status}>No history yet for this folder.</p>
      )}

      {records.map((record, idx) => {
        const { month, year } = monthYear(record.recordDate);
        const isLast = idx === records.length - 1;
        return (
          <div key={record._id || idx} className={styles.entry}>
            <div className={styles.dateCol}>
              <span>{month}</span>
              <span>{year}</span>
            </div>

            <div className={styles.rail}>
              <div className={styles.dot} />
              {!isLast && <div className={styles.line} />}
            </div>

            <div className={styles.content}>
              <div className={styles.headerRow}>
                <h3 className={styles.title}>{record.title}</h3>
                <div className={styles.actions}>
                  {record.documents && record.documents.length > 0 && (
                    <button
                      className={styles.viewDocsBtn}
                      onClick={() => setViewDocRecord(record)}
                    >
                      View documents
                    </button>
                  )}
                  <div className={styles.menuWrap}>
                    <button
                      className={styles.menuBtn}
                      aria-label="More options"
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === record._id ? null : record._id,
                        )
                      }
                    >
                      ⋮
                    </button>
                    {openMenuId === record._id && (
                      <div className={styles.menuDropdown}>
                        <button onClick={() => handleEdit(record)}>Edit</button>
                        <button
                          onClick={() => handleDelete(record._id)}
                          className={styles.danger}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <p className={styles.meta}>
                Treating Physician : {record.doctorName}
              </p>
              <p className={styles.meta}>{formatDate(record.recordDate)}</p>

              {record.description && (
                <p className={styles.note}>
                  <span className={styles.noteLabel}>
                    Note : {formatDate(record.recordDate)} :{" "}
                  </span>
                  {record.description}
                </p>
              )}
            </div>

            {!isLast && <div className={styles.divider} />}
          </div>
        );
      })}

      {addEntryRow}

      {viewDocRecord && (
        <ViewDoc
          record={viewDocRecord}
          onClose={() => setViewDocRecord(null)}
        />
      )}

      {addModalOpen && (
        <AddHistoryModal
          folderId={folderId}
          record={editingRecord}
          onClose={() => {
            setAddModalOpen(false);
            setEditingRecord(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default MedicalRecord;
