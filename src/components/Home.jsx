import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import {
  collection,
  getDocs,
  onSnapshot,
  doc,
} from 'firebase/firestore';

const Home = () => {
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) {
      navigate('/');
      return;
    }

    // 🔁 Realtime listener for user profile
    const unsubscribe = onSnapshot(doc(db, 'persons', uid), (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    });

    // 📦 Load all products
    const loadProducts = async () => {
      const snapshot = await getDocs(collection(db, 'Products'));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(list);
    };

    // 🏷️ Load categories
    const loadCategories = async () => {
      const snapshot = await getDocs(collection(db, 'Products'));
      const uniqueCategories = new Set();

      snapshot.forEach((doc) => {
        const category = doc.data().category;
        if (category) uniqueCategories.add(category);
      });

      setCategories(['All', ...Array.from(uniqueCategories)]);
    };

    loadProducts();
    loadCategories();

    return () => unsubscribe();
  }, [uid, navigate]);

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleProductClick = (product) => {
    localStorage.setItem('selectedItem', JSON.stringify(product));
    navigate(`/item/${product.id}`);
  };

  const goToProfile = () => navigate('/profile');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔝 Top Bar */}
      <div className="flex items-center justify-between px-4 py-4 shadow-sm bg-white">
        <h1 className="text-xl font-bold text-purple-700">MyLex App</h1>
        <button
  onClick={goToProfile}
  className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-lg font-semibold"
>
 {userData?.fullName?.trim()?.charAt(0)?.toUpperCase() || 'A'}

</button>


      </div>

      {/* 🏷️ Category Filter */}
      <div className="flex space-x-2 overflow-x-auto px-4 py-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1 rounded-full border text-sm font-medium whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-purple-100 text-purple-700 border-purple-400'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🛍️ Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 col-span-full">
            No products in {selectedCategory} category.
          </p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => handleProductClick(product)}
            >
              {/* 📷 Image */}
              <div className="h-40 bg-gray-100 rounded-t-xl overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center h-full text-gray-400 text-2xl">
                    🛍️
                  </div>
                )}
              </div>

              {/* 📦 Content */}
              <div className="p-4">
                {/* Category */}
                <div className="text-xs font-semibold text-purple-600 bg-purple-50 inline-block px-2 py-1 rounded mb-1">
                  {product.category || 'Uncategorized'}
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold truncate">{product.title}</h2>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>

                {/* Price & Availability */}
                <div className="flex justify-between items-center mt-2">
                  <span className="text-purple-700 font-bold">₹{product.price}</span>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      product.isAvailable
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
