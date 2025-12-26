import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

/**
 * getSupabase() - Retorna uma instância singleton do cliente Supabase.
 *
 * Cria o cliente na primeira chamada, reutilizando-o nas chamadas subsequentes.
 * @returns Instância singleton do cliente Supabase.
 */
export function getSupabase(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
        },
      }
    );
  }

  return supabase;
}
