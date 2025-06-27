import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ItemDetail = () => {
  // const { id } = useParams(); // item id (optional if needed)
  useParams(); // Call useParams in case you need to keep the hook for future use
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedItem = localStorage.getItem('selectedItem');
    if (storedItem) {
      setItem(JSON.parse(storedItem));
    } else {
      alert("No item found");
      navigate('/home');
    }
  }, [navigate]);

  if (!item) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
        <p className="text-lg text-gray-700 mb-2">Price: ₹{item.price}</p>
        <p className="text-gray-600 mb-4">{item.description}</p>
        <button
          onClick={() => navigate('/home')}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
};

export default ItemDetail;
