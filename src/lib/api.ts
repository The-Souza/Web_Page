import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

// Cria uma instância configurada do Axios.
// Essa instância será usada em todo o projeto para manter consistência.
export const api = axios.create({
  baseURL: API_URL, // Define o endpoint base para todas as requisições.
});

// Interceptor de requisições:
// Executa automaticamente antes de cada request realizada pela instância `api`.
api.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  // Adiciona o token de autenticação no cabeçalho Authorization, se existir.
  const token = localStorage.getItem("token");

  // Se houver token, adiciona ao cabeçalho
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
