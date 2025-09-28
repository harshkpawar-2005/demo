import React, { useState, useRef } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom"; // Import Link for routing
import bgImage from "./img1.jpeg";

const Homepage = () => {
  const [activeVideo, setActiveVideo] = useState(null); // "waterfall" | "hill" | null
  const circleRef = useRef(null);

  const handleMouseMove = (e) => {
    gsap.to(circleRef.current, {
      x: e.clientX - 150, // center the circle (300px diameter / 2)
      y: e.clientY - 150,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleMouseEnter = (video) => {
    setActiveVideo(video);
    gsap.to(circleRef.current, { scale: 1, duration: 0.3, ease: "power3.out" });
  };

  const handleMouseLeave = () => {
    setActiveVideo(null);
    gsap.to(circleRef.current, { scale: 0, duration: 0.3, ease: "power3.in" });
  };

  return (
    <div
      className="min-h-screen flex flex-col relative bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
      onMouseMove={handleMouseMove}
    >
      {/* Menu Icon with hover full-screen dropdown */}
      <div className="absolute top-4 right-4 z-50 group">
        <button className="text-3xl focus:outline-none">☰</button>

        {/* Full-screen Dropdown */}
        <div className="fixed inset-0 bg-white opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-300 flex flex-col items-center justify-center gap-6 text-3xl z-40">
          {[
            "Home",
            "Explore",
            "Insights",
            "Itinerary",
            "Event Calendar",
            "Chatbot",
            "Live Tracking",
            "Maps",
            "Vlog Generation",
            "Feedback",
            "Track Guide",
          ].map((item, index) =>
            item === "Chatbot" ? (
              <Link
                key={index}
                to="/chatbot"
                className="hover:text-green-700 transition-colors"
              >
                {item}
              </Link>
            ) : item === "Feedback" ? (
              <Link
                key={index}
                to="/feedback"
                className="hover:text-green-700 transition-colors"
              >
                {item}
              </Link>
            ) : item === "Event Calendar" ? (
              <Link
                key={index}
                to="/eventcalendar"
                className="hover:text-green-700 transition-colors"
              >
                {item}
              </Link>
            ) : item === "Maps" ? (
              <Link
                key={index}
                to="/maps"
                className="hover:text-green-700 transition-colors"
              >
                {item}
              </Link>
            ) : (
              <a
                key={index}
                href="#"
                className="hover:text-green-700 transition-colors"
              >
                {item}
              </a>
            )
          )}
        </div>
      </div>

      {/* Floating circle with video */}
      <div
        ref={circleRef}
        className="fixed top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none overflow-hidden z-40 scale-0"
        style={{ background: "black" }}
      >
        {activeVideo === "waterfall" && (
          <video
            src="/assets/video1.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {activeVideo === "hill" && (
          <video
            src="/assets/video2.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1 text-center transform -translate-y-20 mt-32">
        <div
          className="cursor-pointer"
          onMouseEnter={() => handleMouseEnter("waterfall")}
          onMouseLeave={handleMouseLeave}
        >
          <h1
            className="text-[12vw] text-black uppercase leading-tight drop-shadow-lg"
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            Jharkhand Tourism
          </h1>
        </div>
        <div
          className="cursor-pointer"
          onMouseEnter={() => handleMouseEnter("hill")}
          onMouseLeave={handleMouseLeave}
        >
          <p className="text-5xl mt-6 max-w-3xl text-white drop-shadow">
            The Heart of India's Tribes, Treasures and Timeless Beauty.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
