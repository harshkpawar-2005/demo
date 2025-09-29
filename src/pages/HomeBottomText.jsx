import React from "react";
import { Link } from "react-router-dom";

const HomeBottomText = () => {
  return (
    <div className="font-[font2] flex items-center justify-center gap-12 -mt-16">
      <div className="border-4 h-40 hover:border-red-800 hover:text-red-900 flex items-center justify-center px-16 border-black bg-black/10 rounded-full uppercase transition-all duration-300">
        <Link className="text-[5vw] font-bold text-black hover:text-red-900" to="/auth/tourist">
          Tourist
        </Link>
      </div>
      <div className="border-4 h-40 hover:border-red-800 hover:text-red-900 flex items-center justify-center px-16 border-black bg-black/10 rounded-full uppercase transition-all duration-300">
        <Link className="text-[5vw] font-bold text-black hover:text-red-900" to="/guides/newuser">
          Saathi
        </Link>
      </div>
    </div>
  );
};

export default HomeBottomText;