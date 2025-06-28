import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const phone = localStorage.getItem('phone'); // '+91XXXXXXXXXX'

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/');
      return;
    }

    const fetchUser = async () => {
      try {
        const userRef = doc(db, 'persons', phone);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, phone]);

  const handleSignOut = async () => {
    const confirm = window.confirm('Are you sure you want to sign out?');
    if (!confirm) return;

    try {
      await auth.signOut();
      localStorage.clear();
      navigate('/');
    } catch (error) {
      alert('Sign out failed: ' + error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col items-center">
          {/* Profile Picture */}
          <div className="w-28 h-28 rounded-full border-4 border-blue-500 flex items-center justify-center text-gray-500 text-4xl bg-gray-200 mb-4">
            👤
          </div>

          {/* User Info */}
          <h2 className="text-xl font-bold mb-1">{userData?.name || 'No Name'}</h2>
          <p className="text-gray-600 mb-1">{userData?.email || 'No Email'}</p>
          <p className="text-gray-600 mb-4">{userData?.phone || phone}</p>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
