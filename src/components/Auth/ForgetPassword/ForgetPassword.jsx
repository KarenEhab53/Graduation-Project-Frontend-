import { useState } from "react";
import {
  requestOtp,
  verifyOtp as verifyOtpRequest,
  resetPassword,
} from "../../../services/authService";
import EmailStep from "../Email Step/EmailStep";
import OtpStep, { OTP_LENGTH } from "../OTP/OtpStep";
import ResetPasswordStep from "../Reset Password/ResetPasswordStep";
import SuccessStep from "../Success Step/SuccessStep";

const STEPS = {
  EMAIL: "email",
  OTP: "otp",
  RESET: "reset",
  SUCCESS: "success",
};

export default function ForgetPassword({ onDone }) {
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------- الخطوة 1: إرسال الإيميل وطلب OTP ----------
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      await requestOtp(email.trim());
      setOtpDigits(Array(OTP_LENGTH).fill("")); // امسح أي أرقام قديمة عشان محدش يبعت كود قديم بالغلط
      setStep(STEPS.OTP);
    } catch (err) {
      setError(
        err.response?.data?.msg || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------- الخطوة 2: التأكد من الـ OTP ----------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    const otp = otpDigits.join("");
    if (otp.length !== OTP_LENGTH) {
      setError(`Please enter the ${OTP_LENGTH}-digit code.`);
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtpRequest(email.trim(), otp);
      setResetToken(res.data.resetToken);
      setStep(STEPS.RESET);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- الخطوة 3: تغيير الباسورد ----------
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(resetToken, password, confirmPassword);
      setStep(STEPS.SUCCESS);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not reset password. Try the process again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {step === STEPS.EMAIL && (
        <EmailStep
          email={email}
          setEmail={setEmail}
          error={error}
          loading={loading}
          onSubmit={handleSendOtp}
        />
      )}

      {step === STEPS.OTP && (
        <OtpStep
          otpDigits={otpDigits}
          setOtpDigits={setOtpDigits}
          error={error}
          loading={loading}
          onSubmit={handleVerifyOtp}
          onResend={handleSendOtp}
        />
      )}

      {step === STEPS.RESET && (
        <ResetPasswordStep
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          error={error}
          loading={loading}
          onSubmit={handleResetPassword}
        />
      )}

      {step === STEPS.SUCCESS && <SuccessStep onDone={onDone} />}
    </div>
  );
}
