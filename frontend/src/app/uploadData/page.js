"use client";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PdfGenerator from '../create-pdf/page';

const CreateUser = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [isPdfGenerated, setIsPdfGenerated] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('authToken');
        const authTokenmain = Cookies.get('myauthToken');
        if (!token && !authTokenmain) {
            router.push('/');
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading to true

        const formData = new FormData();
        formData.append('name', name);
        formData.append('age', age);

        images.forEach((image) => {
            formData.append('images', image);
        });

        try {
            const response = await fetch('http://localhost:3001/api/v1/users/create', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setResponseData(data);
                setMessageColor('green');
                setMessage('Analysis successfully!');
                setIsPdfGenerated(true);
            } else {
                setMessageColor('red');
                setMessage(data.message || 'Error occurred');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessageColor('red');
            setMessage('Error occurred');
        } finally {
            setIsLoading(false); // Set loading to false after response
        }
    };

    const handleImageChange = (e) => {
        const selectedImages = [...e.target.files];
        setImages(selectedImages);

        const previews = selectedImages.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    useEffect(() => {
        if (message) {
            const timeout = setTimeout(() => {
                setMessage('');
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [message]);

    return (
        <div>
            <div>
                {isPdfGenerated ? (
                    <PdfGenerator response={responseData} />
                ) : (
                    <>
                    <Navbar />
                    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
                        <div className="relative z-10 p-8 bg-[#0d0d12] rounded-md shadow-lg w-full max-w-md border border-[#2a2a3d]">
                            <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-b from-neutral-300 to-neutral-500 mb-8">
                                Analyze Rock
                            </h1>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    required
                                    multiple
                                    name="images"
                                    className="mt-1 block w-full p-2 border border-[#3a3a52] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                                />

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
                                    disabled={isLoading} // Disable button during loading
                                >
                                    {isLoading ? 'Uploading...' : 'Upload Data'} {/* Show loading text */}
                                </button>
                            </form>

                            {isLoading && (
                                <div className="flex justify-center mt-4">
                                    {/* Add a simple loading spinner */}
                                    <div className="loader border-t-4 border-blue-600 rounded-full w-6 h-6 animate-spin"></div>
                                </div>
                            )}

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
