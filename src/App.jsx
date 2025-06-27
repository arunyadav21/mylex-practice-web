
import React from "react";
import { Routes, Route } from 'react-router-dom';
import Login from "./components/Login";
import Otp from "./components/Otp";
import Register from "./components/Register";
import Home from "./components/Home";
import ItemDetail from "./components/ItemDetail";
import Profile from "./components/Profile";
function App() {
  return (
        <div style={{ padding: '2rem' }}>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/register" element={<Register />} />
        <Route path="home" element={<Home />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </div>
  );
}

export default App;
