import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { Providers } from "@/providers/providers";
import { BrowserRouter } from "react-router-dom";
import "@/styles/index.css";

// Inicializa a aplicação React, vinculando ao elemento <div id="root"> no index.html.
ReactDOM.createRoot(document.getElementById("root")!).render(
  // StrictMode ativa verificações extras durante o desenvolvimento,
  // ajudando a detectar problemas potenciais.
  <React.StrictMode>
    {/* BrowserRouter habilita o roteamento baseado em URL */}
    <BrowserRouter>
      {/* Providers envolve toda a aplicação,
        disponibilizando contextos globais (Auth, Toast, Loading, etc.).
        Os parâmetros debounceSec e safetySec controlam comportamentos internos
        definidos na camada de providers. */}
      <Providers debounceSec={0.3} safetySec={2}>
        {/* Componente raiz da aplicação */}
        <App />
      </Providers>
    </BrowserRouter>
  </React.StrictMode>
);
