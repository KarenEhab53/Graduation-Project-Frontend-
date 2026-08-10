import  { useContext, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import styles from "./NID.module.css";
import { NIDContext } from "../../../context/NIDContext";

const NID = () => {
  const { addNID, getMyNID, updateNID, deleteNID, loading, error } =
    useContext(NIDContext);

  const [isEdit, setIsEdit] = useState(false);

  const [existingImageUrl, setExistingImageUrl] = useState(null);

  const [formData, setFormData] = useState({
    emergencyNumber: "",
    bloodType: "",
    address: "",
    note: "",
    profileImage: null,
  });

  useEffect(() => {
    const fetchMyNID = async () => {
      try {
        const response = await getMyNID();

        const nid = response.data;

        if (nid) {
          setFormData({
            emergencyNumber: nid.emergencyNumber || "",
            bloodType: nid.bloodType || "",
            address: nid.address || "",
            note: nid.note || "",
            profileImage: null,
          });

          setExistingImageUrl(nid.profileImage || null);

          setIsEdit(true);
        }
      } catch {
        setIsEdit(false);
        setExistingImageUrl(null);
      }
    };

    fetchMyNID();
  }, [ getMyNID]);

  const previewUrl = useMemo(() => {
    if (!formData.profileImage) {
      return null;
    }

    return URL.createObjectURL(formData.profileImage);
  }, [formData.profileImage]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files && files.length ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.emergencyNumber) {
      return Swal.fire({
        icon: "warning",
        title: "Emergency number required",
      });
    }

    try {
      const data = new FormData();

      data.append("emergencyNumber", formData.emergencyNumber);

      data.append("bloodType", formData.bloodType);

      data.append("address", formData.address);

      data.append("note", formData.note);

      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

      let response;

      if (isEdit) {
        response = await updateNID(data);

        Swal.fire({
          icon: "success",
          title: "Updated successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        response = await addNID(data);

        Swal.fire({
          icon: "success",
          title: "Added successfully",
          timer: 2000,
          showConfirmButton: false,
        });

        setIsEdit(true);
      }

      console.log(response);

      if (response?.data?.profileImage) {
        setExistingImageUrl(response.data.profileImage);
      }

      setFormData((prev) => ({
        ...prev,
        profileImage: null,
      }));

      const fileInput = document.getElementById("profileImage");

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err?.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete NID?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteNID();

      Swal.fire({
        icon: "success",
        title: "Deleted successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      setFormData({
        emergencyNumber: "",
        bloodType: "",
        address: "",
        note: "",
        profileImage: null,
      });

      setExistingImageUrl(null);
      setIsEdit(false);

      const fileInput = document.getElementById("profileImage");

      if (fileInput) {
        fileInput.value = "";
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Delete failed",
      });
    }
  };

  const imageSrc = previewUrl || existingImageUrl;

  return (
    <div className={styles.nid}>
      <h1>ID Search</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input}>
          <label>Emergency Number</label>

          <input
            type="text"
            name="emergencyNumber"
            value={formData.emergencyNumber}
            onChange={handleChange}
            placeholder="Enter emergency number"
          />
        </div>

        <div className={styles.input}>
          <label>Blood Type</label>

          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className={styles.input}>
          <label>Address</label>

          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className={styles.input}>
          <label>Medical Notes</label>

          <textarea
            rows="4"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Enter medical notes"
          />
        </div>

        <div className={styles.input}>
          <label>Emergency Photo</label>

          <label htmlFor="profileImage" className={styles.uploadBox}>
            {imageSrc ? (
              <>
                <img src={imageSrc} alt="Preview" className={styles.preview} />

                <span className={styles.changePhoto}>Change Photo</span>
              </>
            ) : (
              <>
                <h4>Upload Photo</h4>

                <p>Click here to upload</p>
              </>
            )}
          </label>

          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            className={styles.hiddenInput}
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update NID" : "Add NID"}
        </button>

        {isEdit && (
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={handleDelete}
          >
            Delete NID
          </button>
        )}
      </form>
    </div>
  );
};

export default NID;
