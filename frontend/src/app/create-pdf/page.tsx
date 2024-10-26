"use client";
import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import * as XLSX from "xlsx";

const PdfGenerator = () => {
  const contentRef = useRef();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [tableData, setTableData] = useState(
    Array.from({ length: 5 }, (_, rowIndex) =>
      Array.from({ length: 5 }, (_, colIndex) => `Item ${rowIndex + 1}-${colIndex + 1}`)
    )
  );

  // Static data points for the line chart
  const lineChartData = [
    { x: 1, y: 10 },
    { x: 2, y: 15 },
    { x: 3, y: 13 },
    { x: 4, y: 20 },
    { x: 5, y: 18 },
  ];

  // Data for the pie chart
  const pieData = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];

  const generatePdf = async () => {
    setIsGeneratingPdf(true); // Start PDF generation
    const doc = new jsPDF("p", "pt", "a4");

    // Add HTML content to PDF
    await html2canvas(contentRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 0, 0, 600, 600); // Adjust positioning and size as needed
      doc.save("generated.pdf");
      setIsGeneratingPdf(false); // Reset PDF generation state
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Convert the JSON data to the desired format for the table
      const formattedData = jsonData.map((row) => row.map((item) => item || ""));
      setTableData(formattedData);
    };

    reader.readAsBinaryString(file);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet(tableData);
    const chartData = lineChartData.map(({ x, y }) => ({ X: x, Y: y }));
    const pieChartData = pieData.map(({ name, value }) => ({ Name: name, Value: value }));
    
    // Combine the data into a single sheet
    const combinedData = [
      ["Table Data"],
      ...tableData,
      [],
      ["Line Chart Data"],
      ["X", "Y"],
      ...chartData.map(item => [item.X, item.Y]),
      [],
      ["Pie Chart Data"],
      ["Name", "Value"],
      ...pieChartData.map(item => [item.Name, item.Value]),
    ];

    const combinedWorksheet = XLSX.utils.aoa_to_sheet(combinedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, combinedWorksheet, "Data");

    // Export the workbook
    XLSX.writeFile(workbook, "data.xlsx");
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={contentRef}
        className="p-6 bg-white shadow-md rounded-lg w-full max-w-3xl text-black"
      >
        <div>
          <h1 className="text-4xl font-bold mb-4">Your Content Title</h1>
          <p className="mb-2">This is the content that will appear in the PDF.</p>
          <p className="mb-4">Add more content here as needed.</p>
          <img src='C:\Users\iampe\Desktop\logg.png' alt='logo' />
        </div>

        <div className="max-w-full overflow-x-auto mb-4">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                {tableData[0]?.map((_, index) => (
                  <th key={index} className="border border-gray-300 p-2 bg-gray-100 text-left">
                    Header {index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((item, colIndex) => (
                    <td key={colIndex} className="border border-gray-300 p-2 text-center">{item}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mb-4">
          <div className="max-w-full mx-auto">
            <LineChart ref={contentRef} width={300} height={300} data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" title="X Axis" />
              <YAxis title="Y Axis" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y" stroke="rgba(75,192,192,1)" />
            </LineChart>
          </div>

          <div className="max-w-full mx-auto">
            <PieChart width={300} height={300}>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${(index * 60) % 360}, 70%, 50%)`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-2xl font-semibold mb-2">Additional Content</h2>
          <p>This is some extra information that can be included at the bottom of the PDF.</p>
          <p>You can customize this section with any relevant content or descriptions.</p>
        </div>
      </div>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={generatePdf}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
        >
          Generate PDF
        </button>
        <button
          onClick={downloadExcel}
          className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
        >
          Download Excel
        </button>
      </div>
    </div>
  );
};

export default PdfGenerator;
