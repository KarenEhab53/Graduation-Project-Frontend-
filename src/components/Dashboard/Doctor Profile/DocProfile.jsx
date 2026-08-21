import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../../api/api";
import styles from "./DocProfile.module.css";
import { PiPlus } from "react-icons/pi";
import { MdCancel } from "react-icons/md";

// Fields that come back as plain string arrays
const STRING_ARRAY_FIELDS = [
  "subSpecialty",
  "clinicLocation",
  "conditionsTreated",
];

const emptyEducation = { degree: "", university: "", year: "" };
const emptyCertification = { name: "", issuer: "", year: "" };

const emptyForm = {
  specialty: "",
  subSpecialty: [],
  bio: "",
  experienceYears: "",
  clinicLocation: [],
  consultationFee: "",
  conditionsTreated: [],
  education: [],
  certifications: [],
};

// Shared SweetAlert theming to match the teal accent used across the form
const swalTheme = {
  confirmButtonColor: "#3abfc4",
  cancelButtonColor: "#c94b4b",
};

export default function DoctorProfile({ doctorUserId }) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const request = doctorUserId
      ? api.get(`/get-doctor-data/${doctorUserId}`)
      : api.get("/my-doctor-profile");

    request
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data || {};
        setForm({
          specialty: data.specialty || "",
          subSpecialty: data.subSpecialty || [],
          bio: data.bio || "",
          experienceYears: data.experienceYears ?? "",
          clinicLocation: data.clinicLocation || [],
          consultationFee: data.consultationFee ?? "",
          conditionsTreated: data.conditionsTreated || [],
          education: data.education || [],
          certifications: data.certifications || [],
        });
      })
      .catch((err) => {
        if (!cancelled) {
          Swal.fire({
            icon: "error",
            title: "Couldn't load profile",
            text:
              err.response?.data?.message ||
              "Something went wrong while loading your profile.",
            ...swalTheme,
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [doctorUserId]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const bumpNumber = (key, delta, min = 0) => {
    setForm((prev) => {
      const current = Number(prev[key]) || 0;
      const next = Math.max(min, current + delta);
      return { ...prev, [key]: next };
    });
  };

  // ---- string array helpers (subSpecialty, clinicLocation, conditionsTreated) ----
  const updateArrayItem = (key, index, value) => {
    setForm((prev) => {
      const arr = [...prev[key]];
      arr[index] = value;
      return { ...prev, [key]: arr };
    });
  };

  const addArrayItem = (key) => {
    setForm((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
  };

  const removeArrayItem = (key, index) => {
    setForm((prev) => {
      const arr = prev[key].filter((_, i) => i !== index);
      return { ...prev, [key]: arr };
    });
  };

  const updateNestedItem = (key, index, field, value) => {
    setForm((prev) => {
      const arr = prev[key].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      );
      return { ...prev, [key]: arr };
    });
  };

  const addNestedItem = (key, template) => {
    setForm((prev) => ({ ...prev, [key]: [...prev[key], { ...template }] }));
  };

  const removeNestedItem = (key, index) => {
    setForm((prev) => {
      const arr = prev[key].filter((_, i) => i !== index);
      return { ...prev, [key]: arr };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      subSpecialty: form.subSpecialty.filter((v) => v.trim() !== ""),
      clinicLocation: form.clinicLocation.filter((v) => v.trim() !== ""),
      conditionsTreated: form.conditionsTreated.filter((v) => v.trim() !== ""),
      experienceYears:
        form.experienceYears === "" ? undefined : Number(form.experienceYears),
      consultationFee:
        form.consultationFee === "" ? undefined : Number(form.consultationFee),
      education: form.education.map((ed) => ({
        ...ed,
        year: ed.year === "" ? undefined : Number(ed.year),
      })),
      certifications: form.certifications.map((c) => ({
        ...c,
        year: c.year === "" ? undefined : Number(c.year),
      })),
    };

    try {
      await api.put("/update-doctor-profile", payload);
      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Your profile has been updated successfully.",
        timer: 2000,
        showConfirmButton: false,
        ...swalTheme,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text:
          err.response?.data?.message ||
          "Something went wrong while saving your profile.",
        ...swalTheme,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.DocProfile}>Loading profile…</div>;
  }

  return (
    <form className={styles.DocProfile} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Doctor Profile</h2>

      <div className={styles.field}>
        <label className={styles.label}>Specialty</label>
        <input
          type="text"
          value={form.specialty}
          onChange={(e) => setField("specialty", e.target.value)}
        />
      </div>

      <StringArrayField
        label="Sub-specialty"
        items={form.subSpecialty}
        onChange={(i, v) => updateArrayItem("subSpecialty", i, v)}
        onAdd={() => addArrayItem("subSpecialty")}
        onRemove={(i) => removeArrayItem("subSpecialty", i)}
      />

      <div className={styles.field}>
        <label className={styles.label}>Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => setField("bio", e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Experience</label>
        <div className={styles.spinRow}>
          <div className={styles.spinWrap}>
            <input
              type="number"
              className={styles.short}
              value={form.experienceYears}
              onChange={(e) => setField("experienceYears", e.target.value)}
            />
            <div className={styles.spinners}>
              <button
                type="button"
                onClick={() => bumpNumber("experienceYears", 1, 1)}
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => bumpNumber("experienceYears", -1, 1)}
              >
                ▼
              </button>
            </div>
          </div>
          <span className={styles.unit}>years</span>
        </div>
      </div>

      <StringArrayField
        label="Clinic location"
        items={form.clinicLocation}
        onChange={(i, v) => updateArrayItem("clinicLocation", i, v)}
        onAdd={() => addArrayItem("clinicLocation")}
        onRemove={(i) => removeArrayItem("clinicLocation", i)}
      />

      <div className={styles.field}>
        <label className={styles.label}>Consultation fee</label>
        <div className={styles.spinRow}>
          <div className={styles.spinWrap}>
            <input
              type="number"
              className={styles.short}
              value={form.consultationFee}
              onChange={(e) => setField("consultationFee", e.target.value)}
            />
            <div className={styles.spinners}>
              <button
                type="button"
                onClick={() => bumpNumber("consultationFee", 25, 0)}
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => bumpNumber("consultationFee", -25, 0)}
              >
                ▼
              </button>
            </div>
          </div>
          <span className={styles.unit}>EGP</span>
        </div>
      </div>

      <StringArrayField
        label="Conditions treated"
        items={form.conditionsTreated}
        onChange={(i, v) => updateArrayItem("conditionsTreated", i, v)}
        onAdd={() => addArrayItem("conditionsTreated")}
        onRemove={(i) => removeArrayItem("conditionsTreated", i)}
      />

      <div className={styles.field}>
        <label className={styles.label}>Education</label>
        {form.education.length === 0 && (
          <div className={styles.emptyRow}>No education entries yet</div>
        )}
        {form.education.map((ed, i) => (
          <div className={styles.nestedBlock} key={i}>
            <div className={styles.nestedRow}>
              <input
                type="text"
                placeholder="Degree"
                value={ed.degree || ""}
                onChange={(e) =>
                  updateNestedItem("education", i, "degree", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="University"
                value={ed.university || ""}
                onChange={(e) =>
                  updateNestedItem("education", i, "university", e.target.value)
                }
              />
            </div>
            <div className={styles.row}>
              <input
                type="number"
                className={styles.short}
                placeholder="Year"
                value={ed.year || ""}
                onChange={(e) =>
                  updateNestedItem("education", i, "year", e.target.value)
                }
              />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeNestedItem("education", i)}
              >
                <MdCancel/>
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => addNestedItem("education", emptyEducation)}
        >
          <PiPlus/>
        </button>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Certifications</label>
        {form.certifications.length === 0 && (
          <div className={styles.emptyRow}>No certifications yet</div>
        )}
        {form.certifications.map((c, i) => (
          <div className={styles.nestedBlock} key={i}>
            <div className={styles.nestedRow}>
              <input
                type="text"
                placeholder="Name"
                value={c.name || ""}
                onChange={(e) =>
                  updateNestedItem("certifications", i, "name", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Issuer"
                value={c.issuer || ""}
                onChange={(e) =>
                  updateNestedItem(
                    "certifications",
                    i,
                    "issuer",
                    e.target.value,
                  )
                }
              />
            </div>
            <div className={styles.row}>
              <input
                type="number"
                className={styles.short}
                placeholder="Year"
                value={c.year || ""}
                onChange={(e) =>
                  updateNestedItem("certifications", i, "year", e.target.value)
                }
              />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeNestedItem("certifications", i)}
              >
                <MdCancel/>
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => addNestedItem("certifications", emptyCertification)}
        >
          <PiPlus/>
        </button>
      </div>

      <div className={styles.footer}>
        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}

function StringArrayField({ label, items, onChange, onAdd, onRemove }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {items.length === 0 && (
        <div className={styles.emptyRow}>None added yet</div>
      )}
      {items.map((val, i) => (
        <div className={styles.row} key={i} style={{ marginBottom: 8 }}>
          <input
            type="text"
            value={val}
            onChange={(e) => onChange(i, e.target.value)}
          />
          <button
            type="button"
            className={styles.removeBtn}
            onClick={() => onRemove(i)}
          >
            <MdCancel/>
          </button>
        </div>
      ))}
      <button type="button" className={styles.addBtn} onClick={onAdd}>
        <PiPlus/>
      </button>
    </div>
  );
}