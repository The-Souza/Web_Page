// Representa um usuário completo dentro do sistema.
// Alguns campos são opcionais porque nem sempre estão presentes
// (como em cadastros parciais ou respostas filtradas).
export interface User {
  id?: number;              // ID do usuário no banco (opcional)
  name?: string;            // Nome do usuário (opcional)
  email: string;            // Email é obrigatório
  password?: string;        // Senha — normalmente nunca é retornada ao frontend
}

// Versão "segura" do usuário, enviada ao frontend.
// Remove campos sensíveis: 'password'.
export type PublicUser = Omit<User, "password">;

// Resposta retornada em uma rota de login.
// Inclui informações opcionais dependendo do resultado da autenticação.
export interface LoginResponse {
  success: boolean;     // Indica se o login foi bem-sucedido
  message?: string;     // Mensagem opcional (erro, aviso, sucesso)
  user?: PublicUser;    // Usuário já sanitizado (sem senha/endereço)
  token?: string;       // JWT retornado após login bem-sucedido
}

// Resposta usada para verificar se um email está registrado.
// Boa para validação de formulários antes do cadastro.
export interface CheckUserResponse {
  success: boolean;  // Indica se a operação executou sem erros
  exists: boolean;   // Indica se o usuário existe no sistema
  message?: string;  // Mensagem opcional de contexto
}
