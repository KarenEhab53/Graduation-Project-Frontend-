import { useEffect } from "react";
import { X } from "lucide-react";
import styles from "./DoctorDocumentsModal.module.css";

const DOCS = [
  { key: "syndicateCardImage", label: "Syndicate Card" },
  { key: "universityCertificateImage", label: "University Certificate" },
  { key: "nationalIdImage", label: "National ID" },
];

const DoctorDocumentsModal = ({
  doctor,
  isApproved,
  actioning,
  onApprove,
  onRevoke,
  onClose,
}) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!doctor) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={16} strokeWidth={2} />
        </button>

        <div className={styles.header}>
          <img
            src={doctor.profileImage}
            alt={doctor.name}
            className={styles.profileImg}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div>
            <h2 className={styles.name}>{doctor.name}</h2>
            <p className={styles.email}>{doctor.email}</p>
            <p className={styles.meta}>
              {doctor.location} • {doctor.phone} • NID: {doctor.NID}
            </p>
          </div>
          <span className={isApproved ? styles.badgeApproved : styles.badgePending}>
            {isApproved ? "Approved" : "Pending"}
          </span>
        </div>

        <h3 className={styles.sectionTitle}>Submitted Documents</h3>
        <div className={styles.docsGrid}>
          {DOCS.map(({ key, label }) => {
            const url = doctor.doctorInfo?.[key];
            return (
              <a
                key={key}
                href={url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.docCard}
                onClick={(e) => !url && e.preventDefault()}
              >
                {url ? (
                  <img src={url} alt={label} className={styles.docImg} />
                ) : (
                  <div className={styles.docMissing}>Not submitted</div>
                )}
                <span className={styles.docLabel}>{label}</span>
              </a>
            );
          })}
        </div>

        <div className={styles.footer}>
          {isApproved ? (
            <button
              className={styles.revokeBtn}
              onClick={() => onRevoke(doctor._id)}
              disabled={actioning}
            >
              {actioning ? "..." : "Revoke Doctor"}
            </button>
          ) : (
            <button
              className={styles.approveBtn}
              onClick={() => onApprove(doctor._id)}
              disabled={actioning}
            >
              {actioning ? "..." : "Approve Doctor"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDocumentsModal;