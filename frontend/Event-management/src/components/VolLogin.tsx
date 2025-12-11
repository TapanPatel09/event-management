import axios from "axios";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { api } from "../Queries/Allquery";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess } from "../Store/Reducers/AuthReducer";

export default function VolunteerLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    dispatch(loginStart());

    const res = await axios.post(`${api}/user/Vollogin`, {
      username,
      password,
    });

    dispatch(loginSuccess({ token: res.data.token, user: res.data.volunteer }));
    setLoading(false);
    if (res) {
      navigate("/VolDashBoard");
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
        <h2 className="text-center text-2xl font-semibold text-gray-700 mb-10">
          Volunteer Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
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
            className={`w-full py-2 rounded-lg text-white ${
              loading
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
          <a href="#" className="text-blue-600 hover:underline">
            Reset here
          </a>
        </p>
      </div>
    </div>
  );
}
