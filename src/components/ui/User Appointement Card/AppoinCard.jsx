import React from "react";
import styles from "./AppoinCard.module.css";

const STATIC_APPOINTMENTS = [
  {
    _id: "1",
    status: "Cancelled",
    date: "Tuesdays 12/4/2025",
    time: "2 PM",
    price: 200,
    doctorId: {
      name: "Dr. Sara Ahmed",
      specialization: "Gynaecologist",
      imageProfile: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  },
  {
    _id: "2",
    status: "Cancelled",
    date: "Tuesdays 12/4/2025",
    time: "2 PM",
    price: 200,
    doctorId: {
      name: "Dr. Sara Ahmed",
      specialization: "Gynaecologist",
      imageProfile: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  },
  {
    _id: "3",
    status: "Coming",
    date: "Wednesday 18/6/2025",
    time: "10 AM",
    price: 350,
    doctorId: {
      name: "Dr. Mohamed Ali",
      specialization: "Cardiologist",
      imageProfile: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  },
  {
    _id: "4",
    status: "Completed",
    date: "Monday 2/6/2025",
    time: "3 PM",
    price: 150,
    doctorId: {
      name: "Dr. Nadia Hassan",
      specialization: "Dermatologist",
      imageProfile: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  },
  {
    _id: "5",
    status: "Pending",
    date: "Friday 25/7/2025",
    time: "11 AM",
    price: null,
    doctorId: {
      name: "Dr. Khaled Youssef",
      specialization: "Neurologist",
      imageProfile: "https://randomuser.me/api/portraits/men/75.jpg",
    },
  },
];

const STATUS_CONFIG = {
  coming: {
    className: "apptCardComingStatus",
    badgeClass: "badgeComing",
    label: "Coming",
  },
  completed: {
    className: "apptCardCompletedStatus",
    badgeClass: "badgeCompleted",
    label: "Completed",
  },
  cancelled: {
    className: "apptCardCancelledStatus",
    badgeClass: "badgeCancelled",
    label: "Cancelled",
  },
  pending: {
    className: "apptCardPendingStatus",
    badgeClass: "badgePending",
    label: "Pending",
  },
};

const getConfig = (status) =>
  STATUS_CONFIG[status?.toLowerCase()] || {
    className: "",
    badgeClass: "",
    label: status,
  };

const handleStatusClick = (id, status) => {
  alert(`Appointment #${id} — current status: ${status}`);
};

const AppoinCard = ({ filter = "All" }) => {
  const filtered =
    filter === "All"
      ? STATIC_APPOINTMENTS
      : STATIC_APPOINTMENTS.filter(
          (a) => a.status?.toLowerCase() === filter.toLowerCase(),
        );

  if (filtered.length === 0) {
    return (
      <p className={styles.noAppointments}>
        No appointments found for "{filter}".
      </p>
    );
  }

  return (
    <>
      {filtered.map((appointment) => {
        const config = getConfig(appointment.status);
        const spec = Array.isArray(appointment.doctorId?.specialization)
          ? appointment.doctorId.specialization.join(", ")
          : appointment.doctorId?.specialization || "Specialist";

        return (
          <div
            className={`${styles.apptCard} ${styles[config.className] || ""}`}
            key={appointment._id}
          >
            {/* Top row: photo + info + badge */}
            <div className={styles.apptTop}>
              <img
                src={appointment.doctorId?.imageProfile}
                alt={appointment.doctorId?.name}
                className={styles.doctorAvatar}
              />
              <div className={styles.doctorInfo}>
                <h2>{appointment.doctorId?.name || "Unknown Doctor"}</h2>
                <p className={styles.specialization}>{spec}</p>
              </div>
              <span
                className={`${styles.statusBadge} ${styles[config.badgeClass] || ""}`}
                onClick={() =>
                  handleStatusClick(appointment._id, appointment.status)
                }
              >
                {config.label}
              </span>
            </div>

            {/* Divider */}
            <hr className={styles.apptDivider} />

            {/* Bottom row: date/time and price */}
            <div className={styles.apptBottom}>
              <p className={styles.apptDatetime}>
                {appointment.date} - {appointment.time}
              </p>
              <p className={styles.apptPrice}>
                {appointment.price ? `${appointment.price} $` : "No fees"}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default AppoinCard;
