'use client';
import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PdfGenerator = (props) => {
  const { response } = props;
  const componentRef = useRef();

  // Check if response is valid and has the expected structure
  const isValidResponse = response && response.status === "success" && response.data && response.data.pythonOutput;

  // PDF generation function
  const handleGeneratePDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4"); // A4 size PDF in portrait mode
    const canvas = await html2canvas(componentRef.current, { scale: 3 }); // Scale to improve quality

    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let yOffset = 0; // Vertical offset for multiple pages
    if (pdfHeight > pdf.internal.pageSize.getHeight()) {
      // Split the image into multiple pages if it exceeds the page height
      while (yOffset < canvas.height) {
        pdf.addImage(imgData, "PNG", 0, yOffset ? 0 : 10, pdfWidth, pdfHeight);
        yOffset += pdf.internal.pageSize.getHeight();
        if (yOffset < canvas.height) pdf.addPage();
      }
    } else {
      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight); // Centered on page
    }
    pdf.save("Python_Output_Report.pdf");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">PDF Generator</h1>

      {isValidResponse ? (
        <div ref={componentRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Python Output:</h2>
          
          {/* Display Annotated Image */}
          {response.data.pythonOutput.annotated_image && (
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2 text-gray-600">Annotated Image</h3>
              <img
                src={`data:image/png;base64,${response.data.pythonOutput.annotated_image}`}
                alt="Annotated"
                className="mx-auto border border-gray-300 rounded-lg shadow-sm"
              />
            </div>
          )}

          {/* Display Segmented Image */}
          {response.data.pythonOutput.segmented_image && (
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2 text-gray-600">Segmented Image</h3>
              <img
                src={`data:image/png;base64,${response.data.pythonOutput.segmented_image}`}
                alt="Segmented"
                className="mx-auto border border-gray-300 rounded-lg shadow-sm"
              />
            </div>
          )}

          {/* Display Bar Chart */}
          {response.data.pythonOutput.bar_chart && (
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2 text-gray-600">Bar Chart</h3>
              <img
                src={`data:image/png;base64,${response.data.pythonOutput.bar_chart}`}
                alt="Bar Chart"
                className="mx-auto border border-gray-300 rounded-lg shadow-sm"
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-red-600 font-medium mt-4">No valid data available to display.</p>
      )}

      {/* PDF Generate Button */}
      <button
        onClick={handleGeneratePDF}
        className="mt-8 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
      >
        Generate PDF
      </button>
    </div>
  );
};

export default PdfGenerator;
