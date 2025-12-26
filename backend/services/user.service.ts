import type { User, UserRecord } from "../models/user.types.js";
import { omitFields } from "../helpers/omitFields.js";
import { getSupabase } from "../utils/getSupabase.js";

/**
 * Converte um registro cru retornado pelo banco (UserRecord)
 * para o modelo User usado internamente na aplicação.
 *
 * - Se o registro for null/undefined, retorna null.
 * - Mantém todos os campos, inclusive senha.
 */
export function mapRecordToUserRaw(record: UserRecord): User | null {
  if (!record) return null;

  return {
    id: record.id,
    name: record.name,
    email: record.email,
    password: record.password,
  };
}

/**
 * Converte um registro de usuário para um modelo "seguro" para resposta.
 *
 * - Remove campos confidenciais (senha e endereço).
 * - Aceita UserRecord ou User.
 * - Delega a conversão crua para mapRecordToUserRaw().
 */
export function mapRecordToUserSafe(record: UserRecord | User | null) {
  const raw = mapRecordToUserRaw(record as UserRecord);
  if (!raw) return null;

  // Usa helper para remover campos sensíveis
  return omitFields(raw, ["password"]);
}

/**
 * Verifica se um e-mail já existe no banco de dados.
 *
 * Retorna:
 *  - true caso exista
 *  - false caso não exista
 */
export const exists = async (email: string): Promise<boolean> => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email);

  if (error) throw error;

  return data.length > 0;
};

/**
 * Adiciona um novo usuário no banco.
 *
 * Observações:
 * - password é opcional, então tratamos null.
 */
export const add = async (user: User): Promise<void> => {
  const supabase = getSupabase();
  const { error } = await supabase.from("users").insert([
    {
      name: user.name,
      email: user.email,
      password: user.password ?? null,
    },
  ]);

  if (error) throw error;
};

/**
 * Autentica um usuário pelo email e senha.
 *
 * - Aqui ainda é autenticação simplificada (sem hashing).
 * - Se encontrar o usuário, retorna o usuário completo (com senha).
 * - Se não encontrar, retorna null.
 */
export const authenticate = async (
  email: string,
  password: string
): Promise<User | null> => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  // Se der erro, interpretamos como usuário não encontrado
  if (error) return null;

  return mapRecordToUserRaw(data);
};

/**
 * Atualiza a senha de um usuário usando o email.
 *
 * Passos:
 * 1. Atualiza a senha.
 * 2. Busca novamente o usuário atualizado.
 * 3. Retorna o usuário cru (com senha).
 */
export const updatePassword = async (
  email: string,
  password: string
): Promise<User | null> => {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("users")
    .update({ password })
    .eq("email", email);

  if (error) throw error;

  // Busca o usuário atualizado
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  return mapRecordToUserRaw(data);
};

/**
 * Busca um usuário pelo email.
 *
 * - Retorna User | null
 * - Não lança erro se o usuário não existir.
 */
export const getUserEmail = async (email: string): Promise<User | null> => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return null;

  return mapRecordToUserRaw(data);
};
