// ============================================================
// 🧩 User Types — Modelos e representações do usuário no sistema
// ============================================================

// ---------------------------------------------------------
// Modelo principal usado internamente na aplicação
// ---------------------------------------------------------
// Este é o formato que o backend utiliza ao trabalhar com usuários
// dentro dos services, controllers e testes.
// - Alguns campos são opcionais porque podem não estar preenchidos
//   no processo de registro (ex: name, address).
// - "password" só existe quando manipulamos dados sensíveis,
//   e nunca deve ser exposto externamente.
export type User = {
  id: number;
  name?: string | null;  // nome do usuário (opcional)
  email: string;         // email é obrigatório
  address?: string | null;
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
export type PublicUser = Omit<User, "address">;

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
  name: string | null;
  email: string;
  address: string | null;
  password?: string;
};
