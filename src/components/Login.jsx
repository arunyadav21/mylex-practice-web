import React, { useState } from 'react';
import { auth } from '../firebase'; 
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const setupCaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
            console.log('reCAPTCHA solved, ready to send OTP');
        },
        'expired-callback': () => {
          alert('reCAPTCHA expired. Please try again.');
        }
      });
    }
    return window.recaptchaVerifier;
  };

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      alert('Enter valid 10-digit phone number');
      return;
    }

    const formattedPhone = '+91' + phone;
    const appVerifier = setupCaptcha();

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      localStorage.setItem('confirmationResult', JSON.stringify({ verificationId: confirmationResult.verificationId }));
      localStorage.setItem('phone', formattedPhone);
      navigate('/otp');
    } catch (error) {
      console.error("OTP Error:", error);
      alert('Failed to send OTP: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
          type="text"
          maxLength="10"
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring"
          placeholder="Enter Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div id="recaptcha-container"></div>
        <button
          onClick={handleSendOtp}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
};

export default Login;