'use client';
import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import MathJax from 'react-mathjax';

const PdfGenerator = (props) => {
  const { response } = props;
  const componentRef = useRef();

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
        className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100"
        style={{ marginTop: '100px', background: 'black', fontFamily: 'Poppins, sans-serif' }}
      >
        {/* Title for PDF */}
        <h1 className="text-3xl font-bold mb-6 text-indigo-600">Rock Sample Analysis Report</h1>

        {isValidResponse ? (
          <div ref={componentRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl text-center">
            {/* Introduction */}
            <div className="pdf-page mb-6">
              <h2 className="text-2xl font-bold underline mb-4 text-gray-700">Introduction</h2>
              <p className="text-lg text-gray-600">
                This report presents the results of an automated rock sample analysis using image processing techniques and a YOLO model. The goal is to detect mineral regions, count spots (black circles), and provide detailed visual analytics, including a pie chart and scatter plot for spatial distribution and mineral composition.
              </p>

              {response.data.pythonOutput.annotated_image && (
                <img
                  src={`data:image/png;base64,${response.data.pythonOutput.annotated_image}`}
                  alt="Annotated image"
                  className="mx-auto border border-gray-300 rounded-lg shadow-sm w-1/2 h-auto"
                />
              )}
              <div className="math-box">
                <MathJax.Provider>
                  <div className="text-lg text-gray-600 mt-4">
                    <MathJax.Node formula={"\\text{Sample Area} = \\int_{a}^{b} A(x) \\, dx"} />
                  </div>
                </MathJax.Provider>
              </div>
            </div>

            {/* Detected Spots */}
            {response.data.pythonOutput.spots_image && (
              <div className="pdf-page mb-6">
                <h2 className="text-2xl font-bold underline mb-4 text-gray-700">Detected Spots</h2>
                <p className="text-lg text-gray-600">
                  The system has identified a number of spots (black circles) within the sample. These spots may represent distinct features or impurities. The image below highlights the detected spots.
                </p>
                <img
                  src={`data:image/png;base64,${response.data.pythonOutput.spots_image}`}
                  alt="Detected spots"
                  className="mx-auto border border-gray-300 rounded-lg shadow-sm w-1/2 h-auto"
                />
                <p className="text-lg text-gray-600 mt-2">A total of {response.data.number_of_spots} spots were detected, as highlighted in the image.</p>
                <div className="math-box">
                  <MathJax.Provider>
                    <div className="text-lg text-gray-600 mt-4">
                      <MathJax.Node formula={"N_{spots} = \\sum_{i=1}^{n} 1_{i}"} />
                    </div>
                  </MathJax.Provider>
                </div>
              </div>
            )}

            {/* Mineral Regions */}
            {response.data.pythonOutput.segmented_image && (
              <div className="pdf-page mb-6">
                <h2 className="text-2xl font-bold underline mb-4 text-gray-700">Mineral Regions</h2>
                <p className="text-lg text-gray-600">
                  The image segmentation process has identified different mineral regions within the sample, and their boundaries have been outlined. Each region represents a unique mineral component in the rock, contributing to the overall composition.
                </p>
                <img
                  src={`data:image/png;base64,${response.data.pythonOutput.segmented_image}`}
                  alt="Segmented image"
                  className="mx-auto border border-gray-300 rounded-lg shadow-sm w-1/2 h-auto"
                />
                <div className="math-box">
                  <MathJax.Provider>
                    <div className="text-lg text-gray-600 mt-4">
                      <MathJax.Node formula={"A_{mineral} = \\int_{R} \\rho_{mineral}(x,y) \\, dx \\, dy"} />
                    </div>
                  </MathJax.Provider>
                </div>
              </div>
            )}

            {/* Bar Chart */}
            {response.data.pythonOutput.bar_chart && (
              <div className="pdf-page mb-6">
                <h2 className="text-2xl font-bold underline mb-4 text-gray-700">Bar Chart: Percentage Area of Mineral Regions</h2>
                <p className="text-lg text-gray-600">
                  The following bar chart presents the percentage area occupied by each detected mineral region. This provides a visual representation of the relative proportions of different minerals in the rock sample.
                </p>
                <img
                  src={`data:image/png;base64,${response.data.pythonOutput.bar_chart}`}
                  alt="Bar chart"
                  className="mx-auto border border-gray-300 rounded-lg shadow-sm w-1/2 h-auto"
                />
                <div className="math-box">
                  <MathJax.Provider>
                    <div className="text-lg text-gray-600 mt-4">
                      <MathJax.Node formula={"P_{mineral} = \\frac{A_{mineral}}{A_{total}} \\times 100\\%"} />
                    </div>
                  </MathJax.Provider>
                </div>
              </div>
            )}

            {/* Pie Chart */}
            {response.data.pythonOutput.pie_chart && (
              <div className="pdf-page mb-6">
                <h2 className="text-2xl font-bold underline mb-4 text-gray-700">Pie Chart: Proportional Area Distribution</h2>
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
                <h2 className="text-2xl font-bold underline mb-4 text-gray-700">Scatter Plot: Contour Areas</h2>
                <p className="text-lg text-gray-600">
                  The scatter plot below represents the size of the detected contours (mineral regions) in relation to their indices. This provides an overview of the distribution of areas across different regions.
                </p>
                <img
                  src={`data:image/png;base64,${response.data.pythonOutput.scatter_plot}`}
                  alt="Scatter plot"
                  className="mx-auto border border-gray-300 rounded-lg shadow-sm w-1/2 h-auto"
                />
                <div className="math-box">
                  <MathJax.Provider>
                    <div className="text-lg text-gray-600 mt-4">
                      <MathJax.Node formula={"A_{scatter} = \\frac{Area_{contour}}{n}"} />
                    </div>
                  </MathJax.Provider>
                </div>
              </div>
            )}

            {/* Conclusion */}
            <div className="pdf-page mb-6">
              <h2 className="text-2xl font-bold underline mb-4 text-gray-700">Conclusion</h2>
              <p className="text-lg text-gray-600">
                The automated rock sample analysis has successfully identified and analyzed multiple mineral regions, providing detailed visual insights into their spatial distribution and area percentages. Additionally, {response.data.number_of_spots} spots were detected, which may warrant further investigation. The visualizations provided help in understanding the composition of the rock sample more clearly.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-lg text-red-600">Invalid response data. Please try again later.</p>
        )}

        <button
          onClick={handleGeneratePDF}
          className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
        >
          Download PDF
        </button>
      </div>
    </>
  );
};

export default PdfGenerator;
