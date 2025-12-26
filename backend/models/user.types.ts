// ============================================================
// 🧩 User Types — Modelos e representações do usuário no sistema
// ============================================================

// ---------------------------------------------------------
// Modelo principal usado internamente na aplicação
// ---------------------------------------------------------
// Este é o formato que o backend utiliza ao trabalhar com usuários
// dentro dos services, controllers e testes.
// - "password" só existe quando manipulamos dados sensíveis,
//   e nunca deve ser exposto externamente.
export type User = {
  id: number;
  name: string;  // nome do usuário
  email: string;         // email é obrigatório
  password?: string;     // nunca retornado ao cliente
};

// ---------------------------------------------------------
// Versão "segura" do usuário
// ---------------------------------------------------------
// PublicUser remove tudo que não deve ser entregue ao frontend,
// como endereço, senha ou qualquer campo sensível.
//
// Esse tipo é usado nas respostas das rotas:
//   - register
//   - login
//   - resetPassword
//
// Assim, garantimos segurança e consistência.
export type PublicUser = Omit<User, "password">;

// ---------------------------------------------------------
// Modelo que o Supabase realmente retorna
// ---------------------------------------------------------
// Estrutura exata dos dados vindo das queries do Supabase.
// Esse formato vem diretamente do banco (snake_case → camelCase
// já convertido).
//
// Observações:
// - "password" só aparece se você estiver gerenciando autenticação
//   manualmente, não pelo Supabase Auth.
// - Esse modelo geralmente é convertido para `User` antes de ser usado.
export type UserRecord = {
  id: number;
  name: string;
  email: string;
  password?: string;
};
