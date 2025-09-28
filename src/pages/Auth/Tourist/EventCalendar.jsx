import { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function EventCalendar() {
  const containerRef = useRef(null);

  useEffect(() => {
    const scrollEl = containerRef.current;

    const locoScroll = new LocomotiveScroll({
      el: scrollEl,
      smooth: true,
    });

    gsap.registerPlugin(ScrollTrigger);

    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(scrollEl, {
      scrollTop(value) {
        return arguments.length
          ? locoScroll.scrollTo(value, 0, 0)
          : locoScroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: scrollEl.style.transform ? "transform" : "fixed",
    });

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();

    const centerTextChildren = document.querySelectorAll("#center-text > *");
    gsap.to(centerTextChildren, {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power3.out",
      stagger: 0.2,
      delay: 0.2,
    });

    function initializeSeasonSection(pageId, words) {
      const page = document.querySelector(pageId);
      if (!page) return;
      const title = page.querySelector(".season-title");
      const cursorText = page.querySelector(".cursor-text");
      const festivalCards = page.querySelectorAll(".festival-card");
      let hasPlayedScrollIn = false;
      let currentIndex = 1;
      let cycleTimeout;
      let festivalsAreVisible = false;
      let resetTimeout;
      function setWord(word) {
        title.innerHTML = "";
        const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
        const segments = segmenter.segment(word);
        for (const { segment } of segments) {
          const span = document.createElement("span");
          span.textContent = segment;
          title.appendChild(span);
        }
        const letters = title.querySelectorAll("span");
        letters.forEach((letter, index) => {
          setTimeout(() => letter.classList.add("show"), index * 100);
        });
      }
      function startCycling(initial = false) {
        clearTimeout(cycleTimeout);
        function cycle() {
          setWord(words[currentIndex]);
          currentIndex = (currentIndex + 1) % words.length;
          cycleTimeout = setTimeout(cycle, 2000);
        }
        if (initial) {
          cycleTimeout = setTimeout(cycle, 2500);
        } else {
          cycleTimeout = setTimeout(cycle, 1500);
        }
      }
      function stopCycling() { clearTimeout(cycleTimeout); }
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!hasPlayedScrollIn) {
                setWord(words[0]);
                hasPlayedScrollIn = true;
                startCycling(true);
              } else {
                startCycling(false);
              }
            } else {
              stopCycling();
            }
          });
        }, { threshold: 0.5 }
      );
      observer.observe(page);
      page.addEventListener("mousemove", (e) => {
        const rect = page.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cursorText.style.left = `${x}px`;
        cursorText.style.top = `${y}px`;
      });
      page.addEventListener("click", () => {
        if (festivalsAreVisible) return;
        festivalsAreVisible = true;
        page.classList.add("festivals-active");
        cursorText.style.display = "none";
      });
      festivalCards.forEach((card) => {
        const video = card.querySelector("video");
        card.addEventListener("mouseenter", () => { if (video) video.play(); });
        card.addEventListener("mouseleave", () => {
          if (video) { video.pause(); video.currentTime = 0; }
          card.classList.remove("show-info");
        });
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const verticalMidpoint = rect.top + rect.height / 2;
          if (e.clientY > verticalMidpoint) {
            card.classList.add("show-info");
          } else {
            card.classList.remove("show-info");
          }
        });
      });
      page.addEventListener("mouseenter", () => { clearTimeout(resetTimeout); });
      page.addEventListener("mouseleave", () => {
        if (festivalsAreVisible) {
          resetTimeout = setTimeout(() => {
            page.classList.remove("festivals-active");
            festivalsAreVisible = false;
            cursorText.style.display = "block";
            setWord(words[0]);
            startCycling(false);
          }, 300);
        }
      });
    }

    const springWords = ["SPRING", "वसंत", "વસંત", "வசந்தம்", "వసంతం", "ವಸಂತ"];
    const monsoonWords = ["MONSOON", "मानसून", "ચોમાસુ", "பருவமழை", "వర్షాకాలం", "ಮುಂಗಾರು"];
    const winterWords = ["WINTER", "सर्दी", "શિયાળો", "குளிர்காலம்", "శీతాకాలం", "ಚಳಿಗಾಲ"];
    initializeSeasonSection("#page2", springWords);
    initializeSeasonSection("#page3", monsoonWords);
    initializeSeasonSection("#page4", winterWords);

    return () => {
      locoScroll.destroy();
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <>
      <style>{`
        #center-text span {
          color: #e5e7eb;
          font-size: 1.6vw;
          font-weight: 400;
          letter-spacing: 0.025em;
          max-width: 60%;
          line-height: 1.5;
          text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
        }

        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600;700&family=Poppins:wght@300;400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@700&family=Noto+Sans+Devanagari:wght@700&family=Noto+Sans+Gujarati:wght@700&family=Noto+Sans+Kannada:wght@700&family=Noto+Sans+Tamil:wght@700&family=Noto+Sans+Telugu:wght@700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; width: 100%; margin: 0; padding: 0; background: #000; } 
        #main-container { height: 100vh; width: 100%; position: relative; overflow: hidden; background-size: cover; background-position: center; background-image: url('/assets/images/page1_bg.png'); }
        .overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.3); z-index: 1; }
        #content { color: white; height: 100%; width: 100%; position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2vw; }
        nav { position: absolute; top: 0; left: 0; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 2vw 3vw; z-index: 3; }
        nav h3 { font-size: 2vw; font-weight: 600; }
        nav h4 { font-size: 1.5vw; font-weight: 500; }
        #center-text > * { opacity: 0; transform: translateY(48px); }
        #center-text h1 { font-family: "Josefin Sans", sans-serif; font-size: 7vw; font-weight: 700; margin-bottom: 1vw; text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.6); display: flex; flex-direction: column; align-items: center; }
        #center-text .highlight-text { color: #facc15; }
        .season-page { height: 100vh; width: 90vw; margin: auto; color: #F5F5F5; font-size: 7vw; display: flex; align-items: center; justify-content: center; background-size: cover; background-repeat: no-repeat; background-position: center; overflow: hidden; position: relative; border-radius: 20px; transition: transform 0.6s ease-in-out, box-shadow 0.6s ease-in-out; }
        #page2 { background-image: url("/assets/images/spring.png"); }
        #page3 { background-image: url("/assets/images/mansoon.png"); }
        #page4 { background-image: url("/assets/images/winter.png"); } /* Added winter background */
        .season-page::before { content: ""; position: absolute; inset: 0; background: linear-gradient(to bottom right, rgba(0,0,0,0.4), rgba(0,0,0,0.2)); border-radius: 20px; z-index: 1; transition: background 0.8s ease; }
        .season-page:hover { transform: scale(1.02); box-shadow: 0px 15px 35px rgba(0, 0, 0, 0.4); }
        .season-page .season-title { font-family: "Josefin Sans", "Noto Sans Devanagari", "Noto Sans Gujarati", "Noto Sans Tamil", "Noto Sans Telugu", "Noto Sans Kannada", sans-serif; position: relative; z-index: 2; font-size: 9vw; display: flex; gap: 0.2em; transition: all 0.8s ease-in-out; }
        .season-page .season-title span { opacity: 0; transform: translateY(30px); display: inline-block; }
        .season-page .season-title span.show { animation: letterAppear 0.6s forwards; }
        @keyframes letterAppear { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .cursor-text { position: absolute; z-index: 10; font-size: 1.2vw; font-family: "Poppins", sans-serif; color: #fff; background-color: rgba(0, 0, 0, 0.6); padding: 8px 16px; border-radius: 20px; pointer-events: none; opacity: 0; transform: translate(-50%, -50%); transition: opacity 0.3s ease; }
        .season-page:hover .cursor-text { opacity: 1; }
        .season-page.festivals-active:hover .cursor-text { opacity: 0; }
        .season-page.festivals-active { align-items: flex-start; cursor: default; }
        .season-page.festivals-active::before { background: linear-gradient(to bottom right, rgba(0,0,0,0.7), rgba(0,0,0,0.5)); }
        .season-page.festivals-active .season-title { font-size: 4.5vw; transform: translate(3vw, 3vh); }
        .festivals-container { position: absolute; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; gap: 20px; padding: 10vh 5vw; z-index: 5; opacity: 0; transition: opacity 0.8s ease 0.5s; }
        .season-page.festivals-active .festivals-container { opacity: 1; }
        .festival-card { margin-top: auto; flex: 1; height: 85%; background-size: cover; background-position: center; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.2); position: relative; overflow: hidden; display: flex; justify-content: center; align-items: center; transition: all 0.4s ease; }
        .festival-card::before { content: ""; position: absolute; inset: 0; background-color: rgba(0, 0, 0, 0.4); z-index: 1; }
        .festival-card h2 { font-size: 3vw; font-family: "Josefin Sans", sans-serif; transition: opacity 0.4s ease; z-index: 3; color: #fff; text-shadow: 2px 2px 8px rgba(0,0,0,0.8); }
        .festival-card:hover { transform: translateY(-10px); box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
        .festival-card:hover h2 { opacity: 0; }
        .festival-details { position: absolute; inset: 0; opacity: 0; transition: opacity 0.4s ease; z-index: 2; }
        .festival-card:hover .festival-details { opacity: 1; }
        .video-container { position: absolute; inset: 0; width: 100%; height: 100%; }
        .video-container video { width: 100%; height: 100%; object-fit: cover; }
        .info-container { position: absolute; bottom: 0; left: 0; width: 100%; padding: 40px 20px; text-align: center; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); opacity: 0; transform: translateY(20px); transition: opacity 0.3s ease, transform 0.3s ease; color: #FFFFFF; text-shadow: 0px 0px 8px rgba(0,0,0,0.8); }
        .festival-card.show-info .info-container { opacity: 1; transform: translateY(0); }
        .info-container h3 { font-size: 1.8vw; margin-bottom: 10px; }
        .info-container p { font-size: 1vw; font-family: "Poppins", sans-serif; }
        .explore-btn { margin-top: 20px; padding: 10px 25px; font-size: 1vw; font-family: "Poppins", sans-serif; font-weight: 500; color: #fff; background-color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 50px; cursor: pointer; transition: background-color 0.3s ease, transform 0.3s ease; }
        .explore-btn:hover { background-color: rgba(255, 255, 255, 0.4); transform: scale(1.05); }
        .empty{ background-color: black; height: 9vw; }
      `}</style>

      <div id="main" data-scroll-container ref={containerRef}>
        <div id="main-container">
          <div className="overlay"></div>
          <div id="content">
            <nav>
              <h3>Jharkhand Festivals</h3>
              <h4>Menu</h4>
            </nav>
            <div id="center-text">
              <h1>
                <div>Celebrate the Colors of</div>
                <div className="highlight-text">Jharkhand</div>
              </h1>
              <span>
                Experience the vibrant festivals and rich tribal heritage of
                Jharkhand
              </span>
            </div>
          </div>
        </div>
        <div className="empty"></div>
        <div id="page2" className="season-page">
          <div className="page-content">
            <h1 className="season-title"><span>S</span><span>P</span><span>R</span><span>I</span><span>N</span><span>G</span></h1>
          </div>
          <div className="cursor-text">Click to see festivals</div>
          <div className="festivals-container">
            <div className="festival-card" style={{ backgroundImage: "url('/assets/images/sahrul.jpg')" }}><h2>Sahrul</h2><div className="festival-details"><div className="video-container"><video src="/assets/videos/sahrul.mp4" loop muted></video></div><div className="info-container"><h3>The Festival of Sahrul</h3><p>Sahrul is a major spring festival celebrated by tribal communities in Jharkhand, symbolizing new beginnings and the worship of nature.</p><button className="explore-btn">Explore</button></div></div></div>
            <div className="festival-card" style={{ backgroundImage: "url('/assets/images/baha.jpg')" }}><h2>Baha Parab</h2><div className="festival-details"><div className="video-container"><video src="/assets/videos/baha.mp4" loop muted></video></div><div className="info-container"><h3>Baha Parab</h3><p>Baha Parab is a flower festival celebrated by various tribal groups in Jharkhand, especially the Santhals, to welcome spring.</p><button className="explore-btn">Explore</button></div></div></div>
            <div className="festival-card" style={{ backgroundImage: "url('/assets/images/holi.jpg')" }}><h2>Holi</h2><div className="festival-details"><div className="video-container"><video src="/assets/videos/holi.mp4" loop muted></video></div><div className="info-container"><h3>The Festival of Colors</h3><p>Holi celebrates the arrival of spring and the victory of good over evil.</p><button className="explore-btn">Explore</button></div></div></div>
          </div>
        </div>
        <div className="empty"></div>
        <div id="page3" className="season-page">
          <div className="page-content">
            <h1 className="season-title"><span>M</span><span>O</span><span>N</span><span>S</span><span>O</span><span>O</span><span>N</span></h1>
          </div>
          <div className="cursor-text">Click to see festivals</div>
          <div className="festivals-container">
            <div className="festival-card" style={{ backgroundImage: "url('/assets/images/karam.jpg')" }}><h2>Karam Parab</h2><div className="festival-details"><div className="video-container"><video src="/assets/videos/karam.mp4" loop muted></video></div><div className="info-container"><h3>Karam Parab</h3><p>Karam Parab is an important harvest festival celebrated in Jharkhand, dedicated to the Karam tree, which symbolizes fertility and prosperity.</p><button className="explore-btn">Explore</button></div></div></div>
            <div className="festival-card" style={{ backgroundImage: "url('/assets/images/jitiya.jpg')" }}><h2>Jitiya</h2><div className="festival-details"><div className="video-container"><video src="/assets/videos/jitiya.mp4" loop muted></video></div><div className="info-container"><h3>Jitiya Festival</h3><p>Jitiya is a significant festival where mothers fast for the well-being and longevity of their children.</p><button className="explore-btn">Explore</button></div></div></div>
            <div className="festival-card" style={{ backgroundImage: "url('/assets/images/nawakhani.jpg')" }}><h2>Nawakhani</h2><div className="festival-details"><div className="video-container"><video src="/assets/videos/nawakhani.mp4" loop muted></video></div><div className="info-container"><h3>Nawakhani</h3><p>Nawakhani is a harvest festival where new grains are offered to deities, signifying the fresh produce of the season.</p><button className="explore-btn">Explore</button></div></div></div>
          </div>
        </div>
        <div className="empty"></div>
        <div id="page4" className="season-page">
          <div className="page-content">
            <h1 className="season-title"><span>W</span><span>I</span><span>N</span><span>T</span><span>E</span><span>R</span></h1>
          </div>
          <div className="cursor-text">Click to see festivals</div>
          <div className="festivals-container">
            <div className="festival-card" style={{ backgroundImage: "url('/assets/images/durga.jpg')" }}><h2>Durga Puja</h2><div className="festival-details"><div className="video-container"><video src="/assets/videos/durga.mp4" loop muted></video></div><div className="info-container"><h3>Durga Puja</h3><p>Durga Puja is a grand festival celebrating the Hindu goddess Durga and her victory over the demon Mahishasura.</p><button className="explore-btn">Explore</button></div></div></div>
            <div className="festival-card" style={{ backgroundImage: "url('/assets/images/tusu.jpg')" }}><h2>Tusu</h2><div className="festival-details"><div className="video-container"><video src="/assets/videos/tusu.mp4" loop muted></video></div><div className="info-container"><h3>Tusu Festival</h3><p>Tusu is a folk festival primarily celebrated by women and girls, particularly known for its vibrant celebrations and songs.</p><button className="explore-btn">Explore</button></div></div></div>
            <div className="festival-card" style={{ backgroundImage: "url('/assets/images/sohrai.jpg')" }}><h2>Sohrai</h2><div className="festival-details"><div className="video-container"><video src="/assets/videos/sohrai.mp4" loop muted></video></div><div className="info-container"><h3>Sohrai Festival</h3><p>Sohrai is a harvest festival, often coinciding with Diwali, where cattle are honored and traditional art forms are displayed.</p><button className="explore-btn">Explore</button></div></div></div>
          </div>
        </div>
      </div>
    </>
  );
}