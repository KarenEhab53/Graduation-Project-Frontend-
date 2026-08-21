import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DocSidebar from "../../components/layouts/DocSidebar/DocSidebar";
import api from "../../api/api";
import styles from "./DoctorProfile.module.css";

const emptyEducation = { degree: "", university: "", year: "" };
const emptyCertification = { name: "", issuer: "", year: "" };

const emptyForm = {
  specialty: "",
  bio: "",
  experienceYears: "",
  subSpecialty: [],
  conditionsTreated: [],
  education: [],
  certifications: [],
};

const DoctorProfile = () => {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const [subSpecialtyInput, setSubSpecialtyInput] = useState("");
  const [conditionInput, setConditionInput] = useState("");

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const getDoctorProfile = async () => {
      try {
        setLoading(true);
        setError("");

        // Don't let a 404 throw — "no profile yet" is a valid state, not an error
        const response = await api.get(`/get-doctor-data/${id}`, {
          validateStatus: (status) => status < 500,
        });

        if (cancelled) return;

        if (response.status === 404) {
          setDoctor(null);
          setIsEditing(true); // no profile yet, go straight to create mode
        } else if (response.status >= 200 && response.status < 300) {
          const data = response.data?.data || null;
          setDoctor(data);

          if (data) {
            setForm({
              specialty: data.specialty || "",
              bio: data.bio || "",
              experienceYears: data.experienceYears ?? "",
              subSpecialty: data.subSpecialty || [],
              conditionsTreated: data.conditionsTreated || [],
              education: data.education?.length ? data.education : [],
              certifications: data.certifications?.length
                ? data.certifications
                : [],
            });
          } else {
            setIsEditing(true);
          }
        } else {
          setError(response.data?.message || "Failed to load doctor profile");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Failed to load doctor profile",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    getDoctorProfile();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const addTag = (field, value, setValue) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setForm((prev) => ({ ...prev, [field]: [...prev[field], trimmed] }));
    setValue("");
  };

  const removeTag = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const addItem = (field, emptyItem) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], { ...emptyItem }],
    }));
  };

  const updateItem = (field, index, key, value) => {
    setForm((prev) => {
      const updated = [...prev[field]];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, [field]: updated };
    });
  };

  const removeItem = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!form.specialty.trim()) return "Specialty is required";
    if (
      form.experienceYears !== "" &&
      (isNaN(Number(form.experienceYears)) || Number(form.experienceYears) < 0)
    ) {
      return "Experience must be a valid non-negative number";
    }
    return "";
  };

  const handleCancelEdit = () => {
    if (doctor) {
      setForm({
        specialty: doctor.specialty || "",
        bio: doctor.bio || "",
        experienceYears: doctor.experienceYears ?? "",
        subSpecialty: doctor.subSpecialty || [],
        conditionsTreated: doctor.conditionsTreated || [],
        education: doctor.education?.length ? doctor.education : [],
        certifications: doctor.certifications?.length
          ? doctor.certifications
          : [],
      });
      setIsEditing(false);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        experienceYears:
          form.experienceYears === "" ? null : Number(form.experienceYears),
      };

      const response = await api.post("/update-doctor-profile", payload);

      const updated = response.data?.data;
      setDoctor((prev) => ({ ...(prev || {}), ...(updated || payload) }));
      setSuccess(
        response.data?.message ||
          (doctor
            ? "Profile updated successfully"
            : "Profile created successfully"),
      );
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save doctor profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.status}>Loading profile...</div>;
  }

  if (error && !isEditing) {
    return <div className={styles.status}>{error}</div>;
  }

  // --- EDIT / CREATE MODE ---
  if (isEditing) {
    return (
      <form className={styles.DoctorProfileForm} onSubmit={handleSubmit}>
        <h1 className={styles.name}>
          {doctor ? "Update" : "Create"} Doctor Profile
        </h1>

        {error && <div className={styles.status}>{error}</div>}

        <section className={styles.section}>
          <label>
            Specialty <span className={styles.required}>*</span>
            <input
              type="text"
              value={form.specialty}
              onChange={handleChange("specialty")}
              placeholder="e.g. Cardiology"
            />
          </label>

          <label>
            Bio
            <textarea
              value={form.bio}
              onChange={handleChange("bio")}
              rows={4}
              placeholder="Short professional bio"
            />
          </label>

          <label>
            Experience (years)
            <input
              type="number"
              min="0"
              value={form.experienceYears}
              onChange={handleChange("experienceYears")}
            />
          </label>
        </section>

        <section className={styles.section}>
          <h2>Specializations</h2>
          <div className={styles.tags}>
            {form.subSpecialty.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag("subSpecialty", index)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className={styles.tagInputRow}>
            <input
              type="text"
              value={subSpecialtyInput}
              onChange={(e) => setSubSpecialtyInput(e.target.value)}
              placeholder="Add a specialization"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(
                    "subSpecialty",
                    subSpecialtyInput,
                    setSubSpecialtyInput,
                  );
                }
              }}
            />
            <button
              type="button"
              onClick={() =>
                addTag("subSpecialty", subSpecialtyInput, setSubSpecialtyInput)
              }
            >
              Add
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Issues</h2>
          <div className={styles.tags}>
            {form.conditionsTreated.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag("conditionsTreated", index)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className={styles.tagInputRow}>
            <input
              type="text"
              value={conditionInput}
              onChange={(e) => setConditionInput(e.target.value)}
              placeholder="Add a condition"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(
                    "conditionsTreated",
                    conditionInput,
                    setConditionInput,
                  );
                }
              }}
            />
            <button
              type="button"
              onClick={() =>
                addTag("conditionsTreated", conditionInput, setConditionInput)
              }
            >
              Add
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Qualification</h2>
          {form.education.map((edu, index) => (
            <div key={index} className={styles.itemRow}>
              <input
                type="text"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) =>
                  updateItem("education", index, "degree", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="University"
                value={edu.university}
                onChange={(e) =>
                  updateItem("education", index, "university", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Year"
                value={edu.year}
                onChange={(e) =>
                  updateItem("education", index, "year", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => removeItem("education", index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem("education", emptyEducation)}
          >
            + Add Education
          </button>
        </section>

        <section className={styles.section}>
          <h2>Certifications</h2>
          {form.certifications.map((cert, index) => (
            <div key={index} className={styles.itemRow}>
              <input
                type="text"
                placeholder="Name"
                value={cert.name}
                onChange={(e) =>
                  updateItem("certifications", index, "name", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Issuer"
                value={cert.issuer}
                onChange={(e) =>
                  updateItem("certifications", index, "issuer", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Year"
                value={cert.year}
                onChange={(e) =>
                  updateItem("certifications", index, "year", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => removeItem("certifications", index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem("certifications", emptyCertification)}
          >
            + Add Certification
          </button>
        </section>

        <div className={styles.formActions}>
          <button type="submit" disabled={saving} className={styles.submitBtn}>
            {saving
              ? "Saving..."
              : doctor
                ? "Update Profile"
                : "Create Profile"}
          </button>

          {doctor && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    );
  }

  // --- VIEW MODE ---
  if (!doctor) {
    return <div className={styles.status}>Doctor not found</div>;
  }

  return (
    <div className={styles.DoctorProfile}>
      <DocSidebar doctor={doctor} />

      <div className={styles.details}>
        {success && <div className={styles.statusSuccess}>{success}</div>}

        <div className={styles.detailsHeader}>
          <h1 className={styles.name}>Dr. {doctor.userId?.name}</h1>
          <button
            type="button"
            className={styles.editBtn}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>

        <p className={styles.specialty}>{doctor.specialty}</p>

        {doctor.userId?.location && (
          <p className={styles.location}>📍 {doctor.userId.location}</p>
        )}

        {doctor.bio && <p className={styles.bio}>{doctor.bio}</p>}

        {doctor.subSpecialty?.length > 0 && (
          <section className={styles.section}>
            <h2>Specializations</h2>

            <div className={styles.tags}>
              {doctor.subSpecialty.map((specialty, index) => (
                <span key={index} className={styles.tag}>
                  {specialty}
                </span>
              ))}
            </div>
          </section>
        )}

        {doctor.conditionsTreated?.length > 0 && (
          <section className={styles.section}>
            <h2>Issues</h2>

            <div className={styles.tags}>
              {doctor.conditionsTreated.map((condition, index) => (
                <span key={index} className={styles.tag}>
                  {condition}
                </span>
              ))}
            </div>
          </section>
        )}

        {doctor.education?.length > 0 && (
          <section className={styles.section}>
            <h2>Qualification</h2>

            {doctor.education.map((education, index) => (
              <p key={index}>
                <strong>{education.degree}</strong> — {education.university} (
                {education.year})
              </p>
            ))}
          </section>
        )}

        {doctor.experienceYears != null && (
          <section className={styles.section}>
            <h2>Experience</h2>

            <p>{doctor.experienceYears} years</p>
          </section>
        )}

        {doctor.certifications?.length > 0 && (
          <section className={styles.section}>
            <h2>Certifications</h2>

            {doctor.certifications.map((certification, index) => (
              <p key={index}>
                <strong>{certification.name}</strong> — {certification.issuer} (
                {certification.year})
              </p>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;
