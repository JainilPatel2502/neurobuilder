import React, { useState } from "react";
import { useNavigate } from "react-router";

const CSVEditor = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

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
  };

  // Transform Column
  const handleTransform = (colName, operation) => {
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
