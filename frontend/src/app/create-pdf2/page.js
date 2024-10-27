'use client';
import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import MathJax from 'react-mathjax';

const PdfGenerator2 = (props) => {
  const { response } = props;
  const componentRef = useRef();
  console.log(response);
  const isValidResponse = response && response.status === "success" && response.data;

  const handleGeneratePDF = () => {
    const options = {
      margin: 10,
      filename: 'Rock_Sample_Analysis_Report.pdf',
      image: { type: 'png', quality: 0.98 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().set(options).from(componentRef.current).save();
  };

  

  return (
    <>
      {/* Importing Poppins font */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');`}
      </style>

      <div
        className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50"
        style={{  fontFamily: 'Poppins, sans-serif' }}
      >
        {isValidResponse ? (
          <div ref={componentRef} className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl text-center space-y-10">
            {/* Title for PDF inside the page */}
            <h1 className="text-4xl font-bold mb-10 text-blue-500">Rock Sample Analysis Report</h1>

            {/* Introduction */}
            {/* Introduction */}
            <div className="pdf-page mb-10">
              <h2 className="text-3xl font-semibold underline mb-6 text-gray-700">Introduction</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                This <span className="font-semibold">Rock Sample Analysis Report</span> presents a comprehensive
                examination of mineral <span className="italic">distribution</span> and <span className="italic">composition</span>
                using image processing techniques. The analysis utilizes <span className="font-semibold">YOLO models </span>
                 to segment mineral regions, quantify feature density through black spot (circle) detection, and provide detailed
                visual insights. A pie chart and scatter plot further reveal mineral composition and spatial distribution,
                forming the basis for advanced geological assessments.
              </p>

              {/* Identified and Confidence Values Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center">
                
                    
                  <span className="text-lg font-medium text-gray-800">Identified as: <span className='font-semibold'>{response.data.extractedValue}</span> </span>
                </div>
              </div>

              {response.data.pythonOutput.annotated_image && (
                <figure className="border border-gray-200 rounded-lg shadow-md p-5">
                  <img
                    src={`data:image/png;base64,${response.data.pythonOutput.annotated_image}`}
                    alt="Annotated image"
                    className="mx-auto w-3/4 h-auto"
                  />
                  <figcaption className="text-md font-medium text-gray-600 mt-4">Figure 1: Annotated Rock Sample Image</figcaption>
                </figure>
              )}

              <div className="math-box mt-6">
                <MathJax.Provider>
                  <div className="text-lg text-gray-700">
                    <MathJax.Node formula={"\\text{Sample Area} = \\int_{a}^{b} A(x) \\, dx"} />
                  </div>
                </MathJax.Provider>
              </div>
            </div>


            {/* Conclusion */}
            <div className="pdf-page mb-10">
              <h2 className="text-3xl font-semibold underline mb-6 text-gray-700">Conclusion</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                This analysis provides an in-depth evaluation of mineral regions and compositional ratios, revealing critical 
                insights into the rock's geological makeup. Identified spots represent localized mineral variations, suggesting 
                potential structural irregularities that warrant further study.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-lg text-red-600">Invalid response data. Please try again later.</p>
        )}

        <button
          onClick={handleGeneratePDF}
          className="mt-8 bg-blue-500 text-white py-2 px-5 rounded hover:bg-blue-600 transition duration-300"
        >
          Download PDF
        </button>
      </div>
    </>
  );
};

export default PdfGenerator2;
