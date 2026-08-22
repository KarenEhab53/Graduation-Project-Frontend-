import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";
import {
  getAllDoctors,
  approveDoctor,
  revokeDoctor,
  deleteUser,
} from "../../../services/adminService";
import DoctorDocumentsModal from "./DoctorDocumentsModal";
import styles from "./Doctors.module.css";

const getIsApproved = (doc) => doc.doctorInfo?.status === "approved";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [searchParams] = useSearchParams();

  const searchQuery = (searchParams.get("search") || "").trim().toLowerCase();

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await getAllDoctors();
      setDoctors(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Couldn't load doctors",
        text: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleApprove = async (id) => {
    setActioningId(id);
    try {
      await approveDoctor(id);
      await fetchDoctors();
      Swal.fire({
        icon: "success",
        title: "Doctor approved",
        timer: 1000,
        showConfirmButton: false,
      });
      setSelectedId(null);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Couldn't approve doctor",
        text: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setActioningId(null);
    }
  };

  const handleRevoke = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Revoke this doctor?",
      text: "They will lose access until approved again.",
      showCancelButton: true,
      confirmButtonText: "Revoke",
      confirmButtonColor: "#cb2027",
    });
    if (!result.isConfirmed) return;

    setActioningId(id);
    try {
      await revokeDoctor(id);
      await fetchDoctors();
      Swal.fire({
        icon: "success",
        title: "Doctor revoked",
        timer: 1000,
        showConfirmButton: false,
      });
      setSelectedId(null);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Couldn't revoke doctor",
        text: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setActioningId(null);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      icon: "warning",
      title: `Delete ${name || "this doctor"}?`,
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#cb2027",
    });
    if (!result.isConfirmed) return;

    setActioningId(id);
    try {
      await deleteUser(id);
      await fetchDoctors();
      Swal.fire({
        icon: "success",
        title: "Doctor deleted",
        timer: 1000,
        showConfirmButton: false,
      });
      setSelectedId(null);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Couldn't delete doctor",
        text: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setActioningId(null);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    if (!searchQuery) return true;
    return (
      doc.name?.toLowerCase().includes(searchQuery) ||
      doc.email?.toLowerCase().includes(searchQuery) ||
      doc.location?.toLowerCase().includes(searchQuery)
    );
  });

  const selectedDoctor = doctors.find((d) => d._id === selectedId) || null;

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Doctors</h1>

      {loading ? (
        <div className={styles.state}>Loading doctors...</div>
      ) : doctors.length === 0 ? (
        <div className={styles.state}>No doctors found.</div>
      ) : filteredDoctors.length === 0 ? (
        <div className={styles.state}>No doctors match your search.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Doctor</th>
                <th>Email</th>
                <th>Location</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doc, index) => {
                const isApproved = getIsApproved(doc);
                return (
                  <tr key={doc._id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className={styles.doctorCell}>
                        <img
                          src={doc.profileImage}
                          alt={doc.name}
                          className={styles.avatar}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        {doc.name}
                      </div>
                    </td>
                    <td>{doc.email}</td>
                    <td>{doc.location}</td>
                    <td>{doc.phone}</td>
                    <td>
                      <span
                        className={
                          isApproved
                            ? styles.badgeApproved
                            : styles.badgePending
                        }
                      >
                        {isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className={styles.actions}>
                      <button
                        className={styles.viewBtn}
                        onClick={() => setSelectedId(doc._id)}
                      >
                        View
                      </button>
                      {isApproved ? (
                        <button
                          className={styles.revokeBtn}
                          onClick={() => handleRevoke(doc._id)}
                          disabled={actioningId === doc._id}
                        >
                          {actioningId === doc._id ? "..." : "Revoke"}
                        </button>
                      ) : (
                        <button
                          className={styles.approveBtn}
                          onClick={() => handleApprove(doc._id)}
                          disabled={actioningId === doc._id}
                        >
                          {actioningId === doc._id ? "..." : "Approve"}
                        </button>
                      )}
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(doc._id, doc.name)}
                        disabled={actioningId === doc._id}
                        title="Delete doctor"
                      >
                        <Trash2 size={16} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedDoctor && (
        <DoctorDocumentsModal
          doctor={selectedDoctor}
          isApproved={getIsApproved(selectedDoctor)}
          actioning={actioningId === selectedDoctor._id}
          onApprove={handleApprove}
          onRevoke={handleRevoke}
          onDelete={handleDelete}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
};

export default Doctors;
