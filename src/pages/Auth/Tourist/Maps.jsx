import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Element, Link } from 'react-scroll';
import { useInView } from 'react-intersection-observer';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { useNavigate, useParams } from 'react-router-dom';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    :root {
      --primary-bg: #1C2522;
      --secondary-bg: #2A3431;
      --accent: #E5A00D;
      --accent-hover: #D4940C;
      --text-primary: #F0F2EF;
      --text-secondary: #9DA6A4;
      --border-color: rgba(157, 166, 164, 0.2);
      --card-bg: #2A3431;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background-color: var(--primary-bg);
      color: var(--text-primary);
      line-height: 1.6;
      overflow-x: hidden;
    }
    ::selection { background-color: var(--accent); color: var(--primary-bg); }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--primary-bg); }
    ::-webkit-scrollbar-thumb { background-color: var(--secondary-bg); border-radius: 10px; border: 2px solid var(--primary-bg); }
    .landing-page { height: 100vh; position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; overflow: hidden; }
    .background-video { position: absolute; top: 50%; left: 50%; width: 100%; height: 100%; object-fit: cover; transform: translate(-50%, -50%); z-index: -2; filter: brightness(0.6); }
    .overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(ellipse at center, rgba(28, 37, 34, 0.5) 0%, rgba(28, 37, 34, 0.9) 100%); z-index: -1; }
    .hero-content {
      text-align: center;
      z-index: 5;
      max-width: 850px;
      padding: 0 2rem;
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    }
    .hero-content.loaded { opacity: 1; transform: translateY(0); }
    .hero-title { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 800; margin-bottom: 1rem; background: linear-gradient(135deg, var(--accent), #FFD700); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-shadow: 0 4px 20px rgba(0,0,0,0.3); }
    .hero-subtitle { font-size: clamp(1rem, 2.5vw, 1.5rem); max-width: 700px; margin: 0 auto 2.5rem; color: var(--text-secondary); text-shadow: 1px 1px 2px rgba(0,0,0,0.7); }
    .explore-btn { background: var(--accent); color: var(--primary-bg); padding: 1rem 2.5rem; border: none; border-radius: 50px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(229, 160, 13, 0.25); text-decoration: none; display: inline-block; }
    .explore-btn:hover { transform: translateY(-5px); background: var(--accent-hover); box-shadow: 0 12px 30px rgba(229, 160, 13, 0.35); }
    .transition-section {
      padding: 6rem 2rem;
      background: linear-gradient(180deg, var(--primary-bg) 0%, #151C1A 100%);
      text-align: center;
    }
    .transition-content { max-width: 900px; margin: 0 auto; opacity: 0; transform: translateY(30px); transition: opacity 1s ease, transform 1s ease; }
    .transition-content.is-visible { opacity: 1; transform: translateY(0); }
    .transition-title { font-size: 2.5rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--text-primary); }
    .transition-text { font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 3rem; max-width: 700px; margin-left: auto; margin-right: auto; }
    .stats-container { display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; }
    .stat-item {
      background: var(--secondary-bg);
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      width: 220px;
      transition: transform 0.3s ease, border-color 0.3s ease;
    }
    .stat-item:hover {
      transform: translateY(-8px);
      border-color: var(--accent);
    }
    .stat-number { font-size: 2.5rem; font-weight: 700; color: var(--accent); }
    .stat-label { font-size: 1rem; color: var(--text-secondary); }
    .map-section { min-height: 100vh; position: relative; display: flex; flex-direction: column; background-color: #151C1A; }
    .app-container { flex-grow: 1; display: flex; position: relative; overflow: hidden; }
    .main-header { position: sticky; top: 0; height: 65px; width: 100%; z-index: 50; flex-shrink: 0; transition: background-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease; border-bottom: 1px solid transparent; }
    .main-header.scrolled { background-color: rgba(28, 37, 34, 0.8); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-bottom: 1px solid var(--border-color); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); }
    .header-content { height: 100%; padding: 0 1.5rem; display: flex; align-items: center; }
    .header-logo { font-size: 1.5rem; font-weight: bold; color: var(--accent); letter-spacing: -1px; }
    .header-nav { display: flex; gap: 2rem; margin-left: auto; }
    .header-nav a { color: var(--text-secondary); text-decoration: none; font-weight: 500; transition: color 0.3s; position: relative; }
    .header-nav a::after { content: ''; position: absolute; width: 0; height: 2px; bottom: -5px; left: 50%; background-color: var(--accent); transition: all 0.3s ease; }
    .header-nav a:hover { color: var(--text-primary); }
    .header-nav a:hover::after { width: 100%; left: 0; }
    .header-toggle-btn { background: none; border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 1rem; transition: background-color 0.2s ease; }
    .header-toggle-btn:hover { background-color: var(--secondary-bg); }
    .hamburger-icon { position: relative; width: 20px; height: 2px; background-color: var(--text-primary); transition: all 0.3s ease; }
    .hamburger-icon::before, .hamburger-icon::after { content: ''; position: absolute; left: 0; width: 20px; height: 2px; background-color: var(--text-primary); transition: all 0.3s ease; }
    .hamburger-icon::before { transform: translateY(-6px); }
    .hamburger-icon::after { transform: translateY(6px); }
    .landing-page-header { position: absolute; top: 0; left: 0; right: 0; z-index: 10; }
    .landing-page-header .main-header { background-color: transparent; border-bottom: none; }
    .sidebar { position: absolute; top: 0; left: 0; height: 100%; width: 340px; background: var(--primary-bg); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4); z-index: 30; transform: translateX(-100%); transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1); display: flex; flex-direction: column; }
    .sidebar.open { transform: translateX(0); }
    .category-tabs { display: grid; grid-template-columns: repeat(2, 1fr); border-bottom: 1px solid var(--border-color); }
    .category-tab { padding: 1rem 0.5rem; font-size: 0.9rem; font-weight: 600; background: 0 0; border: none; cursor: pointer; transition: all .2s ease; color: var(--text-secondary); border-bottom: 3px solid transparent; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
    .category-tab:hover { color: var(--text-primary); background-color: var(--secondary-bg); }
    .category-tab.active { color: var(--accent); border-bottom-color: var(--accent); background-color: var(--secondary-bg); }
    .category-tab svg { width: 18px; height: 18px; }
    .places-container { flex: 1; overflow-y: auto; padding: 1rem; }
    .places-title { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1rem; }
    .places-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .place-item { padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer; transition: all .25s ease; background-color: transparent; }
    .place-item:hover { background-color: var(--secondary-bg); border-color: rgba(229, 160, 13, 0.5); transform: translateX(5px); }
    .place-item.selected { border-color: var(--accent); background-color: rgba(229, 160, 13, 0.1); box-shadow: 0 4px 15px rgba(0,0,0,.2); }
    .place-content { display: flex; align-items: center; gap: 1rem; }
    .place-icon { width: 2.5rem; height: 2.5rem; flex-shrink: 0; }
    .place-details { flex: 1; min-width: 0; }
    .place-name { font-weight: 600; color: var(--text-primary); }
    .place-description { font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .sidebar-footer { padding: 1rem; border-top: 1px solid var(--border-color); background-color: var(--primary-bg); }
    .sidebar-footer-text { font-size: 0.8rem; color: var(--text-secondary); text-align: center; }
    .main-content { flex: 1; position: relative; width: 100%; }
    .map-container { position: relative; width: 100%; height: 100%; }
    .current-location-btn {
      position: absolute; top: 85px; right: 1.5rem; z-index: 15; background-color: var(--accent); color: var(--primary-bg); width: 48px; height: 48px; border-radius: 50%; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2); border: 2px solid var(--primary-bg); cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; }
    .current-location-btn:hover { background-color: var(--accent-hover); transform: scale(1.05); }
    .current-location-btn:disabled { background-color: var(--secondary-bg); cursor: not-allowed; }
    .current-location-btn svg { width: 1.5rem; height: 1.5rem; }
    .location-spinner { width: 24px; height: 24px; border: 3px solid rgba(240, 242, 239, 0.3); border-top-color: var(--text-primary); border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .place-detail-overlay { position: fixed; inset: 0; background-color: rgba(28, 37, 34, 0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 35; }
    .place-detail-card { position: fixed; bottom: 2rem; right: 2rem; width: 380px; max-height: calc(100vh - 4rem); background: var(--card-bg); color: var(--text-primary); border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,.4); z-index: 40; overflow: hidden; transform: translateY(120%); animation: slideUp .4s cubic-bezier(.23,1,.32,1) forwards; border: 1px solid var(--border-color); display: flex; flex-direction: column; }
    @keyframes slideUp{to{transform:translateY(0)}}
    .place-detail-image { width: 100%; height: 200px; object-fit: cover; flex-shrink: 0; }
    .place-detail-content { padding: 1.5rem; overflow-y: auto; }
    .place-detail-name { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
    .place-detail-description { color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.6; }
    .place-detail-actions { display: flex; flex-direction: column; gap: 0.75rem; }
    .action-btn { flex: 1; padding: 0.75rem 1rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.9rem; }
    .place-detail-card .explore-btn { background-color: var(--accent); color: var(--primary-bg); box-shadow: none; }
    .place-detail-card .explore-btn:hover { background-color: var(--accent-hover); transform: none; box-shadow: none; }
    .instagram-btn { background: linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); color: #fff; }
    .instagram-btn:hover { opacity: .9; }
    .close-card-btn { position: absolute; top: 1rem; right: 1rem; background-color: rgba(0,0,0,.5); color: #fff; border: none; border-radius: 50%; width: 2.25rem; height: 2.25rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background-color .2s; }
    .close-card-btn:hover { background-color: rgba(0,0,0,.7); }
    .close-card-btn svg { width: 1rem; height: 1rem; }
    .ar-btn { background-color: #3B82F6; color: #fff; }
    .ar-btn:hover { background-color: #2563EB; }
    .action-btn-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
    .current-location-indicator { position: absolute; width: 20px; height: 20px; border-radius: 50%; background-color: #4285F4; border: 3px solid white; box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.5), 0 2px 5px rgba(0,0,0,0.2); transform: translate(-50%, -50%); z-index: 10; pointer-events: none; }
    .current-location-indicator::after { content: ''; position: absolute; top: 50%; left: 50%; width: 20px; height: 20px; border-radius: 50%; background-color: #4285F4; transform: translate(-50%, -50%); animation: pulse 2s infinite; opacity: 0.7; }
    @keyframes pulse { 0% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; } 100% { transform: translate(-50%, -50%) scale(4); opacity: 0; } }
    .map-cursor-tooltip {
      position: fixed;
      transform: translate(15px, 15px);
      background-color: rgba(28, 37, 34, 0.9);
      color: var(--text-primary);
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      z-index: 9999;
      pointer-events: none;
      white-space: nowrap;
      border: 1px solid var(--border-color);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .map-cursor-tooltip.visible {
      opacity: 1;
    }
  `}</style>
);

const createIcon = (svg) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
const touristIcon = createIcon(`<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#2980B9"/><path d="M20 9L10 25H30L20 9Z" fill="white"/><circle cx="20" cy="19" r="4" fill="white"/></svg>`);
const wildlifeIcon = createIcon(`<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#27AE60"/><path d="M26 14C27.1046 14 28 13.1046 28 12C28 10.8954 27.1046 10 26 10C24.8954 10 24 10.8954 24 12C24 13.1046 24.8954 14 26 14Z" fill="white"/><path d="M14 14C15.1046 14 16 13.1046 16 12C16 10.8954 15.1046 10 14 10C12.8954 10 12 10.8954 12 12C12 13.1046 12.8954 14 14 14Z" fill="white"/><path d="M11 20C11 20 14 24 20 24C26 24 29 20 29 20C29 20 25 28 20 28C15 28 11 20 11 20Z" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
const hiddenGemIcon = createIcon(`<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#8E44AD"/><path d="M20 8L25.6085 16.5L35 17.7639L27.5 24.8819L29.217 34L20 29.5L10.783 34L12.5 24.8819L5 17.7639L14.3915 16.5L20 8Z" fill="white"/></svg>`);
const culturalIcon = createIcon(`<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#D35400"/><path d="M10 32V16L20 8L30 16V32H22V22H18V32H10Z" fill="white"/></svg>`);
const places = { touristSpots: [ { id: 1, name: "Dassam Falls", description: "A scenic waterfall near Ranchi, perfect for nature lovers.", lat: 23.1896, lng: 85.5046, image: "/assets/images/dassam.jpg" }, { id: 2, name: "Netarhat", description: "Beautiful hill station with stunning sunsets and panoramic views.", lat: 23.4833, lng: 84.2667, image: "/assets/images/netarhat.jpg" }, { id: 3, name: "Hundru Falls", description: "One of the most spectacular waterfalls in Jharkhand.", lat: 23.4500, lng: 85.6500, image: "/assets/images/hundru.jpg" }, { id: 4, name: "Jonha Falls", description: "Also known as Gautamdhara, surrounded by lush green forests.", lat: 23.3417, lng: 85.6083, image: "/assets/images/jonha.jpg" } ], wildlife: [ { id: 5, name: "Betla National Park", description: "Famous tiger reserve with diverse wildlife including elephants.", lat: 23.8878, lng: 84.1901, image: "/assets/images/betla.jpg" }, { id: 6, name: "Palamau Tiger Reserve", description: "One of the first tiger reserves in India, home to Bengal tigers.", lat: 23.68889, lng: 84.24889, image: "/assets/images/palamau.jpg" }, { id: 7, name: "Dalma Wildlife Sanctuary", description: "Famous for its elephant population and located near Jamshedpur.", lat: 22.8567, lng: 86.1167, image: "/assets/images/dalma.jpg" } ], hiddenGems: [ { id: 8, name: "Hirni Falls", description: "Less crowded but breathtaking waterfall in dense forests.", lat: 22.8667, lng: 85.3333, image: "/assets/images/hirni.jpg" }, { id: 9, name: "Lodh Falls", description: "The highest waterfall in Jharkhand, cascading from 143 meters.", lat:23.4806, lng: 84.0194, image: "/assets/images/lodh.jpg" }, { id: 10, name: "Sita Falls", description: "A serene waterfall surrounded by mythological significance.", lat: 23.34196, lng: 85.6439, image: "/assets/images/sita.jpg" }, { id: 15, name: "Udhwa Bird Sanctuary", description: "A haven for migratory birds, located on the banks of the Ganges river.", lat: 24.9953, lng:87.8103, image: "/assets/images/udhwa.jpg" } ], culturalSites: [ { id: 11, name: "Jagannath Temple", description: "Historic temple in Ranchi with annual Rath Yatra.", lat:23.3169, lng:85.2817, image: "/assets/images/jagannath.jpg" }, { id: 12, name: "Sun Temple", description: "Ancient temple dedicated to the Sun God, with unique architecture.", lat: 23.285, lng: 85.352, image: "/assets/images/sun.jpg" }, { id: 13, name: "Pahari Mandir", description: "Sacred temple on a hilltop offering panoramic views of Ranchi.", lat: 23.3753, lng: 85.3110, image: "/assets/images/pahari.jpg" }, { id: 14, name: "Baidyanath Jyotirlinga (Deoghar)", description: "One of the twelve Jyotirlingas, a major pilgrimage site for Hindus.", lat:24.4828, lng:86.6952, image: "/assets/images/baidyanath.jpg" } ] };
places.touristSpots.forEach(p => p.icon = touristIcon); places.wildlife.forEach(p => p.icon = wildlifeIcon); places.hiddenGems.forEach(p => p.icon = hiddenGemIcon); places.culturalSites.forEach(p => p.icon = culturalIcon);

const Header = ({ onToggleSidebar, showToggleButton = true, showNavLinks = true, isScrolled }) => (
  <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
    <div className="header-content">
      {showToggleButton && (
        <button onClick={onToggleSidebar} className="header-toggle-btn" aria-label="Toggle Sidebar">
          <div className="hamburger-icon"></div>
        </button>
      )}
      <div className="header-logo">Jharkhand</div>
      {showNavLinks && (
        <nav className="header-nav">
          <a href="#">About</a> <a href="#">Culture</a> <a href="#">Travel Tips</a> <a href="#">Contact</a>
        </nav>
      )}
    </div>
  </header>
);

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => { const timer = setTimeout(() => setIsLoaded(true), 100); return () => clearTimeout(timer); }, []);
  return (
    <div className="landing-page">
      <video className="background-video" src="/assets/videos/map.mp4" autoPlay muted loop playsInline></video>
      <div className="overlay"></div>
      <div className="landing-page-header"><Header showToggleButton={false} showNavLinks={true} isScrolled={false} /></div>
      <div className={`hero-content ${isLoaded ? 'loaded' : ''}`}>
        <h1 className="hero-title">Discover the Soul of India</h1>
        <p className="hero-subtitle">Explore the hidden waterfalls, rich tribal culture, and breathtaking landscapes of Jharkhand.</p>
        <Link to="transitionSection" smooth={true} duration={300} offset={0} className="explore-btn">Start Exploring</Link>
      </div>
    </div>
  );
};

const TransitionSection = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
    return (
        <Element name="transitionSection">
            <section ref={ref} className="transition-section">
                <div className={`transition-content ${inView ? 'is-visible' : ''}`}>
                    <h2 className="transition-title">Why Jharkhand?</h2>
                    <p className="transition-text">Known as 'The Land of Forests', Jharkhand is a mosaic of vibrant cultures, ancient traditions, and untouched natural beauty waiting to be explored.</p>
                    <div className="stats-container">
                        <div className="stat-item"><div className="stat-number">32+</div><div className="stat-label">Tribal Groups</div></div>
                        <div className="stat-item"><div className="stat-number">10+</div><div className="stat-label">Majestic Waterfalls</div></div>
                        <div className="stat-item"><div className="stat-number">29%</div><div className="stat-label">Forest Cover</div></div>
                    </div>
                </div>
            </section>
        </Element>
    );
};

const Sidebar = ({ isOpen, onPlaceSelect, selectedPlace, activeCategory, setActiveCategory }) => {
    const icons = {
        touristSpots: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
        wildlife: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
        hiddenGems: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4 4-4-4 5.293-5.293a1 1 0 011.414 0L11 12m0 0l2.293-2.293a1 1 0 011.414 0L18 14m-4 4l4-4" /></svg>,
        culturalSites: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    };

    const categories = {
        touristSpots: 'Tourist Spots', wildlife: 'Wildlife', hiddenGems: 'Hidden Gems', culturalSites: 'Cultural Sites'
    };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="category-tabs">
        {Object.entries(categories).map(([key, name]) => (
          <button key={key} onClick={() => setActiveCategory(key)} className={`category-tab ${activeCategory === key ? 'active' : ''}`}>
             {icons[key]} {name}
          </button>
        ))}
      </div>
      <div className="places-container">
        <div>
          <h3 className="places-title">{categories[activeCategory]}</h3>
          <div className="places-list">
            {places[activeCategory].map((place) => (
              <div key={place.id} onClick={() => onPlaceSelect(place)} className={`place-item ${selectedPlace?.id === place.id ? 'selected' : ''}`}>
                <div className="place-content">
                  <img src={place.icon} alt={place.name} className="place-icon" />
                  <div className="place-details">
                    <h4 className="place-name">{place.name}</h4> <p className="place-description">{place.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="sidebar-footer"><p className="sidebar-footer-text">Click on any place to view it on the map.</p></div>
    </div>
  );
};

const PlaceDetailCard = ({ place, onClose }) => {
  const navigate = useNavigate();

  const handleNavigateToGoogleMaps = () => { if (place?.lat && place.lng) window.open(`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`, '_blank'); };
  const handleViewInstagram = () => { const placeName = place.name.replace(/\s+/g, '').toLowerCase(); window.open(`https://www.instagram.com/explore/tags/${placeName}/`, '_blank'); };
  
  const handleArVrPreview = () => {
    const urlFriendlyName = place.name.replace(/\s+/g, '-').toLowerCase();
    navigate(`/maps/ar-vr-preview/${urlFriendlyName}`);
  };

  return (
    <>
      <div className="place-detail-overlay" onClick={onClose} />
      <div className="place-detail-card">
        <button className="close-card-btn" onClick={onClose}><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
        <img src={place.image} alt={place.name} className="place-detail-image" />
        <div className="place-detail-content">
          <h3 className="place-detail-name">{place.name}</h3> <p className="place-detail-description">{place.description}</p>
          <div className="place-detail-actions">
            <button className="action-btn ar-btn" onClick={handleArVrPreview}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M21.5,4H2.5C1.67,4,1,4.67,1,5.5v13C1,19.33,1.67,20,2.5,20h19c0.83,0,1.5-0.67,1.5-1.5v-13C23,4.67,22.33,4,21.5,4z M21,18H3V6h18V18z M8.5,15l3-4l2,2.5l3-3.5L19,15H8.5z"/></svg> 
              AR/VR Preview
            </button>
            <div className="action-btn-group">
              <button className="action-btn explore-btn" onClick={handleNavigateToGoogleMaps}><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> Directions</button>
              <button className="action-btn instagram-btn" onClick={handleViewInstagram}><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.355 2.175 8.745 2.163 12 2.163m0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" /></svg> See More</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const UserLocationMarker = ({ map, position }) => {
  const overlayRef = useRef(null);
  useEffect(() => {
    class CustomOverlay extends window.google.maps.OverlayView {
      constructor(pos) { super(); this.position = pos; this.div = document.createElement('div'); this.div.className = 'current-location-indicator'; }
      onAdd() { this.getPanes()?.floatPane.appendChild(this.div); }
      onRemove() { if (this.div.parentElement) this.div.parentElement.removeChild(this.div); }
      draw() { const projection = this.getProjection(); const point = projection?.fromLatLngToDivPixel(new window.google.maps.LatLng(this.position)); if (point) { this.div.style.left = `${point.x}px`; this.div.style.top = `${point.y}px`; } }
    }
    if (map && !overlayRef.current) { overlayRef.current = new CustomOverlay(position); overlayRef.current.setMap(map); }
    return () => { if (overlayRef.current) { overlayRef.current.setMap(null); overlayRef.current = null; } };
  }, [map, position]);
  return null;
};
const MapComponent = ({ mapRef, center, zoom, selectedPlace, onPlaceSelect, activeCategory, currentLocation }) => {
  const ref = useRef(null);
  const markersRef = useRef([]);
  const onMapLoad = useCallback((loadedMap) => { mapRef.current = loadedMap; }, [mapRef]);
  
  useEffect(() => {
    if (ref.current && !mapRef.current) {
      const newMap = new window.google.maps.Map(ref.current, { center, zoom, styles: [ { "elementType": "geometry", "stylers": [ { "color": "#1d2c4d" } ] }, { "elementType": "labels.text.fill", "stylers": [ { "color": "#8ec3b9" } ] }, { "elementType": "labels.text.stroke", "stylers": [ { "color": "#1a3646" } ] }, { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [ { "color": "#4b6878" } ] }, { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [ { "color": "#64779e" } ] }, { "featureType": "administrative.province", "elementType": "geometry.stroke", "stylers": [ { "color": "#4b6878" } ] }, { "featureType": "landscape.man_made", "elementType": "geometry.stroke", "stylers": [ { "color": "#334e87" } ] }, { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [ { "color": "#023e58" } ] }, { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#283d6a" } ] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [ { "color": "#6f9ba5" } ] }, { "featureType": "poi", "elementType": "labels.text.stroke", "stylers": [ { "color": "#1d2c4d" } ] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [ { "color": "#023e58" } ] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [ { "color": "#3C7680" } ] }, { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#304a7d" } ] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [ { "color": "#98a5be" } ] }, { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [ { "color": "#1d2c4d" } ] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "color": "#2c6675" } ] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "color": "#255763" } ] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [ { "color": "#b0d5ce" } ] }, { "featureType": "road.highway", "elementType": "labels.text.stroke", "stylers": [ { "color": "#023e58" } ] }, { "featureType": "transit", "elementType": "labels.text.fill", "stylers": [ { "color": "#98a5be" } ] }, { "featureType": "transit", "elementType": "labels.text.stroke", "stylers": [ { "color": "#1d2c4d" } ] }, { "featureType": "transit.line", "elementType": "geometry.fill", "stylers": [ { "color": "#283d6a" } ] }, { "featureType": "transit.station", "elementType": "geometry", "stylers": [ { "color": "#3a4762" } ] }, { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#0e1626" } ] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [ { "color": "#4e6d70" } ] } ], disableDefaultUI: true, zoomControl: true, });
      onMapLoad(newMap);
    }
  }, [ref, mapRef, center, zoom, onMapLoad]);
  
  useEffect(() => {
    if (mapRef.current) {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      const newMarkers = (places[activeCategory] || []).map(place => {
        const marker = new window.google.maps.Marker({ position: { lat: place.lat, lng: place.lng }, map: mapRef.current, title: place.name, icon: { url: place.icon, scaledSize: new window.google.maps.Size(40, 40), anchor: new window.google.maps.Point(20, 40) } });
        marker.addListener('click', () => onPlaceSelect(place));
        return marker;
      });
      
      markersRef.current = newMarkers;
    }
  }, [mapRef, onPlaceSelect, activeCategory]);
  
  useEffect(() => {
    if (mapRef.current && selectedPlace) { mapRef.current.panTo({ lat: selectedPlace.lat, lng: selectedPlace.lng }); mapRef.current.setZoom(14); }
  }, [mapRef, selectedPlace]);

  return (
    <>
      <div ref={ref} className="map-container" />
      {currentLocation && <UserLocationMarker map={mapRef.current} position={currentLocation} />}
    </>
  );
};
const CurrentLocationButton = ({ onLocationClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const getCurrentLocation = () => {
    setIsLoading(true); if (!navigator.geolocation) { alert('Geolocation is not supported by your browser.'); setIsLoading(false); return; }
    navigator.geolocation.getCurrentPosition( (position) => { onLocationClick({ lat: position.coords.latitude, lng: position.coords.longitude }); setIsLoading(false); }, (error) => { console.error('Error getting location:', error); alert('Unable to get your current location.'); setIsLoading(false); } );
  };
  return (
    <button onClick={getCurrentLocation} className="current-location-btn" title="Get Current Location" disabled={isLoading}>
      {isLoading ? <div className="location-spinner"></div> : <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2c-5.523 0-10 4.477-10 10s10 18 10 18 10-12.477 10-18-4.477-10-10-10zm0 12a2 2 0 110-4 2 2 0 010 4z" /></svg>}
    </button>
  );
};
const renderMapStatus = (status) => { if (status === Status.LOADING) return <div>Loading Map...</div>; if (status === Status.FAILURE) return <div>Failed to load Google Maps.</div>; return null; };
const MapWrapper = ({ mapRef, selectedPlace, onPlaceSelect, onLocationClick, activeCategory, currentLocation }) => {
  const center = { lat: 23.3431, lng: 85.3096 }; const zoom = 9;
  const apiKey = "AIzaSyCbZtCnYUFr7hc2kUloM63VarG6AbQDRsE";
  return (
    <div className="map-container">
      <Wrapper apiKey={apiKey} render={renderMapStatus}>
        <MapComponent mapRef={mapRef} center={center} zoom={zoom} selectedPlace={selectedPlace} onPlaceSelect={onPlaceSelect} activeCategory={activeCategory} currentLocation={currentLocation} />
      </Wrapper>
      <CurrentLocationButton onLocationClick={onLocationClick} />
    </div>
  );
};

export const ArVrPage = () => {
  const { placeName } = useParams();
  const navigate = useNavigate();
  const formattedPlaceName = (placeName || '').replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    padding: '2rem'
  };

  const titleStyle = {
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
    fontWeight: '800',
    background: 'linear-gradient(135deg, var(--accent), #FFD700)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem'
  };

  const subtitleStyle = {
    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
    color: 'var(--text-primary)',
    fontWeight: '600',
    marginBottom: '1.5rem'
  };

  const textStyle = {
    fontSize: '1.25rem',
    color: 'var(--text-secondary)',
    marginBottom: '2.5rem'
  };

  const buttonStyle = {
    background: 'var(--accent)',
    color: 'var(--primary-bg)',
    padding: '0.8rem 2rem',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>AR/VR Preview</h1>
      <h2 style={subtitleStyle}>{formattedPlaceName}</h2>
      <p style={textStyle}>This feature is coming soon!</p>
      <button style={buttonStyle} onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

const Maps = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [detailPlace, setDetailPlace] = useState(null);
  const [activeCategory, setActiveCategory] = useState('touristSpots');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const tooltipRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);
  
  const { ref: mapSectionViewRef, inView: isMapSectionVisible } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (isMapSectionVisible && !hasAutoOpened) {
      setSidebarOpen(true);
      setHasAutoOpened(true);
    }
  }, [isMapSectionVisible, hasAutoOpened]);
  
  useEffect(() => {
    const handleScroll = () => {
        const landingPageHeight = window.innerHeight;
        setIsScrolled(window.scrollY > landingPageHeight);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePlaceSelect = (place) => setSelectedPlace(place);

  const handleMapMarkerClick = (place) => {
    setSelectedPlace(place);
    setDetailPlace(place);
    setIsTooltipVisible(false);
  };

  const handleLocationClick = (location) => {
    setCurrentLocation(location);
    if (mapRef.current) { mapRef.current.panTo(location); mapRef.current.setZoom(14); }
  };
  const handleCloseDetail = () => setDetailPlace(null);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleMouseMoveOnMap = (e) => {
    if (tooltipRef.current) {
      tooltipRef.current.style.top = `${e.clientY}px`;
      tooltipRef.current.style.left = `${e.clientX}px`;
    }
  };
  const handleMouseEnterMap = () => {
    setIsTooltipVisible(true);
  };
  const handleMouseLeaveMap = () => {
    setIsTooltipVisible(false);
  };

  return (
    <>
      <GlobalStyles />
      <LandingPage />
      <TransitionSection />
      
      <Element name="mapSection">
        <div ref={mapSectionViewRef} className="map-section">
          <Header onToggleSidebar={toggleSidebar} showNavLinks={false} isScrolled={isScrolled} />
          <div className="app-container">
            <Sidebar isOpen={sidebarOpen} onPlaceSelect={handlePlaceSelect} selectedPlace={selectedPlace} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
            <div
              className="main-content"
              onMouseMove={handleMouseMoveOnMap}
              onMouseEnter={handleMouseEnterMap}
              onMouseLeave={handleMouseLeaveMap}
            >
              <div
                ref={tooltipRef}
                className={`map-cursor-tooltip ${isTooltipVisible ? 'visible' : ''}`}
              >
                Click a spot to see details
              </div>
              <MapWrapper mapRef={mapRef} selectedPlace={selectedPlace} onPlaceSelect={handleMapMarkerClick} onLocationClick={handleLocationClick} activeCategory={activeCategory} currentLocation={currentLocation} />
            </div>
            {detailPlace && <PlaceDetailCard place={detailPlace} onClose={handleCloseDetail} />}
          </div>
        </div>
      </Element>
    </>
  );
}

export default Maps;