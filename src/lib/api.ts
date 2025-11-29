import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Cria uma instância configurada do Axios.
// Essa instância será usada em todo o projeto para manter consistência.
export const api = axios.create({
  baseURL: API_URL, // Define o endpoint base para todas as requisições.
});

// Interceptor de requisições:
// Executa automaticamente antes de cada request realizada pela instância `api`.
api.interceptors.request.use((config) => {
  // Recupera o token armazenado no localStorage, se existir.
  const token = localStorage.getItem("token");

  // Se houver token, anexa no header Authorization do request.
  // Assim, qualquer endpoint protegido receberá o token sem necessidade de repetir código.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Retorna a configuração final da requisição.
  return config;
});
