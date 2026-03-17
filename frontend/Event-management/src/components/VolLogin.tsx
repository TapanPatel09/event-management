import axios from "axios";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { api } from "../Queries/Allquery";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../Store/Reducers/AuthReducer";

export default function VolunteerLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    dispatch(loginStart());

    try {
      const res = await axios.post(`${api}/user/Vollogin`, {
        username,
        password,
      });

      if (res.data.token) {
        dispatch(loginSuccess({ token: res.data.token, user: res.data.volunteer }));
        navigate("/VolDashBoard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const message = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(message);
      dispatch(loginFailure(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-500 text-white flex items-center justify-center rounded-full text-2xl">
            <FaUser style={{ color: "white", fontSize: "24px" }} />
          </div>
        </div>
        <h2 className="text-center text-2xl font-semibold text-gray-700 mb-6">
          Volunteer Login
        </h2>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-200">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2  border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
              }`}
            style={{ marginTop: "40px" }}
          >
            <span>
              {loading ? (
                <p className="text-white">Loading...</p>
              ) : (
                <p className="text-white">Login</p>
              )}
            </span>
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Forgot password?{" "}
          <span
            onClick={() => navigate("/forgetpassword")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Reset here
          </span>
        </p>
      </div>
    </div>
  );
}
