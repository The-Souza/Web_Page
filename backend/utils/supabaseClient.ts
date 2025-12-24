import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Para converter import.meta.url em caminho de arquivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega o .env dentro da pasta backend
dotenv.config({ path: path.resolve(__dirname, "../.env") });

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
export function createSupabaseClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}
