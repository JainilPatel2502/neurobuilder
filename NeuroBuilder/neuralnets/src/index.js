import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { NNProvider } from "./context/NNProvider";
import CSVEditor from "./components/CSVEditor";
import { BrowserRouter, Routes, Route } from "react-router";
import Visual from "./components/Visual";
import { VisualProvider } from "./context/VisualProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <VisualProvider>
      <NNProvider>
        <BrowserRouter>
          <Routes>
            <Route path="csv" element={<CSVEditor />} />
            <Route path="model" element={<App />} />
            <Route path="plots" element={<Visual />} />
          </Routes>
        </BrowserRouter>
      </NNProvider>
    </VisualProvider>
  </React.StrictMode>
);
