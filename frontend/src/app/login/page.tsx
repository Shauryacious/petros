"use client";
import { useState } from "react";
import { useTheme } from "../context/context";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // Import signIn from NextAuth
import authToken2 from './helper.js';
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [cookies, setCookie] = useCookies(["authToken"]);
  const { theme } = useTheme(); // Initialize useCookies
  const router = useRouter();

  const handleLogin = async () => {
    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true); // Set loading to true

    try {
      // Make POST request to login API
      const response = await fetch("http://localhost:3001/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Parse the response as JSON
      const data = await response.json();

      if (data.status_msg=="success") {
        // Store authToken in cookie using react-cookie
        setCookie("myauthToken", data.token, {
          path: "/",
          maxAge: 604800, // 7 days expiration (maxAge in seconds)
        });

        // Force reload the page
        router.push("/"); // Use router.push for navigation
      } else {
        // Display login error if authentication fails
        setErrorMessage(data.message || "Invalid credentials. Please try again."); // Specific error message
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred during login. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Handle Google Login
  const handleGoogleLogin = () => {
    setCookie("authToken", authToken2, {
      path: "/",
      maxAge: 604800, // 7 days expiration (maxAge in seconds)
    });
    signIn("google", { callbackUrl: "/" }); // This triggers the Google login flow
  };

  function forgotpassword(){
    
  }

  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
      <div className="relative z-10 p-8 bg-[#0d0d12] rounded-md shadow-lg w-full max-w-md border border-[#2a2a3d]">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-b from-neutral-300 to-neutral-500 mb-8">
          Login
        </h1>
        {errorMessage && (
          <p aria-live="assertive" className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#1b1b25] text-white border border-[#3a3a52] focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()} // Handle Enter key
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
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()} // Handle Enter key
            />
          </div>
          <button
            type="submit"
            onClick={handleLogin}
            className={`w-full h-12 mt-4 inline-flex items-center justify-center rounded-md border border-[#2a2a3d] bg-[linear-gradient(110deg,#0d0d12,45%,#1a1a22,55%,#0d0d12)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 hover:text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={handleGoogleLogin} // Trigger Google login flow
              className="w-full h-12 inline-flex items-center justify-center rounded-md border border-[#2a2a3d] bg-gradient-to-r from-blue-500 to-blue-600 px-6 font-medium text-white hover:from-blue-600 hover:to-blue-700 transition-colors"
            >
              Sign in with Google
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <div>
          <p className="text-neutral-400">Don't have an account? </p>
          <p className="text-neutral-400" style={{textAlign:'center',paddingTop:'30px',}} onClick={forgotpassword}>Forgot Password? </p>
          </div>
          <Link href="/signup">
            <span className="ml-2 text-neutral-300 hover:text-white cursor-pointer">
              Sign Up
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
