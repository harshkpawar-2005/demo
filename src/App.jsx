import React from "react";
import { Routes, Route, Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import Home from "./pages/Home.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Homepage from "./pages/Auth/Tourist/Homepage.jsx";
import Chatbot from "./pages/Auth/Tourist/Chatbot.jsx";
import Maps, { ArVrPage } from "./pages/Auth/Tourist/Maps.jsx";
import EventCalendar from "./pages/Auth/Tourist/EventCalendar.jsx";
import Sentimentfeedback from "./pages/Auth/Tourist/Sentimentfeedback.jsx";
import NewUser from "./pages/Guides/NewUser.jsx";


const App = () => {
  const location = useLocation();

  const hideHeader = location.pathname === "/tourist/homepage";

  return (
    <div className="min-h-screen flex flex-col text-black">
      

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/:userType" element={<LoginPage />} />
          <Route path="/auth/:userType/register" element={<RegisterPage />} />
          <Route path="/guides/newuser" element={<NewUser />} />
          <Route path="/tourist/homepage" element={<Homepage />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/maps/ar-vr-preview/:placeName" element={<ArVrPage />} />
          <Route path="/eventcalendar" element={<EventCalendar />} />
          <Route path="/feedback" element={<Sentimentfeedback />} />
        </Routes>
      </main>
    </div>
  );
};

const LoginPage = () => {
  const { userType } = useParams();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/tourist/homepage");
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <Login onSubmit={handleLogin} />
      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Back
      </button>
    </div>
  );
};

const RegisterPage = () => {
  const { userType } = useParams();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/tourist/homepage");
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <Register onSubmit={handleRegister} />
      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Back
      </button>
    </div>
  );
};

export default App;