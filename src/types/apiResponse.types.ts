// Interface genérica que padroniza todas as respostas da API.
// O tipo <T> permite que "data" seja qualquer tipo (objeto, array, string etc.)
export interface ApiResponse<T> {
  success: boolean; // indica sucesso ou falha
  message?: string; // mensagem opcional (erro, aviso, informação)
  data?: T;         // payload opcional
}