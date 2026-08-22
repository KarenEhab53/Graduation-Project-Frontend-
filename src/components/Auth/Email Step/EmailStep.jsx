import styles from "./EmailStep.module.css";

export default function EmailStep({
  email,
  setEmail,
  error,
  loading,
  onSubmit,
}) {
  return (
    <form className={styles.wrap} onSubmit={onSubmit}>
      <h2 className={styles.title}>Change Password</h2>

      <input
        type="email"
        aria-label="Email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
      />

      {error && <div className={styles.error}>{error}</div>}

      <button className={styles.btn} type="submit" disabled={loading}>
        {loading ? "Sending..." : "Save"}
      </button>
    </form>
  );
}
