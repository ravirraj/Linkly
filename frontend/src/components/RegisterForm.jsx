import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "../utils/axiousInstance";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "@tanstack/react-router";
import { setCredentials } from "@/store/slice/authSlice";

export default function RegisterForm({ state }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const validateEmail = (email) => {
    // simple regex for email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const response = await api.post("api/auth/register", { username: name, email, password });
    

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      dispatch(setCredentials({ user: response.data.data.user, token: response.data.accessToken }));

      navigate({ to: "/dashboard" });
      setError("");

    } catch (err) {
      // console.error("Register error:", err.response.data.message || err.message);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 px-4 w-full">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-gray-800 bg-gray-900">
        <CardHeader className="px-6">
          <CardTitle className="text-2xl font-semibold text-center text-white">
            📝 Register
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-800 text-white placeholder-gray-400 h-11 border-gray-700"
          />

          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-800 text-white placeholder-gray-400 h-11 border-gray-700"
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-800 text-white placeholder-gray-400 h-11 border-gray-700"
          />

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <Button
            onClick={handleRegister}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 w-full cursor-pointer h-11"
          >
            Register
          </Button>

          <p className="text-gray-400 text-sm text-center mt-2">
            Already have an account?{" "}
            <span onClick={() => state(true)} className="text-indigo-400 hover:underline cursor-pointer">
              Login
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
