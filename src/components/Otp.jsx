import React, { useState,  } from "react";
import { getAuth, PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const verifyOtp = async () => {
    setError("");
    setLoading(true);

    const auth = getAuth();
    const verificationId = JSON.parse(localStorage.getItem("verificationId"));

    if (!otp || !verificationId) {
      setLoading(false);
      return setError("Missing OTP or verification.");
    }

    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const result = await signInWithCredential(auth, credential);

      // Check if user exists in Firestore
      const phone = result.user.phoneNumber;
      const ref = doc(db, "users", phone);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        // ✅ Existing user → go to home
        navigate("/home");
      } else {
        // ❌ New user → go to register
        navigate("/register");
      }

    } catch (err) {
      console.error(err);
      setError("Invalid OTP.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 400, margin: "auto" }}>
      <h2>Enter OTP</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Verifying... Please wait</p>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ display: "block", marginBottom: "10px", width: "100%" }}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      {/* Required container for reCAPTCHA (if reused here) */}
      <div id="recaptcha-container" />
    </div>
  );
};

export default Otp;
