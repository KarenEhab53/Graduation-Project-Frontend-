import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "./MedicalFolder.module.css";
import { useMedical } from "../../../context/MedicalContext";

const DISEASE_OPTIONS = [
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Asthma",
  "Cancer",
  "Kidney Disease",
  "Liver Disease",
  "Arthritis",
  "Migraine",
  "Epilepsy",
  "Thyroid Disorder",
  "Anemia",
  "Depression",
  "Anxiety",
  "COVID-19",
  "Other",
];

const ScanIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 8V5a2 2 0 012-2h3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M21 16v3a2 2 0 01-2 2h-3M3 12h18"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const UpdateIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const KebabIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="5" r="1.6" fill="currentColor" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    <circle cx="12" cy="19" r="1.6" fill="currentColor" />
  </svg>
);

const ChevronArrow = ({ direction }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// `onSelectFolder` fires whenever a folder is clicked so a parent can render
// that folder's medical history (e.g. <MedicalRecord folderId={selected._id} />).
// `selectedFolderId` is optional — pass it back in if the parent controls selection.
const MedicalFolder = ({
  onScanFolder,
  onSelectFolder,
  selectedFolderId: selectedFromParent,
}) => {
  const {
    folders,
    loading,
    getFolders,
    createFolder,
    updateFolder,
    deleteFolder,
  } = useMedical();
  const [isAdding, setIsAdding] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [internalSelectedId, setInternalSelectedId] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const menuRef = useRef(null);
  const scrollRef = useRef(null);

  const selectedFolderId =
    selectedFromParent !== undefined ? selectedFromParent : internalSelectedId;

  useEffect(() => {
    getFolders();
  }, [getFolders]);

  // Default to the first folder once folders load, so history shows immediately.
  useEffect(() => {
    if (!selectedFolderId && folders.length > 0) {
      const first = folders[0];
      setInternalSelectedId(first._id);
      if (onSelectFolder) onSelectFolder(first);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folders]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
        setEditingId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons, folders.length]);

  const scrollByAmount = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -180 : 180, behavior: "smooth" });
  };

  const handleSelect = (folder) => {
    setInternalSelectedId(folder._id);
    if (onSelectFolder) onSelectFolder(folder);
  };

  const handleCreate = async (disease) => {
    if (!disease) {
      setIsAdding(false);
      return;
    }
    try {
      const created = await createFolder(disease);
      setIsAdding(false);
      // Select the newly created folder so its (empty) history shows right away.
      if (created) handleSelect(created);
    } catch (err) {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFolder(id);
      if (selectedFolderId === id) {
        setInternalSelectedId(null);
      }
    } catch (err) {
    } finally {
      setOpenMenuId(null);
    }
  };

  const handleUpdate = async (id, disease) => {
    try {
      await updateFolder(id, disease);
    } catch (err) {
    } finally {
      setEditingId(null);
      setOpenMenuId(null);
    }
  };

  const handleScan = (folder) => {
    if (onScanFolder) onScanFolder(folder);
    setOpenMenuId(null);
  };

  return (
    <div className={styles.outer} ref={menuRef}>
      {canScrollLeft && (
        <button
          className={`${styles.scrollBtn} ${styles.scrollBtnLeft}`}
          onClick={() => scrollByAmount("left")}
          aria-label="Scroll left"
        >
          <ChevronArrow direction="left" />
        </button>
      )}

      <div className={styles.wrapper} ref={scrollRef}>
        {folders.map((folder) => {
          const isMenuOpen = openMenuId === folder._id;
          const isEditing = editingId === folder._id;
          const isSelected = selectedFolderId === folder._id;

          return (
            <div className={styles.chipContainer} key={folder._id}>
              <div
                className={`${styles.chip} ${isSelected ? styles.chipSelected : ""}`}
              >
                {isEditing ? (
                  <select
                    autoFocus
                    className={styles.editSelect}
                    defaultValue={folder.disease}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleUpdate(folder._id, e.target.value)}
                  >
                    {DISEASE_OPTIONS.map((disease) => (
                      <option key={disease} value={disease}>
                        {disease}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    <button
                      className={styles.chipLabel}
                      onClick={() => handleSelect(folder)}
                      aria-pressed={isSelected}
                    >
                      {folder.disease}
                    </button>
                    <button
                      className={`${styles.chipMenuToggle} ${isMenuOpen ? styles.chevronOpen : ""}`}
                      onClick={() =>
                        setOpenMenuId(isMenuOpen ? null : folder._id)
                      }
                      aria-label="Folder options"
                    >
                      <KebabIcon />
                    </button>
                  </>
                )}
              </div>

              {isMenuOpen && !isEditing && (
                <div className={styles.menu}>
                  <button
                    className={styles.menuItem}
                    onClick={() => handleScan(folder)}
                  >
                    <ScanIcon />
                    Scan Folder
                  </button>
                  <button
                    className={styles.menuItem}
                    onClick={() => setEditingId(folder._id)}
                  >
                    <UpdateIcon />
                    Update
                  </button>
                  <div className={styles.menuDivider} />
                  <button
                    className={`${styles.menuItem} ${styles.menuItemDanger}`}
                    onClick={() => handleDelete(folder._id)}
                  >
                    <DeleteIcon />
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {isAdding ? (
          <select
            autoFocus
            className={styles.addInput}
            defaultValue=""
            onChange={(e) => handleCreate(e.target.value)}
            onBlur={() => setIsAdding(false)}
          >
            <option value="" disabled>
              Select disease
            </option>
            {DISEASE_OPTIONS.map((disease) => (
              <option key={disease} value={disease}>
                {disease}
              </option>
            ))}
          </select>
        ) : (
          <button
            className={styles.addChip}
            onClick={() => setIsAdding(true)}
            disabled={loading}
          >
            <span>Add New Folder</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M5 1V9M1 5H9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      {canScrollRight && (
        <button
          className={`${styles.scrollBtn} ${styles.scrollBtnRight}`}
          onClick={() => scrollByAmount("right")}
          aria-label="Scroll right"
        >
          <ChevronArrow direction="right" />
        </button>
      )}
    </div>
  );
};

export default MedicalFolder;
