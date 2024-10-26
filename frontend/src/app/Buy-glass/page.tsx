// components/ProductPage.tsx
'use client';
import Image from "next/image";
import { useEffect, useState } from "react"; // Import useState and useEffect
import { useRouter } from "next/navigation"; // Import useRouter
import Navbar from "@/components/Navbar";
import RegisterLocation from "../payment/page";
import Link from "next/link";
import image from 'model.jpg'
const ProductPage = () => {
  const router = useRouter(); // Use useRouter for navigation
  const [vehicleNumber, setVehicleNumber] = useState('1');
  const currency = "INR";
  const amount = 50;

  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    };
    
    loadRazorpayScript();
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (vehicleNumber.trim() === '') {
      alert("Please enter your vehicle number.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/v1/users/makerequest", {
        method: "POST",
        body: JSON.stringify({
          amount: amount * 100,
          currency,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const order = await response.json();
      const rzp1 = window.Razorpay;
      if (!rzp1) {
        alert("Razorpay script not loaded. Please try again.");
        return;
      }

      const options = {
        "key": "rzp_test_TBBRXgPa4yzuqK",
        amount: amount * 100,
        currency,
        "name": "Smart Parking System",
        "description": "Test Transaction",
        "order_id": order.id,
        "handler": async function (response) {
          const body = { ...response };

          const validateRes = await fetch("http://localhost:3001/api/v1/users/validation", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (validateRes.ok) {
            console.log("Payment successful");
          }
        },
        "prefill": {
          "name": "Piyush Lokhande",
          "email": "gaurav.kumar@example.com",
          "contact": "9000090000"
        },
        "notes": {
          "address": "Razorpay Corporate Office"
        },
        "theme": {
          "color": "#3399cc"
        }
      };

      const razorpayInstance = new rzp1(options);
      razorpayInstance.on('payment.failed', function (response) {
        alert(response.error.code);
        alert(response.error.description);
      });
      razorpayInstance.open();
    } catch (error) {
      console.error("Payment error:", error.message);
      alert(`Payment error: ${error.message}`);
    }
  };

  return (
    <div>
      <Navbar />
    <div className="flex flex-col items-center justify-center py-10" style={{ marginTop: '50px' }}>
      <div className="relative w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <Image
            src="/model.jpg"
            alt="Computer Vision Glass"
            width={500}
            height={500}
            className="rounded-md shadow-lg"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col space-y-4 mt-8 md:mt-0 p-6">
          <h1 className="text-4xl font-bold">Computer Vision Glass</h1>
          <h2 className="text-2xl">AI-Powered Glasses for the Blind</h2>
          <p className="text-lg">
            Empower individuals with vision impairments to perceive their surroundings using cutting-edge YOLO technology.
            Our Computer Vision Glass identifies objects in real-time and provides instant audio feedback through text-to-speech technology.
          </p>

          <div className="flex items-center space-x-4 mt-6">
           <Link href='/payment'><button className="inline-flex items-center justify-center rounded-md border bg-blue-600 text-white px-4 py-2 text-lg font-medium hover:bg-blue-700 transition-all">
              Buy Now
            </button></Link> 
            <a href="#details" className="inline-flex items-center justify-center text-blue-600 hover:underline">
              More Info
            </a>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div id="details" className="mt-20 w-full max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold">Product Details</h2>
        <p className="mt-4 text-lg">
          The Computer Vision Glass is designed to provide real-time visual assistance to the blind and visually impaired. By utilizing YOLO (You Only Look Once) technology, the glasses can recognize objects in the environment with high accuracy and speed. The data is then processed through a Python-based system to convert the visual information into speech. This information is relayed to the user via a compact speaker embedded in the glasses.
        </p>
        <h3 className="text-xl font-semibold mt-6">How It Works:</h3>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li>The glasses are equipped with a camera that captures the surroundings.</li>
          <li>YOLO identifies objects and their locations in real-time.</li>
          <li>The identified objects are converted into text via Python.</li>
          <li>The text is then spoken aloud to the user through a speaker, enabling them to understand their surroundings.</li>
        </ul>
      </div>

      {/* Pricing Section */}
      <div className="w-full max-w-7xl mx-auto py-12 mt-20 rounded-lg shadow-lg text-center">
        <h2 className="text-4xl font-bold">Affordable Pricing</h2>
        <p className="mt-4 text-lg">Experience the power of AI vision at an affordable price.</p>
        <div className="mt-6">
          <span className="text-5xl font-bold text-blue-600">₹1500</span>
        </div>
        <div className="mt-10">
         <Link href="/payment"><button 
            className="inline-flex items-center justify-center rounded-md border bg-blue-600 text-white px-6 py-3 text-lg font-medium hover:bg-blue-700 transition-all"  
           
          >
            Buy Now
          </button></Link> 
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProductPage;
