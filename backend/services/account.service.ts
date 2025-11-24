import { supabase } from "../utils/supabaseClient.ts";
import type {
  Account,
  AccountRecord,
  SupabaseAccountRow,
  NewAccount,
} from "../models/account.types.ts";

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
    Email: rec.users?.email ?? undefined,
  };
}

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

  if (typeof paid === "boolean") {
    query = query.eq("paid", paid);
  }

  const { data, error } = await query;
  if (error) throw error;
  if (!data) return [];

  const rows = data as unknown as SupabaseAccountRow[];

  return rows.map((rec) => mapAccount(adaptSupabaseToRecord(rec)));
}

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
