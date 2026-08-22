import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";
import { getAllUsers, deleteUser } from "../../../services/adminService";
import styles from "./Users.module.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchParams] = useSearchParams();

  const searchQuery = (searchParams.get("search") || "").trim().toLowerCase();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Couldn't load users",
        text: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      icon: "warning",
      title: `Delete ${name || "this user"}?`,
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#cb2027",
    });
    if (!result.isConfirmed) return;

    setDeletingId(id);
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      Swal.fire({
        icon: "success",
        title: "User deleted",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Couldn't delete user",
        text: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    return (
      u.name?.toLowerCase().includes(searchQuery) ||
      u.email?.toLowerCase().includes(searchQuery) ||
      u.location?.toLowerCase().includes(searchQuery)
    );
  });

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Users</h1>

      {loading ? (
        <div className={styles.state}>Loading users...</div>
      ) : users.length === 0 ? (
        <div className={styles.state}>No users found.</div>
      ) : filteredUsers.length === 0 ? (
        <div className={styles.state}>No users match your search.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Location</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, index) => (
                <tr key={u._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className={styles.userCell}>
                      <img
                        src={u.profileImage}
                        alt={u.name}
                        className={styles.avatar}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      {u.name}
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.location}</td>
                  <td>{u.phone}</td>
                  <td>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(u._id, u.name)}
                      disabled={deletingId === u._id}
                      title="Delete user"
                    >
                      <Trash2 size={18} strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
