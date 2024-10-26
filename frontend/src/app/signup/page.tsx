"use client";
import { useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useCookies } from "react-cookie"; // Import js-cookie
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import authToken2 from '../login/helper.js';
function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["authToken"]);


  // Handle Google Login
  const handleGoogleLogin = () => {
    setCookie("authToken", authToken2, {
      path: "/",
      maxAge: 604800, // 7 days expiration (maxAge in seconds)
    });
    signIn("google", { callbackUrl: "/" }); // This triggers the Google login flow
  };



  const handleSignup = async () => {
    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (name.trim() === "") {
      setErrorMessage("Please enter your name.");
      return;
    }

    // Password validation: length should be at least 8 characters
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    // Confirm password validation: passwords should match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      // Make POST request to signup API
      const response = await fetch("http://localhost:3001/api/v1/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          passwordConfirm: confirmPassword,
        }),
      });

      const data = await response.json();
      console.log("Signup response:", data);
      if (data.status === "success") {
        // Store authToken in cookie if returned
        if (data.jwt_token) {
          Cookies.set("myauthToken", data.jwt_token, { expires: 7 }); // 7 days
        }

        // Redirect to /form page
        router.push("/");
      } else {
        setErrorMessage("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("An error occurred during signup. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
      <div className="relative z-10 p-8 bg-[#0d0d12] rounded-md shadow-lg w-full max-w-md border border-[#2a2a3d]">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-b from-neutral-300 to-neutral-500 mb-8">
          Sign Up
        </h1>
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-400">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#1b1b25] text-white border border-[#3a3a52] focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#1b1b25] text-white border border-[#3a3a52] focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#1b1b25] text-white border border-[#3a3a52] focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#1b1b25] text-white border border-[#3a3a52] focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            />
          </div>
          <button
            type="submit"
            onClick={handleSignup}
            className="w-full h-12 mt-4 inline-flex items-center justify-center rounded-md border border-[#2a2a3d] bg-[linear-gradient(110deg,#0d0d12,45%,#1a1a22,55%,#0d0d12)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 hover:text-white"
          >
            Sign Up
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={handleGoogleLogin} // Trigger Google login flow
              className="w-full h-12 inline-flex items-center justify-center rounded-md border border-[#2a2a3d] bg-gradient-to-r from-blue-500 to-blue-600 px-6 font-medium text-white hover:from-blue-600 hover:to-blue-700 transition-colors"
            >
              Sign up with Google
            </button>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <p className="text-neutral-400">Already have an account? </p>
          <Link href="/login">
            <span className="ml-2 text-neutral-300 hover:text-white cursor-pointer">
              Login
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
