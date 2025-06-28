import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) {
      navigate('/');
      return;
    }

    const fetchUser = async () => {
      try {
        const docRef = doc(db, 'persons', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, uid]);

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      try {
        await auth.signOut();
        localStorage.clear();
        navigate('/');
      } catch (error) {
        alert('Sign out failed: ' + error.message);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6">
        <div className="flex flex-col items-center">
          {/* Profile Picture */}
          <div className="w-28 h-28 rounded-full border-4 border-blue-500 flex items-center justify-center bg-gray-200 text-gray-500 text-4xl mb-4">
            👤
          </div>

          {/* Name */}
          <h2 className="text-xl font-bold mb-1">
            {userData?.fullName || 'No Name'}
          </h2>

          {/* Email */}
          <p className="text-gray-600 mb-1">
            {userData?.email || auth.currentUser?.email || 'No Email'}
          </p>

          {/* Phone Number */}
          <div className="flex items-center text-gray-700">
            <span className="mr-2">📞</span>
            <span>{userData?.phoneNumber || auth.currentUser?.phoneNumber || 'No Phone'}</span>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
