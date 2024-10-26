"use client";

import React, { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Optional: Reset form after submission
    // setFormData({ name: '', phone: '', email: '', address: '' });
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-black">
      <div className="relative z-10 p-8 bg-[#0d0d12] rounded-md shadow-lg w-full max-w-md border border-[#2a2a3d]">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-b from-neutral-300 to-neutral-500 mb-8">
          Contact Us
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-neutral-400"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#1b1b25] text-white border border-[#3a3a52] focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-neutral-400"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#1b1b25] text-white border border-[#3a3a52] focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-400"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#1b1b25] text-white border border-[#3a3a52] focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-neutral-400"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#1b1b25] text-white border border-[#3a3a52] focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            />
          </div>
          <button
            type="submit"
            className="w-full h-12 mt-4 inline-flex items-center justify-center rounded-md border border-[#2a2a3d] bg-[linear-gradient(110deg,#0d0d12,45%,#1a1a22,55%,#0d0d12)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 hover:text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
