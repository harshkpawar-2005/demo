import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; // make sure this points to your firebase.js
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Login = () => {
  const [isRightPanelActive, setRightPanelActive] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleManualAuth = () => {
    navigate("/tourist/homepage");
  };

  // ✅ Firebase Google login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Firebase user:", user); // ✅ user added to Firebase
      navigate("/tourist/homepage");
    } catch (error) {
      console.error("Firebase Google login error:", error);
    }
  };

  const backgroundImage = 'https://wallup.net/wp-content/uploads/2016/01/107630-Yosemite_National_Park-nature-mountain-trees-mist.jpg';

  return (
    <div
      className="relative flex justify-center items-center flex-col min-h-screen w-screen"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      <div className={`
        bg-white/30 backdrop-blur-sm rounded-[10px] shadow-[0_14px_28px_rgba(0,0,0,0.25),_0_10px_10px_rgba(0,0,0,0.22)]
        relative overflow-hidden w-[768px] max-w-full min-h-[480px] z-10
        ${isRightPanelActive ? 'right-panel-active' : ''}
        transition-all duration-1200 ease-in-out ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      `}>

        {/* Sign Up Form */}
        <div className={`
          absolute top-0 h-full transition-all duration-600 ease-in-out
          left-0 w-1/2 z-10 flex items-center justify-center
          ${isRightPanelActive ? 'transform translate-x-full opacity-100 z-50 animate-show' : 'opacity-0 pointer-events-none'}
        `}>
          <form className="bg-transparent flex items-center justify-center flex-col p-0 h-full text-center px-[50px] w-full animate-fadeInUp">
            <h1 className="font-bold my-0 text-[24px] text-gray-900 animate-slideUp">Start Your Journey!</h1>

            {/* Google Button */}
            <div className="social-container my-[20px] flex justify-center animate-socialFade">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="border border-[#DDDDDD] rounded-full inline-flex justify-center items-center h-[40px] w-[40px] mx-[5px] bg-white text-gray-700 transition-transform duration-300 hover:scale-110"
              >
                G
              </button>
            </div>

            <span className="text-[12px] text-gray-700 animate-slideUp">or use your email to register</span>
            <input className="bg-white/90 border-none p-[12px_15px] my-[8px] w-full rounded text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white animate-slideUp delay-200" type="text" placeholder="Name" />
            <input className="bg-white/90 border-none p-[12px_15px] my-[8px] w-full rounded text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white animate-slideUp delay-300" type="email" placeholder="Email" />
            <input className="bg-white/90 border-none p-[12px_15px] my-[8px] w-full rounded text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white animate-slideUp delay-400" type="password" placeholder="Password" />
            <button className="rounded-[20px] border border-green-700 bg-green-700 text-white text-[12px] font-bold p-[12px_45px] tracking-[1px] uppercase transition-all duration-300 ease-in-out active:scale-95 focus:outline-none mt-4 hover:bg-green-800 hover:scale-105 animate-pulseEffect" onClick={handleManualAuth}>Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className={`
          absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 z-20 flex items-center justify-center
          ${isRightPanelActive ? 'transform translate-x-full opacity-0 pointer-events-none' : 'opacity-100'}
        `}>
          <form className="bg-transparent flex items-center justify-center flex-col p-0 h-full text-center px-[50px] w-full animate-fadeInUp">
            <h1 className="font-bold my-0 text-[24px] text-gray-900 animate-slideUp">Welcome Back!</h1>

            {/* Google Button */}
            <div className="social-container my-[20px] flex justify-center animate-socialFade">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="border border-[#DDDDDD] rounded-full inline-flex justify-center items-center h-[40px] w-[40px] mx-[5px] bg-white text-gray-700 transition-transform duration-300 hover:scale-110"
              >
                G
              </button>
            </div>

            <span className="text-[12px] text-gray-700 animate-slideUp">or use your account</span>
            <input className="bg-white/90 border-none p-[12px_15px] my-[8px] w-full rounded text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white animate-slideUp delay-200" type="email" placeholder="Email" />
            <input className="bg-white/90 border-none p-[12px_15px] my-[8px] w-full rounded text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white animate-slideUp delay-300" type="password" placeholder="Password" />
            <a href="#" className="text-blue-700 text-[14px] no-underline my-[15px] font-medium hover:underline animate-slideUp delay-400">Forgot your password?</a>
            <button className="rounded-[20px] border border-green-700 bg-green-700 text-white text-[12px] font-bold p-[12px_45px] tracking-[1px] uppercase transition-all duration-300 ease-in-out active:scale-95 focus:outline-none hover:bg-green-800 hover:scale-105 animate-pulseEffect" onClick={handleManualAuth}>Sign In</button>
          </form>
        </div>

        {/* Overlay panels */}
        <div className={`
          absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-600 ease-in-out z-50
          ${isRightPanelActive ? 'transform -translate-x-full' : ''}
        `}>
          <div className={`
            bg-gradient-to-r from-green-700/50 to-green-900/50 bg-no-repeat bg-cover bg-left
            relative -left-full h-full w-[200%] transform text-white
            ${isRightPanelActive ? 'translate-x-1/2' : ''}
          `}>
            <div className={`
              overlay-panel absolute flex items-center justify-center flex-col p-[0_40px] text-center top-0 h-full w-1/2 transition-all duration-600 ease-in-out
              transform translate-x-0
              ${isRightPanelActive ? 'transform -translate-x-full' : ''}
            `}>
              <h1 className="font-bold my-0 text-[24px]">Adventure Awaits!</h1>
              <p className="text-[14px] font-light leading-[20px] tracking-[0.5px] my-[20px]">Login and plan your journey with us.</p>
              <button
                className="bg-transparent border border-white text-white rounded-[20px] font-bold p-[12px_45px] tracking-[1px] uppercase transition-transform duration-80ms ease-in active:scale-95 focus:outline-none hover:bg-white hover:text-green-700 animate-pulseEffect"
                onClick={(e) => { e.preventDefault(); setRightPanelActive(false); }}
              >
                Sign In
              </button>
            </div>

            <div className={`
              overlay-panel absolute flex items-center justify-center flex-col p-[0_40px] text-center top-0 h-full w-1/2 transition-all duration-600 ease-in-out
              right-0
              ${isRightPanelActive ? 'transform translate-x-0' : ''}
            `}>
              <h1 className="font-bold my-0 text-[24px]">Hello, Friend!</h1>
              <p className="text-[14px] font-light leading-[20px] tracking-[0.5px] my-[20px]">Join our community and embark on a new adventure!</p>
              <button
                className="bg-transparent border border-white text-white rounded-[20px] font-bold p-[12px_45px] tracking-[1px] uppercase transition-transform duration-80ms ease-in active:scale-95 focus:outline-none hover:bg-white hover:text-green-700 animate-pulseEffect"
                onClick={(e) => { e.preventDefault(); setRightPanelActive(true); }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
