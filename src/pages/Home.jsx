import React from "react";
import HomeHeroText from "./HomeHeroText";
import HomeBottomText from "./HomeBottomText";

const Home = () => {
  return (
    <div className="h-screen w-screen relative overflow-hidden flex flex-col justify-between">
      <HomeHeroText />
      <HomeBottomText />
    </div>
  );
};

export default Home;