import { supabase } from "../utils/supabaseClient.ts";
import type {
  Account,
  AccountRecord,
  SupabaseAccountRow,
  NewAccount,
} from "../models/account.types.ts";

/**
 * Converte o formato original retornado pelo Supabase
 * para um formato interno mais consistente (AccountRecord).
 * 
 * Isso cria uma camada de adaptação para manter o código
 * desacoplado da estrutura bruta do banco.
 */
function adaptSupabaseToRecord(rec: SupabaseAccountRow): AccountRecord {
  return {
    Id: rec.id,
    UserId: rec.userid,
    Address: rec.address,
    Account: rec.account,
    Year: rec.year,
    Month: rec.month,
    Consumption: rec.consumption,
    Days: rec.days,
    Value: rec.value,
    Paid: rec.paid,
    // Email pode vir nulo dependendo do relacionamento LEFT JOIN
    Email: rec.users?.email ?? undefined,
  };
}

/**
 * Mapeia o formato AccountRecord para o formato final Account,
 * usado pela aplicação (frontend).
 *
 * Aqui também formatamos o mês no padrão MM/yyyy.
 */
function mapAccount(record: AccountRecord): Account {
  return {
    id: record.Id,
    userId: record.UserId,
    userEmail: record.Email,
    address: record.Address,
    accountType: record.Account,
    year: record.Year,
    month: `${record.Month.toString().padStart(2, "0")}/${record.Year}`,
    consumption: record.Consumption,
    days: record.Days,
    value: record.Value,
    paid: record.Paid,
  };
}

/**
 * Busca todas as contas do banco.
 * 
 * - Faz LEFT JOIN com a tabela de usuários para obter o e-mail.
 * - Ordena da mais recente para a mais antiga.
 */
export async function getAllAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from("accounts")
    .select(
      `
      id,
      userid,
      address,
      account,
      year,
      month,
      consumption,
      days,
      value,
      paid,
      users!left(email)
    `
    )
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  const rows = data as unknown as SupabaseAccountRow[];

  return rows.map((rec) => mapAccount(adaptSupabaseToRecord(rec)));
}

/**
 * Busca contas filtrando por userId.
 * Pode opcionalmente filtrar também pelo status "paid".
 */
export async function getAccountsByUserId(
  userId: number,
  paid?: boolean
): Promise<Account[]> {
  let query = supabase
    .from("accounts")
    .select(
      `
      id,
      userid,
      address,
      account,
      year,
      month,
      consumption,
      days,
      value,
      paid,
      users!left(email)
    `
    )
    .eq("userid", userId);

  // Se o filtro pago/não pago for enviado, aplica ao query builder
  if (typeof paid === "boolean") {
    query = query.eq("paid", paid);
  }

  const { data, error } = await query;
  if (error) throw error;
  if (!data) return [];

  const rows = data as unknown as SupabaseAccountRow[];

  return rows.map((rec) => mapAccount(adaptSupabaseToRecord(rec)));
}

/**
 * Busca contas filtrando pelo e-mail do usuário.
 * 
 * Aqui usamos INNER JOIN porque só queremos contas que realmente
 * possuem um usuário associado ao e-mail informado.
 */
export async function getAccountsByUserEmail(
  email: string,
  paid?: boolean
): Promise<Account[]> {
  let query = supabase
    .from("accounts")
    .select(
      `
      id,
      userid,
      address,
      account,
      year,
      month,
      consumption,
      days,
      value,
      paid,
      users!inner(email)
    `
    )
    .eq("users.email", email);

  if (typeof paid === "boolean") {
    query = query.eq("paid", paid);
  }

  const { data, error } = await query;
  if (error) throw error;
  if (!data) return [];

  const rows = data as unknown as SupabaseAccountRow[];

  return rows.map((rec) => mapAccount(adaptSupabaseToRecord(rec)));
}

/**
 * Atualiza o campo "paid" (pago) de uma conta específica.
 */
export async function updateAccountPaid(
  id: number,
  paid: boolean
): Promise<void> {
  const { error } = await supabase
    .from("accounts")
    .update({ paid })
    .eq("id", id);

  if (error) throw error;
}

/**
 * Insere uma nova conta e retorna o ID gerado.
 * 
 * Observação:
 * - O mês chega no formato "MM/yyyy", então fazemos um split
 *   para extrair apenas o número do mês.
 */
export async function addAccount(account: NewAccount): Promise<number> {
  const { data, error } = await supabase
    .from("accounts")
    .insert([
      {
        userid: account.userId,
        address: account.address,
        account: account.accountType,
        year: account.year,
        month: parseInt(account.month.split("/")[0]),
        consumption: account.consumption,
        days: account.days,
        value: account.value,
        paid: account.paid ?? false,
      },
    ])
    .select("id")
    .single();

  if (error) throw error;

  return data.id;
}
