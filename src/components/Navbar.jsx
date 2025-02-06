import React from "react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-center bg-slate-800 text-white py-3 px-3 hover:bg-slate-700 transition-colors duration-300 ">
     

      {/* Centered Logo with Continuous Moving Text */}
      <div className="logo ">
        <span className=" flex items-center px-3 font-bold text-4xl text-white animation-move-left-right hover:text-blue-500 " >
          TaskHive – A Buzzing Hub for Your Tasks
        </span>
      </div>

      {/* Empty Div for Spacing Balance */}
      <div className="w-16"></div>
    </nav>
  );
};

export default Navbar;




