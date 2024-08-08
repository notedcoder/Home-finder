import React from "react";
import spinner from "../assets/svg/spinner.svg";

export const Spinner = () => {
  return (
    <div className="bg-[#eae6e6] flex justify-center items-center h-screen z-50 fixed top-0 left-0 right-0 bottom-0">
      <div className="">
        <img src={spinner} alt="spinner" className="w-[100px] h-[100px]" />
      </div>
    </div>
  );
};
