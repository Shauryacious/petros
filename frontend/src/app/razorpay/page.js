'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterLocation = () => {
    const router = useRouter(); // Use useRouter for navigation

    const [location, setLocation] = useState(null);
    const [vehicleNumber, setVehicleNumber] = useState('');

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

            var options = {
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

            var razorpayInstance = new rzp1(options);
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
        <div className='reg-location-con'>
            <div className='register-location'>
                <form>
                    <label htmlFor="vehicleNumber">Vehicle Number:</label>
                    <input
                        type="text"
                        id="vehicleNumber"
                        name="vehicleNumber"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        required
                    />
                    <button className='Payment-btn' type="submit" onClick={handlePayment}>Pay Rs.50 and Register</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterLocation;
