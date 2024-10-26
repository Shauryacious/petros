'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // For client-side routing
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import logo from '../logo-removebg-preview.png';

export default function Navbar1() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if user is logged in
  const router = useRouter(); // Initialize router for redirection

  // Check for authToken in cookies when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') { // Make sure to run only on the client-side
      const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [name, value] = cookie.split("=");
        acc[name] = value;
        return acc;
      }, {});
      if (cookies.authToken) {
        setIsLoggedIn(true); // Set user as logged in if authToken exists
      }
    }
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    // Delete the authToken from cookies
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false); // Update state
    router.push("/"); // Redirect to home page
  };

  return (
    <div className="text-white">
      <Navbar className="p-4">
        <NavbarBrand>
          <Link href="/">
            <p className="font-bold text-inherit">
              <Image src={logo} alt="logo" style={{ paddingRight: "100px" }} />
            </p>
          </Link>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link
              href="#"
              className="text-white hover:text-blue-500 transition-colors duration-300"
            >
              Features
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              href="#"
              className="text-white hover:text-blue-500 transition-colors duration-300"
            >
              Customers
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              href="#"
              className="text-white hover:text-blue-500 transition-colors duration-300"
            >
              Integrations
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              href="/form"
              className="text-white hover:text-blue-500 transition-colors duration-300"
            >
              Predicting Form
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          {isLoggedIn ? (
            // Render Logout button if logged in
            <NavbarItem>
              <Button
                color="primary"
                onClick={handleLogout}
                variant="flat"
                className="hover:bg-red-600 transition-colors duration-300"
              >
                Logout
              </Button>
            </NavbarItem>
          ) : (
            // Render Login and Sign Up buttons if not logged in
            <>
              <NavbarItem>
                <Link
                  href="/login"
                  className="text-white hover:text-blue-500 transition-colors duration-300"
                >
                  Login
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link href="/signup">
                  <Button
                    color="primary"
                    variant="flat"
                    className="hover:bg-blue-600 transition-colors duration-300"
                  >
                    Sign Up
                  </Button>
                </Link>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
      </Navbar>
    </div>
  );
}
