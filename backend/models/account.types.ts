// ============================================================
// 🧩 Account Types — Modelos e mapeamentos usados no sistema
// ============================================================

// -------------------------------
// Modelo interno da aplicação
// -------------------------------
// Este é o formato unificado que o backend usa após
// converter os dados vindos do banco.
// É o tipo utilizado pelos services, controllers e testes.
export type Account = {
  id: number;
  userId: number;
  userEmail?: string | null; // email do usuário (opcional)
  address: string;
  accountType: string;        // tipo de conta: "Water", "Energy", etc.
  year: number;
  month: string;              // formato "02/2024" após conversão
  consumption: number;
  days: number;
  value: number;
  paid: boolean;
};

// -------------------------------
// Modelo bruto retornado pelo Supabase
// -------------------------------
// Este é exatamente o formato como a tabela do Supabase retorna os dados.
// Observe que nomes das colunas estão minúsculos e seguem o padrão do banco.
// Inclui a relação users.email quando fazemos JOIN.
export type SupabaseAccountRow = {
  id: number;
  userid: number;             // FK → users.id
  address: string;
  account: string;            // tipo de conta no banco
  year: number;
  month: number;              // número (ex: 2), será convertido para "02/2024"
  consumption: number;
  days: number;
  value: number;
  paid: boolean;
  users?: {
    email: string | null;
  } | null;                   // email vindo do join com tabela users
};

// -------------------------------
// Tipo usado para inserção
// -------------------------------
// Ao criar uma nova conta, o campo "id" não existe ainda,
// portanto ele é removido usando Omit.
export type NewAccount = Omit<Account, "id">;

// -------------------------------
// Modelo após conversão do Supabase → camelCase
// -------------------------------
// Alguns fluxos usam esse formato intermediário (ex: services)
// antes de mapear novamente para o modelo interno Account.
// Isso evita trabalhar com snake_case e mantém consistência.
export type AccountRecord = {
  Id: number;
  UserId: number;
  Address: string;
  Account: string;
  Year: number;
  Month: number;
  Consumption: number;
  Days: number;
  Value: number;
  Paid: boolean;
  Email?: string | null;       // email vindo do JOIN com tabela users
};
