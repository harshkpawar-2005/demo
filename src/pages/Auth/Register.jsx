import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const { userType } = useParams();

  const handleRegister = (e) => {
    e.preventDefault();
    if (userType === "tourist") {
      navigate("/tourist/homepage");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white px-6">
      <h2 className="text-3xl font-bold mb-4">Create an Account</h2>
      <p className="mb-6 text-gray-300 text-center">Register to explore Jharkhand Tourism</p>

      <form className="w-full max-w-md flex flex-col gap-4" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          className="px-4 py-3 rounded-lg text-black focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="px-4 py-3 rounded-lg text-black focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-3 rounded-lg text-black focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg hover:opacity-90 transition shadow-lg"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
