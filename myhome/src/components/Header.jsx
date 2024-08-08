import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
const Header = () => {
  const [loggedIn, setLoggedIn] = useState(true);
  const auth = getAuth();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      },
      [auth]
    );
  });
  return (
    <div
      className="bg-white border-b shadow-sm sticky top-0
    left-0 z-40"
    >
      <header className="flex flex-wrap justify-between items-center px-3 mx-auto my-auto max-w-6xl mt-2 sm:mt-[0]">
        {/* logo */}
        <div>
          <img
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="logo"
            className="h-6 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
        {/* menu */}
        <div className="">
          <ul className="flex space-x-10 mt-2 sm:mt-[0] ">
            <li
              className={`cursor-pointer py-3 font-semibold text-sm  border-b-2 ${
                location.pathname === "/"
                  ? "text-black border-b-red-500"
                  : "border-b-transparent text-gray-400"
              }`}
              onClick={() => {
                navigate("/");
              }}
            >
              Home
            </li>
            <li
              className={`cursor-pointer py-3 font-semibold text-sm  border-b-2 ${
                location.pathname === "/offers"
                  ? "text-black border-b-red-500"
                  : "border-b-transparent text-gray-400"
              }`}
              onClick={() => {
                navigate("/offers");
              }}
            >
              Offers
            </li>
            <li
              className={`cursor-pointer py-3 font-semibold text-sm  border-b-2 ${
                location.pathname === "/sign-in" ||
                location.pathname === "/profile"
                  ? "text-black border-b-red-500"
                  : "border-b-transparent text-gray-400"
              }`}
              onClick={() => {
                navigate("/profile");
              }}
            >
              {loggedIn ? "Profile" : "Sign In"}
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
