import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../Queries/Allquery";
import { Toast } from "primereact/toast";

interface FormData {
  username: string;
  email: string;
  password: string;
}

const RegisterForm: React.FC = () => {
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    if (!formData.username) errors.username = "Username is required.";
    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid.";
    }
    if (!formData.password) errors.password = "Password is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await axios.post(`${api}/user/register`, formData);
        if (res.status === 200) {
          toast.current?.show({severity:'success', summary: 'Success', detail:'Successfully registered', life: 3000});
          console.log("Successfully registered!");
          navigate("/");
        }
      } catch (error) {
        toast.current?.show({severity:'error', summary: 'Error', detail:`${error}`, life: 3000});
        console.error("Error registering user:", error);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Left Section */}
      <div
        style={{ backgroundColor: "#1C3B62" }}
        className="hidden md:flex flex-col justify-center items-center w-full md:w-1/2  text-white p-10"
      >
        <h1 className="text-white text-4xl font-bold mb-4">
          Welcome to <span className="text-yellow-300">EaseEvents</span>
        </h1>
        <p className="text-base mt-4 text-white">
          Create, manage, and celebrate your
          <span className="text-yellow-300"> events effortlessly.</span>
          <br /> <span className="text-yellow-300">Join us today</span> and make{" "}
          <span className="text-yellow-300">every moment memorable.</span>
        </p>
      </div>

      {/* Right Section */}
      <div className="flex justify-center items-center w-full md:w-1/2 bg-white p-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
            Register
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`mt-1 p-2 block w-full rounded-md border ${
                  formErrors.username ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter your username"
              />
              {formErrors.username && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 p-2 block w-full rounded-md border ${
                  formErrors.email ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter your email"
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 p-2 block w-full rounded-md border ${
                  formErrors.password ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter your password"
              />
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.password}
                </p>
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Register
              </button>
            </div>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <a
              onClick={() => {
                navigate("/login");
              }}
              className="text-indigo-500 hover:underline"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
