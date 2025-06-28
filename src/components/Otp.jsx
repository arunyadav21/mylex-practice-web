import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithCredential, PhoneAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Otp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus to next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const storedResult = JSON.parse(localStorage.getItem('confirmationResult'));
      if (!storedResult) {
        throw new Error('Session expired. Please try again.');
      }

      const credential = PhoneAuthProvider.credential(
        storedResult.verificationId,
        otpCode
      );
      const result = await signInWithCredential(auth, credential);
      const phone = result.user.phoneNumber;

      // ✅ Check Firestore for existing user
      const userDocRef = doc(db, 'users', phone);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        // user exists, redirect to home
        navigate('/home'); 
      } else {
        //  New user redirect to registration
        navigate('/register'); 
      }

    } catch (error) {
      console.error(error);
      setError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-400 to-indigo-500 py-8 px-6 text-center">
          <div className="bg-blue-200 p-3 rounded-full size-16 mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 mx-auto" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9H9.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 9H15.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 5H8C7.44772 5 7 5.44772 7 6V8.5C7 9.05228 7.44772 9.5 8 9.5H16C16.5523 9.5 17 9.05228 17 8.5V6C17 5.44772 16.5523 5 16 5Z" fill="white"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">OTP Verification</h1>
          <p className="text-blue-100 mt-2">Enter the 6-digit code sent to your mobile</p>
        </div>

        {/* OTP Input */}
        <div className="p-8">
          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
            Enter Verification Code
          </label>

          <div className="flex justify-center space-x-3 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="tel"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !digit && index > 0) {
                    document.getElementById(`otp-${index - 1}`).focus();
                  }
                }}
                className="w-12 h-12 text-2xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-sm text-red-600 mb-4">{error}</p>
          )}

          <button
            onClick={handleVerifyOtp}
            disabled={isLoading || otp.join('').length !== 6}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
              isLoading
                ? 'bg-blue-400'
                : otp.join('').length !== 6
                ? 'bg-gray-400'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              'Verify & Continue'
            )}
          </button>

          <div className="mt-6 text-center text-sm text-gray-600">
            Didn't receive code?{' '}
            <button
              className="text-blue-600 font-medium hover:underline"
              onClick={() => alert('Resend OTP functionality would go here')}
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
