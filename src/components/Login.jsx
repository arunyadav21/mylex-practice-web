import React, { useState } from 'react';
import { auth } from '../firebase'; 
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

    
     setIsLoading(true);
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
    <div className="min-h-screen bg-gradient-to-br from-white-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-6 px-8 text-center">
          <div className="bg-blue-100 p-3 rounded-full size-16 mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Phone Verification</h2>
          <p className="text-blue-100 mt-1">Enter your mobile number to receive OTP</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <div className="mb-6">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
                +91
              </span>
              <input
                type="tel"
                id="phone"
                inputMode="numeric"
                maxLength="10"
                className="block w-full p-3 text-sm text-gray-900 bg-gray-50 rounded-r-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>

          <div id="recaptcha-container"></div>
        
        <button
          onClick={handleSendOtp}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending OTP...
            </div>
          ) : (
            'Send OTP'
          )}
        </button>

          <div className="mt-6 text-center text-sm text-gray-500">
            By continuing, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;