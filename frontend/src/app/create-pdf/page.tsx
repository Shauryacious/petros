'use client';
import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PdfGenerator = (props) => {
  const { response } = props;
  const componentRef = useRef();

  // Check if response is valid and has the expected structure
  const isValidResponse = response && response.status === "success" && response.data;

  // PDF generation function
  const handleGeneratePDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4"); // A4 size PDF in portrait mode
    const elements = componentRef.current.querySelectorAll(".pdf-page");

    for (let i = 0; i < elements.length; i++) {
      const canvas = await html2canvas(elements[i], { scale: 3 });
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Add image to the PDF
      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);

      if (i + 1 < elements.length) pdf.addPage();
    }

    pdf.save("Rock_Sample_Analysis_Report.pdf");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100" style={{marginTop:'100px',background:'black'}}>
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">Rock Sample Analysis Report</h1>

      {isValidResponse ? (
        <div ref={componentRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl text-center">

          {/* Introduction */}
          <div className="pdf-page mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Introduction</h2>
            <p className="text-lg text-gray-600">
              This report presents the results of an automated rock sample analysis using image processing techniques and a YOLO model. The goal is to detect mineral regions, count spots (black circles), and provide detailed visual analytics, including a pie chart and scatter plot for spatial distribution and mineral composition.
            </p>
          </div>

          {/* Analyzed Image */}
          {response.data.pythonOutput.annotated_image && (
            <div className="pdf-page mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Analyzed Image</h2>
              <p className="text-lg text-gray-600">
                Below is the image that has been analyzed, annotated with detected mineral regions and boundaries. This serves as the foundation for the subsequent analysis.
              </p>
              <img
                src={`data:image/png;base64,${response.data.pythonOutput.annotated_image}`}
                alt="Annotated image"
                className="mx-auto border border-gray-300 rounded-lg shadow-sm w-1/2 h-auto"
              />
            </div>
          )}

          {/* Detected Spots */}
          {response.data.pythonOutput.spots_image && (
            <div className="pdf-page mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Detected Spots</h2>
              <p className="text-lg text-gray-600">
                The system has identified a number of spots (black circles) within the sample. These spots may represent distinct features or impurities. The image below highlights the detected spots.
              </p>
              <img
                src={`data:image/png;base64,${response.data.pythonOutput.spots_image}`}
                alt="Detected spots"
                className="mx-auto border border-gray-300 rounded-lg shadow-sm w-1/2 h-auto"
              />
              <p className="text-lg text-gray-600 mt-2">A total of {response.data.number_of_spots} spots were detected, as highlighted in the image.</p>
            </div>
          )}

          {/* Mineral Regions */}
          {response.data.pythonOutput.segmented_image && (
            <div className="pdf-page mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Mineral Regions</h2>
              <p className="text-lg text-gray-600">
                The image segmentation process has identified different mineral regions within the sample, and their boundaries have been outlined. Each region represents a unique mineral component in the rock, contributing to the overall composition.
              </p>
              <img
                src={`data:image/png;base64,${response.data.pythonOutput.segmented_image}`}
                alt="Segmented image"
                className="mx-auto border border-gray-300 rounded-lg shadow-sm w-1/2 h-auto"
              />
            </div>
          )}

          {/* Bar Chart */}
          {response.data.pythonOutput.bar_chart && (
            <div className="pdf-page mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Bar Chart: Percentage Area of Mineral Regions</h2>
              <p className="text-lg text-gray-600">
                The following bar chart presents the percentage area occupied by each detected mineral region. This provides a visual representation of the relative proportions of different minerals in the rock sample.
              </p>
              <img
                src={`data:image/png;base64,${response.data.pythonOutput.bar_chart}`}
                alt="Bar chart"
                className="mx-auto border border-gray-300 rounded-lg shadow-sm w-1/2 h-auto"
              />
            </div>
          )}

          {/* Pie Chart */}
          {response.data.pythonOutput.pie_chart && (
            <div className="pdf-page mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Pie Chart: Proportional Area Distribution</h2>
              <p className="text-lg text-gray-600">
                This pie chart visually breaks down the area percentages for each mineral region, offering a clear view of how much space each mineral takes up in the sample.
              </p>
              <img
                src={`data:image/png;base64,${response.data.pythonOutput.pie_chart}`}
                alt="Pie chart"
                className="mx-auto border border-gray-300 rounded-lg shadow-sm w-1/2 h-auto"
              />
            </div>
          )}

          {/* Scatter Plot */}
          {response.data.pythonOutput.scatter_plot && (
            <div className="pdf-page mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Scatter Plot: Contour Areas</h2>
              <p className="text-lg text-gray-600">
                The scatter plot below represents the size of the detected contours (mineral regions) in relation to their indices. This provides an overview of the distribution of areas across different regions.
              </p>
              <img
                src={`data:image/png;base64,${response.data.pythonOutput.scatter_plot}`}
                alt="Scatter plot"
                className="mx-auto border border-gray-300 rounded-lg shadow-sm w-1/2 h-auto"
              />
            </div>
          )}

          {/* Conclusion */}
          <div className="pdf-page mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Conclusion</h2>
            <p className="text-lg text-gray-600">
              The automated rock sample analysis has successfully identified and analyzed multiple mineral regions, providing detailed visual insights into their spatial distribution and area percentages. Additionally, {response.data.number_of_spots} spots were detected, which may warrant further investigation. The visualizations provided help in understanding the composition of the rock sample more clearly.
            </p>
          </div>
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
