import { apiResponse } from "@/helpers/apiResponse";
import type { ApiResponse } from "@/types/apiResponse.types";

// Lê a URL base da API do .env
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Normaliza diferentes tipos de Headers para Record<string, string>
 * @param headers HeadersInit (Headers | Record<string, string> | [string, string][])
 * @returns Record<string, string>
 */
function normalizeHeaders(headers?: HeadersInit): Record<string, string> {
  if (!headers) return {};

  if (headers instanceof Headers) {
    const obj: Record<string, string> = {};
    headers.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }

  if (Array.isArray(headers)) {
    const obj: Record<string, string> = {};
    headers.forEach(([key, value]) => {
      obj[key] = value;
    });
    return obj;
  }

  // já é Record<string, string>
  return headers;
}

/**
 * Cliente HTTP genérico para chamadas à API
 *
 * - T é o tipo do "data" esperado na resposta
 * - Sempre retorna um ApiResponse<T>
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // Lê token do localStorage
    const token = localStorage.getItem("token");

    // Constrói headers seguros
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...normalizeHeaders(options.headers),
    };

    // Faz a requisição HTTP
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Tenta converter o body em JSON, se falhar retorna null
    const rawJson = await response.json().catch(() => null);

    // ============================
    // 1) Se a request HTTP falhou
    // ============================
    if (!response.ok) {
      return apiResponse.error<T>(rawJson?.message ?? "Request failed");
    }

    // ===============================================
    // 2) Se o backend não mandou "success", assume true
    // ===============================================
    const success = rawJson?.success ?? true;

    // ====================================================
    // 3) Se o backend não enviou "data", usa o JSON completo
    // ====================================================
    const data = rawJson?.data ?? rawJson;

    // Retorno padronizado
    return {
      success,
      message: rawJson?.message,
      data,
    };
  } catch {
    // Erro de rede ou outro inesperado
    return apiResponse.error<T>("Network error");
  }
}
