import React, { useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// --- REGISTER GSAP PLUGIN ---
gsap.registerPlugin(ScrollTrigger);

// --- ASSETS ---
// Make sure all these images are in your src folder or update the paths
import logo from '/assets/images/jharkhand_yatri_sathi_logo.png';
import heroBackground from '/assets/images/guide_hero_bg.png';
import guidePageBackground from '/assets/images/jharkhand-background1.png';


// --- ALL SVG ICONS ---

// Icons for Login & Page 1
const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.655-3.357-11.297-7.962l-6.571,4.819C9.656,39.663,16.318,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.904,36.218,44,30.618,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
);
const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24"><path d="M12,2C6.477,2,2,6.477,2,12c0,5.013,3.693,9.153,8.505,9.876V14.89H8.355v-2.78h2.15V9.949c0-2.125,1.262-3.29,3.206-3.29 c0.91,0,1.861,0.164,1.861,0.164v2.365h-1.205c-1.054,0-1.39,0.622-1.39,1.33v1.59h2.645l-0.424,2.78h-2.22V21.876 C18.307,21.153,22,17.013,22,12C22,6.477,17.523,2,12,2z" fill="#1877f2"></path></svg>
);
const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
        <defs><radialGradient id="insta-grad" cx="0.35" cy="0.95" r="1.5"><stop offset="0" stopColor="#feda75" /><stop offset="0.25" stopColor="#fa7e1e" /><stop offset="0.5" stopColor="#d62976" /><stop offset="0.75" stopColor="#962fbf" /><stop offset="1" stopColor="#4f5bd5" /></radialGradient></defs>
        <path fill="url(#insta-grad)" d="M12,2C8.687,2,6,4.687,6,8v8c0,3.313,2.687,6,6,6s6-2.687,6-6V8C18,4.687,15.313,2,12,2z M16,16 c0,2.209-1.791,4-4,4s-4-1.791-4-4V8c0-2.209,1.791-4,4-4s4,1.791,4,4V16z M12,7C9.239,7,7,9.239,7,12s2.239,5,5,5s5-2.239,5-5 S14.761,7,12,7z M12,15c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S13.657,15,12,15z M16.5,6.5c-0.552,0-1,0.448-1,1 s0.448,1,1,1s1-0.448,1-1S17.052,6.5,16.5,6.5z"/>
    </svg>
);

// Icons for Page 2
const rupeeIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 3h12a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H6z'/%3E%3Cpath d='M8 8h8 M8 12h8 M11 16h2'%3E%3C/path%3E%3C/svg%3E";
const heritageIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 21h18 M5 21V5l7-4 7 4v16 M12 21v-7 M9 14H5 M19 14h-4'%3E%3C/path%3E%3C/svg%3E";
const scheduleIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpolyline points='12 6 12 12 16 14'/%3E%3C/svg%3E";
const globeIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='2' y1='12' x2='22' y2='12'/%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/%3E%3C/svg%3E";
const ambassadorIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m12 1 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 18.91l-5-4.87 6.91-1.01L12 1z'/%3E%3C/svg%3E";

// Icons for Page 3
const ProfileIcon = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const RatingIcon = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const EarningIcon = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 5H9.5C8.94772 5 8.5 5.44772 8.5 6C8.5 6.55228 8.94772 7 9.5 7H14.5M17 5V19C17 19.5523 16.5523 20 16 20H8C7.44772 20 7 19.5523 7 19V5C7 4.44772 7.44772 4 8 4H16C16.5523 4 17 4.44772 17 5ZM7 10H17M7 14H17M10.5 17H13.5" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 2C16.4183 2 20 5.58172 20 10V14C20 18.4183 16.4183 22 12 22C7.58172 22 4 18.4183 4 14V10C4 5.58172 7.58172 2 12 2Z" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 12L14 12" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const TripsLiveTrackIcon = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 12H19C20.6569 12 22 13.3431 22 15C22 16.6569 20.6569 18 19 18H5C3.34315 18 2 16.6569 2 15C2 13.3431 3.34315 12 5 12H7M17 12L14 9M17 12L14 15" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const RequestIcon = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C5.44772 2 5 2.44772 5 3V21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21V8L14 2Z" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2V8H20" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 13H15M9 17H15M10 9H14" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const VerificationIcon = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 12L11 15L16 9" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);

// --- LOGIN PAGE COMPONENT ---
function LoginPage({ isVisible, onClose }) {
    // This component's code is exactly the same as you provided.
    const container = useRef(null);
    const card = useRef(null);

    useGSAP(() => {
        if (isVisible) {
            gsap.set(container.current, { display: 'flex' });
            gsap.fromTo(container.current,
                { backdropFilter: 'blur(0px)', backgroundColor: 'rgba(0,0,0,0)' },
                { backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.3)', duration: 0.5 }
            );
            gsap.from(card.current, { opacity: 0, scale: 0.95, y: 20, duration: 0.5, ease: 'power3.out' });
        }
    }, { scope: container, dependencies: [isVisible] });

    const handleClose = () => {
        gsap.to(card.current, { opacity: 0, scale: 0.95, y: 20, duration: 0.3, ease: 'power3.in' });
        gsap.to(container.current, {
            backdropFilter: 'blur(0px)',
            backgroundColor: 'rgba(0,0,0,0)',
            duration: 0.3,
            delay: 0.1,
            onComplete: () => {
                gsap.set(container.current, { display: 'none' });
                if (onClose) onClose();
            }
        });
    };

    if (!isVisible) return null;

    return (
        <div ref={container} className="login-popup-container" onClick={handleClose}>
            <div ref={card} className="login-card" onClick={(e) => e.stopPropagation()}>
                <div className="icon-container"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <h2 className="login-title">Sign in with email</h2>
                <p className="login-subtitle">Make a new doc to bring your words, data, and teams together.</p>
                <div className="input-wrapper"><span className="input-icon"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5l-8-5h16zm0 12H4V8l8 5l8-5v10z"/></svg></span><input className="login-input" type="email" placeholder="Email" /></div>
                <div className="input-wrapper"><span className="input-icon"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/></svg></span><input className="login-input" type="password" placeholder="Password" /></div>
                <a href="#" className="forgot-password">Forgot password?</a>
                <button className="login-button">Get Started</button>
                <div className="divider">Or sign in with</div>
                <div className="social-login">
                    <button className="social-btn"><GoogleIcon /></button>
                    <button className="social-btn"><FacebookIcon /></button>
                    <button className="social-btn"><InstagramIcon /></button>
                </div>
            </div>
        </div>
    );
}


// --- PAGE 1: LANDING PAGE COMPONENT ---
function LandingPage({ onLoginClick }) {
    // This component's code is exactly the same as you provided.
    const headline = useRef(null);
    const subtitle = useRef(null);
    const description = useRef(null);

    useLayoutEffect(() => {
        const splitText = (el) => {
            if (el) {
                el.innerHTML = el.innerText.split(/\s+/).map((word) => `<span class="word-wrapper"><span class="word">${word}</span></span>`).join(' ');
            }
        };
        splitText(headline.current);
        splitText(subtitle.current);
        splitText(description.current);
    }, []);

    return (
        <section className="panel page-one">
            <div className="page-wrapper" style={{ backgroundImage: `url(${heroBackground})` }}>
                <div className="hero-section">
                    <div className="hero-content">
                        <p ref={subtitle} className="hero-subtitle">#1 Platform for Local Guides</p>
                        <h2 ref={headline} className="hero-headline">Empowering Local Voices, Guiding Jharkhand's Future</h2>
                        <p ref={description} className="hero-description">Share your local expertise, earn, and showcase the rich culture and stunning beauty of Jharkhand to the world.</p>
                        <div className="hero-actions">
                            <button className="hero-btn hero-login-btn" onClick={onLoginClick}>Login</button>
                            <button className="hero-btn hero-register-btn">Register as Sathi</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- PAGE 2: GUIDE FEATURES PAGE ---
function GuidePage() {
    // This component's code is exactly the same as you provided.
    const mainCardRef = useRef(null);

    useGSAP(() => {
        const animatableElements = gsap.utils.toArray('.anim-target-page2');
        gsap.set(animatableElements, { opacity: 0, y: 30 });

        ScrollTrigger.create({
            trigger: mainCardRef.current,
            start: "top 70%",
            onEnter: () => {
                gsap.to(animatableElements, {
                    duration: 1.2,
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    ease: 'power3.out',
                    delay: 0.2,
                });
            }
        });

        const circles = mainCardRef.current.querySelectorAll('.circle-item');
        circles.forEach(circle => {
            circle.addEventListener('mouseenter', () => gsap.to(circle, { duration: 0.3, scale: 1.05, y: -5, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', ease: 'power1.out' }));
            circle.addEventListener('mouseleave', () => gsap.to(circle, { duration: 0.3, scale: 1, y: 0, boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)', ease: 'power1.out' }));
        });
    }, { scope: mainCardRef });

    const features = [
        { text: 'Earn as You Share', icon: rupeeIcon },
        { text: 'Showcase Local Heritage', icon: heritageIcon },
        { text: 'Work on Your Schedule', icon: scheduleIcon },
        { text: 'Meet Global Travelers', icon: globeIcon },
        { text: 'Be a Jharkhand Ambassador', icon: ambassadorIcon },
    ];

    return (
        <section className="panel page-two">
             <div className="page2-container" style={page2Styles.appContainer}>
                <div style={{ ...page2Styles.background, backgroundImage: `url(${guidePageBackground})` }}></div>
                <div ref={mainCardRef} style={page2Styles.mainCard}>
                    <div style={page2Styles.textContainer}>
                        <h1 className="anim-target-page2" style={page2Styles.title}>
                            Unlock Jharkhand's Stories<br />Become a Local Guide Today!
                        </h1>
                        <p className="anim-target-page2" style={page2Styles.description}>
                            Share your unique perspective, rich cultural insights, and hidden gems with curious travelers. Empower your livelihood, and put Jharkhand's spirit on the global map.
                        </p>
                    </div>
                    <div style={page2Styles.featuresContainer}>
                        {features.map((item, index) => (
                            <div key={index} className="anim-target-page2 circle-item" style={page2Styles.circle}>
                                <img src={item.icon} alt={item.text} style={page2Styles.circleIcon} />
                                <p style={page2Styles.circleText}>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// Styles for Page 2 (as a JS object)
const page2Styles = {
    appContainer: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', boxSizing: 'border-box', fontFamily: "'Poppins', sans-serif, system-ui", position: 'relative', overflow: 'hidden' },
    background: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -1 },
    mainCard: { maxWidth: '1100px', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.35)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '30px', padding: '100px 80px', color: '#FFFFFF', textAlign: 'center', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' },
    textContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', gap: '30px', flexWrap: 'wrap' },
    title: { fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '600', lineHeight: '1.3', margin: 0, textAlign: 'left', flex: 1, minWidth: '300px', textShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)' },
    description: { fontSize: 'clamp(0.9rem, 2vw, 1rem)', lineHeight: '1.7', margin: 0, textAlign: 'left', flex: 1, minWidth: '300px', color: 'rgba(255, 255, 255, 0.9)', textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)' },
    featuresContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '0px' },
    circle: { width: '150px', height: '150px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px', boxSizing: 'border-box', cursor: 'pointer', boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)' },
    circleIcon: { width: '48px', height: '48px', marginBottom: '10px' },
    circleText: { fontSize: '0.9rem', fontWeight: '500', margin: 0, color: '#FFFFFF', textShadow: '0px 1px 3px rgba(0, 0, 0, 0.6)' },
};

// --- PAGE 3: DASHBOARD FEATURES PAGE ---
function FeaturesPage() {
    // This component's code is exactly the same as you provided.
    const componentRef = useRef(null);

    useGSAP(() => {
        gsap.from(".features-title, .features-subtitle", {
            opacity: 0, y: 40, duration: 1, ease: 'power3.out', stagger: 0.2,
            scrollTrigger: { trigger: componentRef.current, start: "top 80%", toggleActions: "play none none reverse" }
        });
        gsap.from(".feature-card", {
            opacity: 0, y: 50, duration: 0.8, ease: "power3.out", stagger: 0.15,
            scrollTrigger: { trigger: ".features-grid", start: "top 80%", toggleActions: "play none none reverse" }
        });

        gsap.utils.toArray('.feature-card').forEach(card => {
            const iconWrapper = card.querySelector('.feature-icon-wrapper');
            const icon = card.querySelector('svg');
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { y: -8, boxShadow: '0 12px 25px rgba(0, 0, 0, 0.1)', duration: 0.3, ease: 'power2.out' });
                gsap.to(iconWrapper, { scale: 1.1, backgroundColor: '#d4ede0', duration: 0.3, ease: 'power2.out' });
                gsap.to(icon, { scale: 1.2, rotate: 10, duration: 0.3, ease: 'power2.out' });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { y: 0, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)', duration: 0.3, ease: 'power2.out' });
                gsap.to(iconWrapper, { scale: 1, backgroundColor: '#e6f4ea', duration: 0.3, ease: 'power2.out' });
                gsap.to(icon, { scale: 1, rotate: 0, duration: 0.3, ease: 'power2.out' });
            });
        });
    }, { scope: componentRef });
    
    const features = [
        { icon: <ProfileIcon />, title: "Profile", description: "Showcase your expertise, languages, and unique tours to attract travelers from around the globe." },
        { icon: <RatingIcon />, title: "Tourist Ratings", description: "Build trust with travelers via reviews and a star rating system, enhancing your credibility as a guide." },
        { icon: <EarningIcon />, title: "Flexible Earning", description: "Set your rates and receive secure, timely payouts for every completed tour." },
        { icon: <TripsLiveTrackIcon />, title: "Trips & Live Track", description: "Manage bookings, view itineraries, and share live location updates with your tourists for safety." },
        { icon: <RequestIcon />, title: "Booking Requests", description: "Accept or decline tour requests swiftly, directly from your app, avoiding any obstacles or delays." },
        { icon: <VerificationIcon />, title: "ID Verification", description: "Ensure safety and authenticity with a verified badge, building confidence with your tourists." },
    ];

    return (
        <section ref={componentRef} className="panel page-three">
            <div className="features-page-container">
                <div className="features-header">
                    <h2 className="features-title">Uncover Amazing Features</h2>
                    <p className="features-subtitle">Everything you need to guide and explore Jharkhand with ease.</p>
                </div>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon-wrapper">{feature.icon}</div>
                            <h3 className="feature-card-title">{feature.title}</h3>
                            <p className="feature-card-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


// --- MAIN APP COMPONENT (Manages Layout and Scroll Transition) ---
function NewUser() {
    const mainRef = useRef(null);
    const logoContainer = useRef(null);
    const logoImg = useRef(null);
    const logoTitle = useRef(null);
    const [isLoginVisible, setIsLoginVisible] = useState(false);

useLayoutEffect(() => {
  // Tell the browser we'll handle scroll restoration manually
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  // Always scroll to the top
  window.scrollTo(0, 0);

  // Check if page was reloaded, then redirect to main page
  if (performance.navigation.type === 1) {
    window.location.href = "/"; // change "/" to your main page route
  }
}, []);


    useGSAP(() => {
        // --- Intro Animation ---
        const introTl = gsap.timeline();
        introTl.from(logoImg.current, { x: -200, opacity: 0, duration: 1.2, ease: "power3.out" });
        introTl.from(logoTitle.current, { x: 200, opacity: 0, duration: 1.2, ease: "power3.out" }, "<");
        introTl.to(logoContainer.current, {
            top: '30px', left: '60px', xPercent: 0, yPercent: 0, scale: 0.5,
            duration: 1.5, ease: "power4.inOut"
        }, "+=0.5");
        
        introTl.from(".page-one", { autoAlpha: 0, duration: 1 }, "-=1.5");
        const allText = ".word, .hero-actions";
        gsap.set(allText, { yPercent: 120 });
        introTl.to(allText, { yPercent: 0, duration: 0.8, ease: 'power2.out', stagger: 0.035 }, "-=1.2");

        // --- Reliable Scroll Transition ---
        const panels = gsap.utils.toArray(".panel");
        gsap.set(panels.slice(1), { autoAlpha: 0 }); // Hide all panels except the first

        panels.forEach((panel, i) => {
            if (i > 0) {
                ScrollTrigger.create({
                    trigger: panel,
                    start: "top center+=100", // When panel top hits 100px below center
                    onEnter: () => {
                        gsap.to(panels[i-1], { autoAlpha: 0, duration: 0.4 });
                        gsap.to(panel, { autoAlpha: 1, duration: 0.4 });
                    },
                    onLeaveBack: () => {
                        gsap.to(panels[i-1], { autoAlpha: 1, duration: 0.4 });
                        gsap.to(panel, { autoAlpha: 0, duration: 0.4 });
                    }
                });
            }
        });
        
    }, { scope: mainRef });
    
    return (
        <div ref={mainRef}>
            <style>{`
                /* --- GLOBAL STYLES --- */
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
                
                body { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; background-color: #fff; }
                main { position: relative; }
                .panel { width: 100vw; height: 100vh; position: sticky; top: 0; left: 0; overflow: hidden; }

                /* --- LOGO STYLES --- */
                .logo-transition-container { position: fixed; top: 40%; left: 40%; transform: translate(-30%, -30%); z-index: 100; display: flex; align-items: center; gap: 15px; }
                .animated-logo { width: 180px; height: 180px; }
                .animated-title { font-family: 'Poppins', sans-serif; font-size: 3em; font-weight: 600; color: #2e7d32; margin: 0; white-space: nowrap; }
                
                /* --- PAGE 1 STYLES --- */
                .word-wrapper { display: inline-block; overflow: hidden; }
                .word { display: inline-block; }
                .page-wrapper { width: 100%; height: 100%; background-size: cover; background-position: center; display: flex; flex-direction: column; }
                .hero-section { flex-grow: 1; display: flex; align-items: center; justify-content: flex-start; padding: 0px 80px; color: #fff; }
                .hero-subtitle { font-size: 1.1em; font-weight: 500; margin-bottom: 10px; }
                .hero-headline { font-family: 'Poppins', sans-serif; font-size: clamp(2.5em, 5vw, 3.8em); font-weight: 700; line-height: 1.1; margin: 0 0 20px 0; text-shadow: 0 2px 5px rgba(0,0,0,0.5); }
                .hero-description { font-size: 1.1em; margin-bottom: 30px; max-width: 550px; text-shadow: 0 1px 3px rgba(0,0,0,0.5); }
                .hero-actions { display: flex; gap: 15px; }
                .hero-btn { padding: 15px 30px; border: none; border-radius: 15px; font-weight: 600; cursor: pointer; font-size: 1.05em; transition: all 0.3s ease; }
                .hero-login-btn { background-color: #fff; color: #2e7d32; }
                .hero-register-btn { background-color: #2e7d32; color: #fff; }
                
                /* --- LOGIN POPUP STYLES --- */
                .login-popup-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: none; justify-content: center; align-items: center; z-index: 999; }
                .login-card { background: rgba(255, 255, 255, 0.7); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 24px; padding: 40px; width: 100%; max-width: 420px; box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2); text-align: center; display: flex; flex-direction: column; gap: 16px; }
                .icon-container { width: 48px; height: 48px; background-color: #fff; border-radius: 12px; display: flex; justify-content: center; align-items: center; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
                .login-title { font-size: 24px; font-weight: 700; color: #1a1a1a; margin: 0; }
                .login-subtitle { font-size: 15px; color: #555; margin: 0; line-height: 1.5; max-width: 300px; margin: 0 auto; }
                .input-wrapper { position: relative; }
                .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #888; }
                .login-input { width: 100%; padding: 14px 16px 14px 48px; border-radius: 12px; border: 1px solid #ddd; background-color: #f9f9f9; font-size: 16px; box-sizing: border-box; }
                .forgot-password { text-align: right; font-size: 14px; color: #4a90e2; text-decoration: none; font-weight: 500; }
                .login-button { background-color: #222; color: white; border: none; padding: 16px; border-radius: 14px; font-size: 16px; font-weight: 600; cursor: pointer; }
                .divider { display: flex; align-items: center; color: #aaa; font-size: 13px; }
                .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid #e0e0e0; }
                .divider:not(:empty)::before { margin-right: .75em; }
                .divider:not(:empty)::after { margin-left: .75em; }
                .social-login { display: flex; justify-content: center; gap: 16px; }
                .social-btn { width: 80px; height: 50px; display: flex; justify-content: center; align-items: center; border: 1px solid #e0e0e0; border-radius: 12px; cursor: pointer; }
                
                /* --- PAGE 3 STYLES --- */
                .page-three .features-page-container { background-color: #f8f8f8; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 40px; color: #333; width:100%; height:100%; box-sizing: border-box; }
                .features-header { text-align: center; margin-bottom: 60px; max-width: 800px; }
                .features-title { font-family: 'Poppins', sans-serif; font-size: clamp(2.2em, 4vw, 3.2em); font-weight: 700; color: #2e7d32; margin: 0 0 10px 0; line-height: 1.2; }
                .features-subtitle { font-size: clamp(1.1em, 2vw, 1.4em); font-weight: 500; color: #777; margin: 0; max-width: 600px; }
                .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 1200px; width: 100%; }
                .feature-card { background-color: #fff; border-radius: 18px; padding: 30px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; align-items: flex-start; text-align: left; border: 1px solid #eee; }
                .feature-icon-wrapper { background-color: #e6f4ea; border-radius: 10px; padding: 12px; margin-bottom: 20px; display: inline-flex; }
                .feature-card-title { font-family: 'Poppins', sans-serif; font-size: 1.4em; font-weight: 600; color: #333; margin: 0 0 10px 0; }
                .feature-card-description { font-size: 0.95em; color: #666; line-height: 1.6; margin: 0; }
            `}</style>
            
            <div ref={logoContainer} className="logo-transition-container">
                <img ref={logoImg} src={logo} alt="Jharkhand Yatri Sathi Logo" className="animated-logo" />
                <h1 ref={logoTitle} className="animated-title">Jharkhand Yatri Sathi</h1>
            </div>

            <main>
                <LandingPage onLoginClick={() => setIsLoginVisible(true)} />
                <GuidePage />
                <FeaturesPage />
            </main>
            
            <LoginPage isVisible={isLoginVisible} onClose={() => setIsLoginVisible(false)} />
        </div>
    );
}

export default NewUser;