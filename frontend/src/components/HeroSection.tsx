"use client";
import { useState, useEffect } from "react";
import { signOut, signIn, useSession } from "next-auth/react";
import Cookies from "js-cookie";
import Link from "next/link";
import {
  FaDiscord,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaSignOutAlt,
  FaGoogle,
} from "react-icons/fa";
import { BackgroundBeams } from "./ui/background-beams";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import { useCookies } from "react-cookie";
import Model from "@/app/spline/page";
import DownloadComponent from "./ui/download-component";
import "./styles.css";

const socialMediaLinks = [
  { href: "https://www.facebook.com", icon: <FaFacebook size={24} /> },
  { href: "https://www.twitter.com", icon: <FaTwitter size={24} /> },
  { href: "https://www.instagram.com", icon: <FaInstagram size={24} /> },
  { href: "https://www.discord.com", icon: <FaDiscord size={24} /> },
];

const mainButtons = [
  { href: "/uploadData", text: "Add Person", icon: <FaArrowRight size={16} /> },
  { href: "/dashboard", text: "Dashboard", icon: <FaArrowRight size={16} /> },
];

function HeroSection() {
  const { data: session, status } = useSession();
  const [cookies, setCookie, removeCookie] = useCookies(["authToken"]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null); // State to hold token

  useEffect(() => {
    // This will run only on the client-side
    const authToken = Cookies.get("myauthToken");
    setToken(authToken); // Update state with the token
    setIsAuthenticated(status === "authenticated" || !!authToken); // Update authenticated state
  }, [status]);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
    // Remove the auth token cookie if needed
    removeCookie("authToken", { path: "/" });
    Cookies.remove("myauthToken");
  };

  const handleGoogleSignIn = () => {
    signIn("google");
  };

  return (
    <div className="h-auto md:h-[50rem] w-full rounded-md flex flex-col items-center justify-center relative overflow-hidden mx-auto py-10 md:py-0">
      <div
        className="absolute top-0 left-0 w-full h-full z-0"
        style={{ position: "relative", left: "450px", top: "100px" }}
      >
        <Model />
      </div>
      <div className="absolute top-11 left-10 z-20">
        <Link href="/">
          <Image src="/logo2.png" alt="Left Image" width={150} height={150} />
        </Link>
      </div>
      <div className="absolute bottom-10 left-12 z-20 flex flex-col space-y-4">
        <div
          style={{
            borderTop: "40px solid grey",
            width: "5px",
            height: "40px",
            marginLeft: "8px",
          }}
        />
        {socialMediaLinks.map((link, index) => (
          <Link key={index} href={link.href} target="_blank">
            <div className="text-neutral-300 hover:text-white">{link.icon}</div>
          </Link>
        ))}
      </div>
      <div className="absolute top-12 right-12 z-20 flex space-x-4 items-center">
        {isAuthenticated ? ( // Check if authenticated
          <>
            {session &&
              session.user.image && ( // Check if image is available
                <Image
                  src={session.user.image}
                  alt="Profile Picture"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
            <button
              onClick={handleLogout}
              className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-300 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors px-4 font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              Logout <FaSignOutAlt className="ml-2" />
            </button>
          </>
        ) : (
          // If not authenticated
          <>
            {token ? ( // Check if token exists
              <button
                onClick={handleLogout}
                className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-300 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors px-4 font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              >
                Logout
              </button>
            ) : (
              // If neither session nor token is present
              <span>
                <Link href={"/login"} style={{ paddingRight: "50px" }}>
                  <button className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-300 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors px-4 font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    Login
                  </button>
                </Link>
                <Link href={"/signup"}>
                  <button className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-300 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors px-4 font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    Signup
                  </button>
                </Link>
              </span>
            )}
          </>
        )}
      </div>
      <div className="pl-12 pt-7 mt-10">
        <div
          className="p-4 relative z-10 text-center"
          style={{ position: "absolute", top: "-50px", left: "150px" }}
        >
          <h1 className="mt-60 mb-5 md:mt-60 text-2xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Welcome to
          </h1>
          <h1 className=" p-3 mt-20 md:mt-0 text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Petros
          </h1>
          <h1 className=" font-normal text-base md:text-lg text-neutral-300 max-w-lg mx-auto">
          Analyze. Classify. Report.
          </h1>
          <h1 className="mt-4 font-normal text-base md:text-2xl text-neutral-300 mx-auto">
            <b>RockScope: Precision Analysis for Rock Classification.</b>
          </h1>
          <h3>Analyze, Classify, and Report Rock Samples with Advanced Image & Video Processing</h3>
          {/* <div className="mb-4 mt-14 p-4 align-middle">
          {mainButtons.map((button, index) => (
            <Link key={index} className="m-4" href={button.href}>
              <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <span>{button.text}</span>
                <span className="ml-2">{button.icon}</span>
              </button>
            </Link>
          ))}
        </div> */}
         <a href="/uploadData" >
          <div style={{ display: "flex", justifyContent: "center" }}>

           
            <button
              type="button"
              className="homebutton"
              style={{ marginTop: "40px" }}
            >
              <DownloadComponent />
            </button>
          </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
