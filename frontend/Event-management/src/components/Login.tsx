import { useState, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import logo from "../assets/EaseEvent logo.png";

import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../Store/Reducers/AuthReducer";

import store from "../Store/store";
import { api } from "../Queries/Allquery";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  type RootState = ReturnType<typeof store.getState>;

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await fetch(`${api}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      dispatch(loginSuccess({ token: data.token, user: data.user }));
      navigate("/");
    } catch (err) {
      dispatch(
        loginFailure(err instanceof Error ? err.message : "Login failed")
      );
    }
  };

  const [currentText, setCurrentText] = useState(0);

  const textVariations = [
    {
      title: (
        <>
          Welcome to{" "}
          <span className="text-yellow-300 ease-in-out transform hover:scale-110 hover:text-yellow-400 transition duration-300">
            EaseEvents
          </span>
        </>
      ),
      description: (
        <>
          Where Every Moment Becomes Effortless. Log In to{" "}
          <span className="text-yellow-300">
            {" "}
            Create, Manage, and Celebrate{" "}
          </span>
        </>
      ),
    },
    {
      title: (
        <>
          Simplify Your{" "}
          <span className="text-yellow-300 ease-in-out transform hover:scale-110 hover:text-yellow-400 transition duration-300">
            Events
          </span>
        </>
      ),
      description: (
        <>
          {" "}
          <span className="text-yellow-300">
            Plan, Organize, and Enjoy!
          </span>{" "}
          Your Event Management Solution is Here.
        </>
      ),
    },
    {
      title: (
        <>
          <span className="text-yellow-300 ease-in-out transform hover:scale-110 hover:text-yellow-400 transition duration-300">
            Effortless
          </span>{" "}
          Event Management
        </>
      ),
      description: (
        <>
          Make Every Event Memorable.
          <span className="text-yellow-300"> Sign In </span>to Get Started
          Today!
        </>
      ),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % textVariations.length);
    }, 4000); // Change text every 4 seconds
    return () => clearInterval(interval);
  }, [textVariations.length]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div
        style={{
          backgroundImage: `url(https://png.pngtree.com/thumb_back/fh260/background/20210129/pngtree-creative-blue-color-block-line-simple-background-image_550061.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="w-full md:w-1/2 text-white flex flex-col justify-center items-center p-8"
      >
        <img className="w-7 absolute left-8 top-6" src={logo} alt="logo" />
        <h1
          className="text-white text-4xl text-center font-bold mb-4 animate-slide"
          key={currentText}
        >
          {textVariations[currentText].title}
        </h1>
        <p
          className="text-base mt-4 text-white text-center animate-slide"
          key={`desc-${currentText}`}
        >
          {textVariations[currentText].description}
        </p>
      </div>

      <div className="w-full md:w-10/12 flex justify-center items-center p-8">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-gray-800">Login</h2>
          <p className="mb-6 font-normal text-base">
            Please enter your credentials to sign in!
          </p>
          <form method="post" onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your password"
              />
            </div>
            <div className="mb-6 flex justify-end">
              <p onClick={()=>navigate("/forgetpassword")} className="font-medium text-sm text-blue-500 underline hover:cursor-pointer active:text-blue-700">Forget Password?</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-300"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
          {error && error !== "No token found" && (
            <p className="text-red-600 text-center mt-4">{error}</p>
          )}

          <p className="text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
              className="text-blue-500 hover:underline"
            >
              Sign up
            </a>
          </p>
          <center>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/VolLogin");
              }}
              className=" text-blue-500  hover:underline"
            >
              Login As Volunteer
            </a>
          </center>
        </div>
      </div>
    </div>
  );
};

export default Login;
