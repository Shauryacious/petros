'use client';
import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PdfGenerator = (props) => {
  const { response } = props;
  const componentRef = useRef();
  console.log(response);

  // Check if response is valid and has the expected structure
  const isValidResponse = response && response.status === "success" && response.data && response.data.pythonOutput;

  // PDF generation function
  const handleGeneratePDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4"); // A4 size PDF in portrait mode
    const elements = componentRef.current.querySelectorAll(".pdf-page"); // Select all .pdf-page elements

    for (let i = 0; i < elements.length; i += 2) { // Increment by 2 for pairing images
      const canvas1 = await html2canvas(elements[i], { scale: 3 });
      const imgData1 = canvas1.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight1 = (canvas1.height * pdfWidth) / canvas1.width;

      // Add first image to the PDF
      pdf.addImage(imgData1, "PNG", 0, 10, pdfWidth, pdfHeight1);

      // Check if there's a second image
      if (i + 1 < elements.length) {
        const canvas2 = await html2canvas(elements[i + 1], { scale: 3 });
        const imgData2 = canvas2.toDataURL("image/png");
        const pdfHeight2 = (canvas2.height * pdfWidth) / canvas2.width;

        // Add second image to the same PDF page
        pdf.addImage(imgData2, "PNG", 0, pdfHeight1 + 15, pdfWidth, pdfHeight2); // Add some space between images
      }

      // Add new page if there's another image
      if (i + 2 < elements.length) pdf.addPage();
    }

    pdf.save("Python_Output_Report.pdf");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100" style={{marginTop:'100px',background:'black'}}>
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">PDF Generator</h1>

      {isValidResponse ? (
        <div ref={componentRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Python Output:</h2>

          {/* Display Annotated Image */}
          {response.data.pythonOutput.annotated_image && (
            <div className="pdf-page mb-6">
              <h3 className="text-xl font-medium mb-2 text-gray-600">Annotated Image</h3>
              <img
                src={`data:image/png;base64,${response.data.pythonOutput.annotated_image}`}
                alt="Annotated"
                className="mx-auto border border-gray-300 rounded-lg shadow-sm w-1/2 h-auto"
              />
            </div>
          )}

          {/* Display Bar Chart */}
          {response.data.pythonOutput.bar_chart && (
            <div className="pdf-page mb-6">
              <h3 className="text-xl font-medium mb-2 text-gray-600">Bar Chart</h3>
              <img
                src={`data:image/png;base64,${response.data.pythonOutput.bar_chart}`}
                alt="Bar Chart"
                className="mx-auto border border-gray-300 rounded-lg shadow-sm w-1/2 h-auto"
              />
            </div>
          )}

          {/* Display Segmented Image */}
          {response.data.pythonOutput.segmented_image && (
            <div className="pdf-page mb-6">
              <h3 className="text-xl font-medium mb-2 text-gray-600">Segmented Image</h3>
              <img
                src={`data:image/png;base64,${response.data.pythonOutput.segmented_image}`}
                alt="Segmented"
                className="mx-auto border border-gray-300 rounded-lg shadow-sm w-1/2 h-auto"
              />
            </div>
          )}

          {/* Display Number of Spots */}
          {response.data.pythonOutput.number_of_spots && (
            <div className="pdf-page mb-6">
              <h3 className="text-xl font-medium mb-2 text-gray-600">Number of Spots</h3>
              <p className="text-lg text-gray-600">{response.data.pythonOutput.number_of_spots}</p>
            </div>
          )}

          {/* Display Spot Detection Plot */}
          {response.data.pythonOutput.spot_detection_plot && (
            <div className="pdf-page mb-6">
              <h3 className="text-xl font-medium mb-2 text-gray-600">Spot Detection Plot</h3>
              <img
                src={`data:image/png;base64,${response.data.pythonOutput.spot_detection_plot}`}
                alt="Spot Detection Plot"
                className="mx-auto border border-gray-300 rounded-lg shadow-sm w-1/2 h-auto"
              />
            </div>
          )}

          {/* Display Spots Image */}
          {response.data.pythonOutput.spots_image && (
            <div className="pdf-page mb-6">
              <h3 className="text-xl font-medium mb-2 text-gray-600">Spots Image</h3>
              <img
                src={`data:image/png;base64,${response.data.pythonOutput.spots_image}`}
                alt="Spots"
                className="mx-auto border border-gray-300 rounded-lg shadow-sm w-1/2 h-auto"
              />
            </div>
          )}

          {/* Display Pie Chart */}
          {response.data.pythonOutput.pie_chart && (
            <div className="pdf-page mb-6">
              <h3 className="text-xl font-medium mb-2 text-gray-600">Pie Chart</h3>
              <img
                src={`data:image/png;base64,${response.data.pythonOutput.pie_chart}`}
                alt="Pie Chart"
                className="mx-auto border border-gray-300 rounded-lg shadow-sm w-1/2 h-auto"
              />
            </div>
          )}

          {/* Display Scatter Plot */}
          {response.data.pythonOutput.scatter_plot && (
            <div className="pdf-page mb-6">
              <h3 className="text-xl font-medium mb-2 text-gray-600">Scatter Plot</h3>
              <img
                src={`data:image/png;base64,${response.data.pythonOutput.scatter_plot}`}
                alt="Scatter Plot"
                className="mx-auto border border-gray-300 rounded-lg shadow-sm w-1/2 h-auto"
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
