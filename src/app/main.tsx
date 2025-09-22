import React from "react";
import ReactDOM from "react-dom/client";
import  { App } from "./App";
import { Providers } from "@/components/providers/providers";
import { BrowserRouter } from "react-router-dom";
import "@/styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Providers>
  </React.StrictMode>
);
