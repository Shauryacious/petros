'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterLocation = () => {
    const router = useRouter(); // Use useRouter for navigation

    const [vehicleNumber, setVehicleNumber] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    
    const currency = "INR";
    const amount = 1500;

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

        if (name.trim() === '' || address.trim() === '' || phoneNumber.trim() === '') {
            setMessage("Please fill in all the fields.");
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

            var options = {
                "key": "rzp_test_TBBRXgPa4yzuqK", // Replace with your test key or live key
                amount: amount * 100,
                currency,
                "name": "Visiniyam",
                "description": "Test Transaction",
                "order_id": order.id,
                "handler": async function (response) {
                    const body = { ...response, name, address, phoneNumber, vehicleNumber };

                    const validateRes = await fetch("http://localhost:3001/api/v1/users/validation", {
                        method: "POST",
                        body: JSON.stringify(body),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (validateRes.ok) {
                        setMessage("Payment successful! Registering your information...");

                        // Sending data to /buy after payment success
                        const buyRes = await fetch("http://localhost:3001/api/v1/users/buy", {
                            method: "POST",
                            body: JSON.stringify({
                                name,
                                address,
                                phoneNumber,
                                vehicleNumber,
                                order_id: order.id,
                            }),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });

                        if (buyRes.ok) {
                            setMessage("Payment successful!, you will receive product soon.");
                        } else {
                            setMessage("Payment failed after payment.");
                        }
                    } else {
                        setMessage("Payment validation failed.");
                    }
                },
                "prefill": {
                    "name": name,
                    "email": "example@example.com",
                    "contact": phoneNumber,
                },
                "notes": {
                    "address": address
                },
                "theme": {
                    "color": "#3399cc"
                }
            };

            var razorpayInstance = new rzp1(options);
            razorpayInstance.on('payment.failed', function (response) {
                setMessage(`Payment failed: ${response.error.description}`);
            });
            razorpayInstance.open();
        } catch (error) {
            setMessage(`Payment error: ${error.message}`);
        }
    };

    return (
      <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
      <div className="relative z-10 p-8 bg-[#0d0d12] rounded-md shadow-lg w-full max-w-md border border-[#2a2a3d]">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-b from-neutral-300 to-neutral-500 mb-8">
          Order Details
        </h1>
        
        <form>
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
                required
              />
            </div>
    
            <div>
              <label className="block text-sm font-medium text-neutral-400">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#1b1b25] text-white border border-[#3a3a52] focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                required
              />
            </div>
    
            <div>
              <label className="block text-sm font-medium text-neutral-400">
                Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#1b1b25] text-white border border-[#3a3a52] focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                required
              />
            </div>
    
    
            <button
              type="submit"
              onClick={handlePayment}
              className="w-full h-12 mt-4 inline-flex items-center justify-center rounded-md border border-[#2a2a3d] bg-[linear-gradient(110deg,#0d0d12,45%,#1a1a22,55%,#0d0d12)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 hover:text-white"
            >
              Pay Rs.1500 and Order
            </button>
          </div>
        </form>
    
        {message && (
          <p className="text-center text-green-500 mt-4">{message}</p>
        )}
    
      </div>
    </div>
    
    );
};

export default RegisterLocation;
