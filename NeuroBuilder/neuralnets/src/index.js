import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { NNProvider } from "./context/NNProvider";
import CSVEditor from "./components/CSVEditor";
import { BrowserRouter, Routes, Route } from "react-router";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NNProvider>
      <BrowserRouter>
        <Routes>
          <Route path="csv" element={<CSVEditor />} />
          <Route path="model" element={<App />} />
        </Routes>
      </BrowserRouter>
    </NNProvider>
  </React.StrictMode>
);
