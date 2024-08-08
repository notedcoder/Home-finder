import React, { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;
  const handleOnChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        toast.success("Sign in Successfull");
        navigate("/");
      }
    } catch (error) {
      toast.error("Invalid user");
    }
  };
  return (
    <section>
      <h1 className="text-center text-3xl mt-6 font-semibold">Sign In</h1>
      <div className="flex justify-center itmes-center flex-wrap px-6 py-12 max-w-6xl mx-auto my-auto">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80"
            alt="key"
            className="w-full rounded-2xl"
          />
        </div>

        <div className="flex flex-col justify-center w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={onSubmit}>
            <input
              className="w-full px-4 py-2 mb-7 text-lg border-b-[3px] border-red-500 bg-transparent text-gray-700 outline-none rounded-lg"
              id="email"
              value={email}
              type="email"
              placeholder="Email Address"
              onChange={handleOnChange}
            />
            <div className="relative mb-6">
              <input
                className="w-full px-4 py-2 text-lg border-b-[3px] border-red-500 bg-transparent text-gray-700 outline-none rounded-lg"
                id="password"
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder="Password "
                onChange={handleOnChange}
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  onClick={() => setShowPassword((prevState) => !prevState)}
                  className="absolute top-3 right-3 text-xl cursor-pointer"
                />
              ) : (
                <AiFillEye
                  onClick={() => setShowPassword((prevState) => !prevState)}
                  className="absolute top-3 right-3 text-xl cursor-pointer"
                />
              )}
            </div>
            <div className="flex justify-between text-sm md:text-base ">
              <p className="mb-6">
                Don't have a account?
                <Link
                  to={"/sign-up"}
                  className="text-red-600 ml-1 hover:text-red-700 hover:underline trnasition duration-100 ease-in-out"
                >
                  Register Now
                </Link>
              </p>
              <p>
                <Link
                  to={"/forgot-password"}
                  className="text-blue-600 ml-1 hover:text-blue-700 hover:underline trnasition duration-100 ease-in-out"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-7 py-3 text-sm uppercase transition duration-150 ease-in-out rounded shadow-md hover:bg-blue-700 hover:shadow-lg active:bg-blue-800"
            >
              Sign In
            </button>
            <div className="my-4 flex items-center before:border-t-2 before:w-[45%] after:border-t-2 after:w-[45%]">
              <p className="text-center mx-4 tracking-wide font-semibold ">
                OR
              </p>
            </div>

            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
