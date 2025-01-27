"use client";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PdfGenerator2 from '../create-pdf2/page';

const CreateUser = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [images, setImages] = useState([]); // Handle multiple images
    const [imagePreviews, setImagePreviews] = useState([]); // State for image previews
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('');
    const [responseData, setResponseData] = useState(null); // State for response data
    const [isPdfGenerated, setIsPdfGenerated] = useState(false); // State to track PDF generation
    const router = useRouter();

    // Check for authToken and redirect if not found
    useEffect(() => {
        const token = Cookies.get('authToken');
        const authTokenmain = Cookies.get('myauthToken');
        if (!token && !authTokenmain) {
            router.push('/'); // Navigate to the homepage
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('age', age);

        // Append all selected images to the FormData
        images.forEach((image) => {
            formData.append('images', image); // 'images' is the key for multiple files
        });

        try {
            const response = await fetch('http://localhost:3001/api/v1/users/create2', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setResponseData(data); // Store the response data
                setMessageColor('green'); // Set the message color to green for success
                setMessage('Analysis successfully!');

                // Set the flag to indicate that PDF can be generated
                setIsPdfGenerated(true);
            } else {
                setMessageColor('red'); // Set the message color to red for errors
                setMessage(data.message || 'Error occurred');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessageColor('red'); // Set the message color to red for errors
            setMessage('Error occurred');
        }
    };

    const handleImageChange = (e) => {
        const selectedImages = [...e.target.files];
        setImages(selectedImages); // Convert FileList to an array

        // Create image previews
        const previews = selectedImages.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews); // Set previews state
    };

    // Remove the message after 3 seconds
    useEffect(() => {
        if (message) {
            const timeout = setTimeout(() => {
                setMessage('');
            }, 3000); // 3 seconds

            return () => clearTimeout(timeout);
        }
    }, [message]);

    return (
        <div>
           
            <div>
                {/* Conditional Rendering */}
                {isPdfGenerated ? (
                    <PdfGenerator2 response={responseData} /> // Pass responseData as props
                ) : (
                    <>
                    <Navbar />
                    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
                        <div className="relative z-10 p-8 bg-[#0d0d12] rounded-md shadow-lg w-full max-w-md border border-[#2a2a3d]">
                            <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-b from-neutral-300 to-neutral-500 mb-8">
                                Identify your Rock
                            </h1>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange} // Update the handler for image change
                                    required
                                    multiple // Allow multiple file uploads
                                    name="images" // Set the name attribute to match your Multer configuration
                                    className="mt-1 block w-full p-2 border border-[#3a3a52] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                                />

                                {/* Display Image Previews */}
                                <div className="flex flex-wrap mt-4">
                                    {imagePreviews.map((preview, index) => (
                                        <img 
                                            key={index} 
                                            src={preview} 
                                            alt={`Preview ${index}`} 
                                            className="w-20 h-20 object-cover rounded-md mr-2 mb-2"
                                        />
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-12 inline-flex items-center justify-center rounded-md border border-[#2a2a3d] bg-[linear-gradient(110deg,#0d0d12,45%,#1a1a22,55%,#0d0d12)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors hover:text-white"
                                >
                                    Upload Data
                                </button>
                            </form>

                            {message && (
                                <p className={`mt-4 text-center text-${messageColor}-500`}>{message}</p>
                            )}
                        </div>
                    </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreateUser;
