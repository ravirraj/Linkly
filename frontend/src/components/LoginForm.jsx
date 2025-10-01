import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "../utils/axiousInstance";
import { useSelector } from "react-redux";
import { setCredentials } from "@/store/slice/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "@tanstack/react-router";

export default function LoginForm({ state }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const auth = useSelector((state) => state.auth);
  console.log("Auth state:", auth);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      console.log("Logging in with", { email, password });
      // 👉 call your backend here
      const res = await api.post("/api/auth/login", { email, password });
      // console.log("Login successful:", res.data.data.user.username);
      dispatch(setCredentials({
        user: res.data.data.user,
        accessToken: res.data.accessToken,
      }));
      navigate({ to: "/dashboard" });
      // Alternative way without useDispatch

      // dispatch(setCredentials({

      // }));
      // Handle successful login (e.g., store token, redirect)
      setError("");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 px-4 w-full">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-gray-800 bg-gray-900">
        <CardHeader className="px-6">
          <CardTitle className="text-2xl font-semibold text-center text-white">
            🔐 Login
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 flex flex-col gap-4">
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
            onClick={handleLogin}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 w-full cursor-pointer h-11"
          >
            Login
          </Button>

          <p className="text-gray-400 text-sm text-center mt-2">
            Don’t have an account?{" "}
            <span onClick={() => state(false)} className="text-indigo-400 hover:underline cursor-pointer">
              Register
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
