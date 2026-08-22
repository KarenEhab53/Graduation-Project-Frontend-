import { useRef } from "react";
import styles from "./OtpStep.module.css";

export const OTP_LENGTH = 5; // الباك إند بيعمل Math.floor(10000 + Math.random() * 90000) => 5 أرقام

export default function OtpStep({
  otpDigits,
  setOtpDigits,
  error,
  loading,
  onSubmit,
  onResend,
}) {
  const otpRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // أرقام بس
    const next = [...otpDigits];
    next[index] = value.slice(-1);
    setOtpDigits(next);

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtpDigits(next);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  return (
    <form className={styles.wrap} onSubmit={onSubmit}>
      <h2 className={styles.title}>Enter Your Code</h2>
      <p className={styles.sub}>Check Your Email</p>

      <div className={styles.otpRow} onPaste={handlePaste}>
        {otpDigits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (otpRefs.current[i] = el)}
            className={styles.otpBox}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
          />
        ))}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button
        type="button"
        className={styles.resend}
        onClick={onResend}
        disabled={loading}
      >
        Resend code
      </button>

      <button className={styles.btn} type="submit" disabled={loading}>
        {loading ? "Verifying..." : "Verify"}
      </button>
    </form>
  );
}
