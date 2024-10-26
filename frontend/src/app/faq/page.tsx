'use client'; // Ensure the component is client-side
import Navbar from '@/components/Navbar';
import React, { useState } from 'react';

const FAQPage = () => {
    // State to manage open questions
    const [openIndex, setOpenIndex] = useState(null);

    // Sample FAQ data
    const faqs = [
        {
            question: 'What types of rocks can your system classify?',
            answer: 'Our system can classify various types of rocks, including igneous, sedimentary, and metamorphic rocks, using advanced machine learning algorithms and image recognition techniques.'
        },
        {
            question: 'How accurate is the rock classification?',
            answer: 'The accuracy of our rock classification system is continually improving and currently exceeds 90% in identifying common rock types, thanks to our robust training datasets and algorithms.'
        },
        {
            question: 'What image formats are supported for rock identification?',
            answer: 'We support various image formats, including JPEG, PNG, and BMP. Users can upload images directly from their devices for analysis.'
        },
        {
            question: 'How does the machine learning model learn to classify rocks?',
            answer: 'Our machine learning model is trained on a large dataset of labeled rock images. It learns to recognize patterns and features that distinguish different rock types through supervised learning techniques.'
        },
        {
            question: 'Can I contribute images for training the model?',
            answer: 'Yes! We encourage users to contribute images of rocks they encounter. These images can help improve the models accuracy and expand its classification capabilities.'
        },
        {
            question: 'Is there a mobile app for rock classification?',
            answer: 'Currently, we offer a web-based platform. However, we are exploring the development of a mobile app for easier access and identification on the go.'
        },
        {
            question: 'What should I do if the classification seems incorrect?',
            answer: 'If you believe the classification is incorrect, please provide feedback through our platform. Your input helps us refine our algorithms and improve accuracy.'
        },
        {
            question: 'Are there any prerequisites for using the classification system?',
            answer: 'No prerequisites are necessary! Simply upload an image of the rock you wish to classify, and our system will provide results and insights based on the analysis.'
        }
    ];
    
    // Toggle function for opening/closing questions
    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div>
            <Navbar />
        <div className="max-w-2xl mx-auto p-4" style={{paddingTop:'150px'}}>
            <h1 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border rounded-lg shadow-md overflow-hidden">
                        <div
                            className="flex justify-between items-center p-4 cursor-pointer "
                            onClick={() => toggleFAQ(index)}
                        >
                            <h2 className="text-lg font-semibold">{faq.question}</h2>
                            <span className="text-xl">{openIndex === index ? '-' : '+'}</span>
                        </div>
                        {openIndex === index && (
                            <div className="p-4 ">
                                <p>{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default FAQPage;
