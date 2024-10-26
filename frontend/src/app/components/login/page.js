'use client';
import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation"; // For navigation
import { useCookies } from 'react-cookie'; // For managing cookies

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState(""); // To display login error
  const router = useRouter(); // Next.js router for navigation
  const [cookies, setCookie] = useCookies(['authToken']); // Using react-cookie to manage cookies

  // Function to handle login button click
  const handleLogin = async () => {
    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    // Clear error if email is valid
    setEmailError("");
    setLoginError(""); // Reset login error on new attempt

    try {
      // Make POST request to login API
      const response = await fetch("http://localhost:3002/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Parse the response as JSON
      const data = await response.json();

      if (data.success) {
        // Store authToken in cookie using react-cookie
        setCookie('authToken', data.authToken, { path: '/', maxAge: 604800 }); // 7 days expiration (maxAge in seconds)
        
        // Force reload the page
        window.location.href = "/form"; // Use window.location.href to trigger a full reload
      } else {
        // Display login error if authentication fails
        setLoginError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-sm p-6 rounded-lg shadow-lg bg-white bg-opacity-50 backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Login</h2>

        {/* Email Input */}
        <label className="block mb-2 text-gray-700 font-semibold">Email</label>
        <Input
          clearable
          placeholder="Enter your email"
          fullWidth
          className="mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        {/* Error message for email */}
        {emailError && <p className="text-red-500 text-sm mb-4">{emailError}</p>}
        
        {/* Password Input */}
        <label className="block mb-2 text-gray-700 font-semibold">Password</label>
        <Input
          clearable
          placeholder="Enter your password"
          type="password"
          fullWidth
          className="mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {/* Error message for login */}
        {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}

        {/* Login Button */}
        <Button color="primary" size="lg" fullWidth onClick={handleLogin}>
          Login
        </Button>
      </div>
    </div>
  );
}
