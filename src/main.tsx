import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { Providers } from "@/providers/providers";
import "@/styles/index.css";

// Obtém o elemento raiz da aplicação
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found");
}

// Inicializa a aplicação React
createRoot(rootElement).render(
  // StrictMode ativa verificações extras durante o desenvolvimento,
  // ajudando a detectar problemas potenciais.
  <StrictMode>
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
  </StrictMode>
);
