import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithCredential, PhoneAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Otp = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleVerifyOtp = async () => {
    const storedResult = JSON.parse(localStorage.getItem('confirmationResult'));
    const phone = localStorage.getItem('phone');

    if (!storedResult || !otp) {
      alert('OTP missing');
      return;
    }

    try {
      const credential = PhoneAuthProvider.credential(storedResult.verificationId, otp);
      await signInWithCredential(auth, credential);

      // Check if user data exists in Firestore
      const userDocRef = doc(db, 'users', phone);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        // Existing user ➝ go to home
        navigate('/home');
      } else {
        // New user ➝ go to register
        navigate('/register');
      }

    } catch (error) {
      console.error(error);
      alert('Invalid OTP');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>
        <input
          type="text"
          maxLength="6"
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button
          onClick={handleVerifyOtp}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default Otp;
