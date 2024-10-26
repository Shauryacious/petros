'use client'
import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
export default function AboutPage() {
  return (
    <div>
        <Navbar />
    <div className="min-h-screen bg-mainBg flex flex-col items-center justify-center px-6" style={{marginTop:'150px',marginBottom:'50px'}}>
      <div className="max-w-2xl bg-secondaryBg p-8 rounded-md shadow-lg border border-borderPrimary">
        
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-b from-neutral-300 to-neutral-500 mb-6">
          About Our Project
        </h1>

        <p className="text-lg text-textMuted mb-4">
          Welcome to our rock classification and identification platform! We aim to assist geologists, researchers, and enthusiasts in identifying rock types quickly and accurately. This platform utilizes advanced machine learning algorithms to provide detailed classifications and generate downloadable reports in PDF format.
        </p>

        <h2 className="text-2xl font-semibold text-textPrimary mt-6 mb-2">Our Team</h2>
        <ul className="list-disc list-inside text-textMuted mb-4">
          <li>Arun Rathaur</li>
          <li>Shaurya</li>
          <li>Karan</li>
        </ul>

        <h2 className="text-2xl font-semibold text-textPrimary mt-6 mb-2">Achievements</h2>
        <p className="text-lg text-textMuted mb-4">
          Our team has proudly won three hackathons, where we showcased the potential and versatility of our rock classification tool. The project stands out as a powerful solution for real-world geology applications.
        </p>

        <h2 className="text-2xl font-semibold text-textPrimary mt-6 mb-2">Technology</h2>
        <p className="text-lg text-textMuted">
          Leveraging advanced machine learning techniques, our tool can identify a wide range of rock types with precision. The platform is built to ensure accurate and quick classification, backed by a robust ML model that continuously learns and improves.
        </p>
      </div>
    </div>
    <Footer />
    </div>
  )
}
