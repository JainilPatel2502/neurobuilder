// import React, { useState } from "react";
// import Papa from "papaparse";
// // import CSVEditor from "./test";

// const CSVEditor = () => {
//   const [data, setData] = useState([]);
//   const [headers, setHeaders] = useState([]);
//   const [originalData, setOriginalData] = useState([]); // To reset data

//   // Handle File Upload
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       Papa.parse(file, {
//         complete: (result) => {
//           if (result.data.length > 1) {
//             setHeaders(result.data[0]); // Set headers
//             const slicedData = result.data.slice(1, 21); // Get first 20 rows (excluding header)
//             setData(slicedData);
//             setOriginalData(slicedData); // Store original data for reset
//           }
//         },
//         header: false,
//       });
//     }
//   };

//   // Sort Column
//   const handleSort = (colIndex, order) => {
//     const sortedData = [...data].sort((a, b) => {
//       if (a[colIndex] < b[colIndex]) return order === "asc" ? -1 : 1;
//       if (a[colIndex] > b[colIndex]) return order === "asc" ? 1 : -1;
//       return 0;
//     });
//     setData(sortedData);
//   };

//   // Filter Empty Values
//   const handleFilterEmpty = (colIndex) => {
//     const filteredData = data.filter((row) => row[colIndex].trim() !== "");
//     setData(filteredData);
//   };

//   // Reset Table
//   const handleReset = () => {
//     setData([...originalData]);
//   };

//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       <h2>CSV File Uploader</h2>
//       <input type="file" accept=".csv" onChange={handleFileUpload} />

//       {data.length > 0 && (
//         <table border="1" style={{ margin: "20px auto", width: "80%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               {headers.map((header, index) => (
//                 <th key={index} style={{ padding: "10px", background: "#f0f0f0" }}>
//                   {header}
//                   <div style={{ marginTop: "5px" }}>
//                     <button onClick={() => handleSort(index, "asc")} title="Sort Ascending">Categorical Trandform</button>
//                     <button onClick={() => handleSort(index, "desc")} title="Sort Descending">Normalize</button>
//                     <button onClick={() => handleFilterEmpty(index)} title="Filter Empty">Fill Missing</button>
//                     <button onClick={handleReset} title="Reset">🔄</button>
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 {row.map((cell, cellIndex) => (
//                   <td key={cellIndex} style={{ padding: "10px" }}>{cell}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default CSVEditor;

// import React, { useState } from "react";
// import axios from "axios";

// const API_URL = "http://127.0.0.1:5000"; // Flask Server URL

// const CSVEditor = () => {
//   const [data, setData] = useState([]);  // Initialize as empty array
//   const [headers, setHeaders] = useState([]);  // Initialize as empty array

//   // Handle File Upload
//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axios.post(`${API_URL}/upload`, formData);

//       if (response.data.data && response.data.columns) {
//         setData(response.data.data);
//         setHeaders(response.data.columns);
//       } else {
//         console.error("Unexpected response format:", response.data);
//       }

//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };

//   // Handle Column Transformations
//   const handleTransform = async (column, operation) => {
//     try {
//       const response = await axios.post(`${API_URL}/transform`, { column, operation });

//       if (response.data.data) {
//         setData(response.data.data);
//       } else {
//         console.error("Unexpected response format:", response.data);
//       }

//     } catch (error) {
//       console.error(`Error applying ${operation} on ${column}:`, error);
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       <h2>CSV File Uploader & Transformer</h2>
//       <input type="file" accept=".csv" onChange={handleFileUpload} />

//       {data.length > 0 && headers.length > 0 ? (  // ✅ Check before rendering
//         <table border="1" style={{ margin: "20px auto", width: "80%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               {headers.map((header, index) => (
//                 <th key={index} style={{ padding: "10px", background: "#f0f0f0" }}>
//                   {header}
//                   <div style={{ marginTop: "5px" }}>
//                     <button onClick={() => handleTransform(header, "categorical_transform")}>🔄 Categorical</button>
//                     <button onClick={() => handleTransform(header, "normalize")}>⚖ Normalize</button>
//                     <button onClick={() => handleTransform(header, "fill_missing")}>➕ Fill Missing</button>
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 {headers.map((header, cellIndex) => (
//                   <td key={cellIndex} style={{ padding: "10px" }}>{row[header]}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>Upload a CSV file to see data</p>  // ✅ Show message when no data is present
//       )}
//     </div>
//   );
// };

// export default CSVEditor;

import React, { useState } from "react";
import { useNavigate } from "react-router";

const CSVEditor = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // Upload CSV
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setIsLoading(true);
      fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.data) {
            setHeaders(result.columns);
            setData(result.data);
          } else {
            console.error("Unexpected response format:", result);
          }
        })
        .catch((error) => console.error("Error uploading file:", error));
    }
    setIsLoading(false);
  };

  // Transform Column
  const handleTransform = (colName, operation) => {
    setIsLoading(true);
    fetch("http://127.0.0.1:5000/transform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ column: colName, operation }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.data) {
          setData(result.data);
        } else {
          console.error("Unexpected response format:", result);
        }
      })
      .catch((error) => console.error("Error transforming column:", error));
    setIsLoading(false);
  };
  const navigate = useNavigate();
  // Download CSV
  const handleDownload = () => {
    fetch("http://127.0.0.1:5000/download", {
      method: "GET",
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "modified_data.csv");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.error("Error downloading file:", error));
  };

  return (
    <>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>CSV File Uploader</h2>
        <input type="file" accept=".csv" onChange={handleFileUpload} />

        {data.length > 0 && (
          <>
            <button onClick={handleDownload}>Download Modified CSV</button>

            <button onClick={() => navigate("/model")}>Model</button>

            <table
              border="1"
              style={{
                margin: "20px auto",
                width: "80%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      style={{ padding: "10px", background: "#f0f0f0" }}
                    >
                      {header}
                      <div style={{ marginTop: "5px" }}>
                        <button
                          onClick={() =>
                            handleTransform(header, "categorical_transform")
                          }
                        >
                          Categorical Transform
                        </button>
                        <button
                          onClick={() => handleTransform(header, "normalize")}
                        >
                          Normalize
                        </button>
                        <button
                          onClick={() =>
                            handleTransform(header, "fill_missing")
                          }
                        >
                          Fill Missing
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {headers.map((header, cellIndex) => (
                      <td key={cellIndex} style={{ padding: "10px" }}>
                        {row[header] !== null ? row[header] : "N/A"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
};

export default CSVEditor;
