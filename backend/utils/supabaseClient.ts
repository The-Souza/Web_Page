import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();
// Carrega todas as variáveis de ambiente definidas no .env para `process.env`.

/**
 * Cria e exporta uma instância do cliente Supabase.
 * 
 * - `SUPABASE_URL`: URL do seu projeto no Supabase.
 * - `SUPABASE_SERVICE_ROLE_KEY`: chave com permissões elevadas,
 *   usada somente no backend (NUNCA no frontend).
 * 
 * A opção `persistSession: false` evita gravação de tokens em cache,
 * útil para scripts, jobs e ambientes server-side.
 */
export const supabase = createClient(
  process.env.SUPABASE_URL!,               // URL do projeto Supabase
  process.env.SUPABASE_SERVICE_ROLE_KEY!,  // Chave Service Role
  {
    auth: {
      persistSession: false, // Não armazena sessão — execução limpa a cada run
    },
  }
);
