import styles from "./ResetPasswordStep.module.css";

export default function ResetPasswordStep({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  error,
  loading,
  onSubmit,
}) {
  return (
    <form className={styles.wrap} onSubmit={onSubmit}>
      <h2 className={styles.title}>Set New Password</h2>

      <input
        type="password"
        aria-label="New Password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
      />

      <input
        type="password"
        aria-label="Confirm Password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {error && <div className={styles.error}>{error}</div>}

      <button className={styles.btn} type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
