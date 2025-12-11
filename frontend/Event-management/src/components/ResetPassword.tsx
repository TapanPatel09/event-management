/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { api } from "../Queries/Allquery";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); 

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${api}/user/resetpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage("Password reset successful! You can now log in.");
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
        {message && <p className="text-center text-red-500">{message}</p>}
        {token ? (
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="password"
              className="w-full p-3 border rounded-lg"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full p-3 border rounded-lg"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Reset Password
            </button>
          </form>
        ) : (
          <p className="text-center text-red-500">Invalid or expired token.</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
