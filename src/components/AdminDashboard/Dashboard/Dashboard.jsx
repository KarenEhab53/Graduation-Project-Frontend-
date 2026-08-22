import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Stethoscope,
  Users as UsersIcon,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { getAllDoctors, getAllUsers } from "../../../services/adminService";
import styles from "./Dashboard.module.css";

const isJoinedThisWeek = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return date >= weekAgo && date <= now;
};

const getIsApproved = (doc) => doc.doctorInfo?.status === "approved";

const StatCard = ({
  icon,
  iconBg,
  count,
  label,
  highlight,
  highlightLabel,
}) => (
  <div className={styles.statCard}>
    <div className={styles.statIcon} style={{ background: iconBg }}>
      {icon}
    </div>
    <div className={styles.statCount}>{count}</div>
    <div className={styles.statLabel}>{label}</div>
    <div className={styles.statHighlight}>
      <span>{highlight}</span> {highlightLabel}
    </div>
  </div>
);

const Dashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [doctorsRes, usersRes] = await Promise.all([
        getAllDoctors(),
        getAllUsers(),
      ]);
      setDoctors(
        Array.isArray(doctorsRes.data.data) ? doctorsRes.data.data : [],
      );
      setUsers(Array.isArray(usersRes.data.data) ? usersRes.data.data : []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Couldn't load dashboard data",
        text: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalDoctors = doctors.length;
  const approvedDoctors = doctors.filter(getIsApproved).length;
  const pendingDoctors = totalDoctors - approvedDoctors;
  const doctorsJoinedThisWeek = doctors.filter((d) =>
    isJoinedThisWeek(d.createdAt),
  ).length;

  const totalUsers = users.length;
  const usersJoinedThisWeek = users.filter((u) =>
    isJoinedThisWeek(u.createdAt),
  ).length;

  const recentDoctors = [...doctors]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  if (loading) {
    return <div className={styles.state}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        <StatCard
          icon={<Stethoscope size={22} color="#2fa4a4" />}
          iconBg="#e6f6f6"
          count={totalDoctors}
          label="Doctors"
          highlight={doctorsJoinedThisWeek}
          highlightLabel="Doctors joined this week"
        />
        <StatCard
          icon={<UserCheck size={22} color="#1a9c5b" />}
          iconBg="#eafaf1"
          count={approvedDoctors}
          label="Approved Doctors"
          highlight={pendingDoctors}
          highlightLabel="Pending approval"
        />
        <StatCard
          icon={<UsersIcon size={22} color="#e07b1a" />}
          iconBg="#fff1e0"
          count={totalUsers}
          label="Users"
          highlight={usersJoinedThisWeek}
          highlightLabel="Users joined this week"
        />
        <StatCard
          icon={<UserPlus size={22} color="#cb2027" />}
          iconBg="#fdecec"
          count={doctorsJoinedThisWeek + usersJoinedThisWeek}
          label="New this week"
          highlight={totalDoctors + totalUsers}
          highlightLabel="Total accounts"
        />
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Recent Users</h2>
          </div>
          {recentUsers.length === 0 ? (
            <div className={styles.state}>No users found.</div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u, index) => (
                    <tr key={u._id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className={styles.userCell}>
                          <img
                            src={u.profileImage}
                            alt={u.name}
                            className={styles.avatar}
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                          />
                          {u.name}
                        </div>
                      </td>
                      <td>{u.location}</td>
                      <td>{u.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className={styles.sidePanel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Doctor List</h2>
          </div>
          {recentDoctors.length === 0 ? (
            <div className={styles.state}>No doctors found.</div>
          ) : (
            <div className={styles.doctorList}>
              {recentDoctors.map((doc) => (
                <div key={doc._id} className={styles.doctorRow}>
                  <img
                    src={doc.profileImage}
                    alt={doc.name}
                    className={styles.doctorAvatar}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div className={styles.doctorInfo}>
                    <div className={styles.doctorName}>{doc.name}</div>
                    <div className={styles.doctorMeta}>
                      {doc.location || "—"}
                    </div>
                  </div>
                  <span
                    className={
                      getIsApproved(doc)
                        ? styles.badgeApproved
                        : styles.badgePending
                    }
                  >
                    {getIsApproved(doc) ? "Approved" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
