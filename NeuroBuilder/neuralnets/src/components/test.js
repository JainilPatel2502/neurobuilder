import React, { useState } from "react";
import axios from "axios";
import { useTable } from "react-table";

const CSVEditor = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Server Response:", response.data['res']); // Log the entire response

      
      
      // Now safely slice the first 20 rows of data
      const tableData = response.data.data.slice(0, 20);
      setData(tableData);

      // Create column headers
      const headers = Object.keys(tableData[0]).map((col) => ({
        Header: (
          <div>
            {col} <br />
            <button onClick={() => handleColumnOperation("normalize", col)}>
              Normalize
            </button>
            <button onClick={() => handleColumnOperation("standardize", col)}>
              Standardize
            </button>
            <button onClick={() => handleColumnOperation("fill_missing", col)}>
              Fill Missing
            </button>
            <button
              onClick={() =>
                handleColumnOperation("categorical_to_numeric", col)
              }
            >
              Convert to Numeric
            </button>
          </div>
        ),
        accessor: col,
      }));

      setColumns(headers);
    } catch (error) {
      console.error(error.message);
      // alert("An error occurred while uploading the file. Please try again.");
    }
  };

  const handleColumnOperation = async (operation, column) => {
    try {
      const response = await axios.post("http://localhost:5000/transform", {
        operation,
        column,
      });

      setData(response.data.data.slice(0, 20)); // Update and limit data to 20 rows
    } catch (error) {
      console.error("Error performing column operation:", error.message);
      alert(
        "An error occurred while transforming the column. Please try again."
      );
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        style={{ marginBottom: "20px" }}
      />
      <table
        {...getTableProps()}
        style={{ border: "1px solid black", width: "100%" }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  style={{ padding: "10px", textAlign: "center" }}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: "10px",
                      border: "1px solid black",
                      textAlign: "center",
                    }}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CSVEditor;