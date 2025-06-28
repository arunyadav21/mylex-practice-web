import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();
  const uid = auth.currentUser?.uid;

  // ✅ If user already registered, redirect to /home
  useEffect(() => {
    const checkUserExists = async () => {
      if (!uid) return navigate('/');

      const userRef = doc(db, 'persons', uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        navigate('/home');
      }
    };

    checkUserExists();
  }, [navigate, uid]);

  const handleRegister = async () => {
    if (!name || !email || !location) {
      alert('Please fill all fields');
      return;
    }

    try {
      await setDoc(doc(db, 'persons', uid), {
        fullName: name,
        email: email,
        location: location,
        phoneNumber: auth.currentUser.phoneNumber,
      });

      navigate('/home');
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user info');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2 mb-4"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          className="w-full border rounded-lg px-3 py-2 mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2 mb-4"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          Register & Continue
        </button>
      </div>
    </div>
  );
};

export default Register;
