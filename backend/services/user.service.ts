import { supabase } from "../utils/supabaseClient.ts";
import type { User, UserRecord } from "../models/user.types.ts";
import { omitFields } from "../helpers/omitFields.ts";

export function mapRecordToUserRaw(record: UserRecord): User | null {
  if (!record) return null;

  return {
    id: record.id,
    name: record.name,
    email: record.email,
    address: record.address,
    password: record.password,
  };
}

export function mapRecordToUserSafe(
  record: UserRecord | User | null
) {
  const raw = mapRecordToUserRaw(record as UserRecord);
  if (!raw) return null;
  return omitFields(raw, ["password", "address"]);
}

export const exists = async (email: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email);

  if (error) throw error;

  return data.length > 0;
};

export const add = async (user: User): Promise<void> => {
  const { error } = await supabase.from("users").insert([
    {
      name: user.name,
      email: user.email,
      address: user.address ?? null,
      password: user.password ?? null,
    },
  ]);

  if (error) throw error;
};

export const authenticate = async (
  email: string,
  password: string
): Promise<User | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error) return null;

  return mapRecordToUserRaw(data);
};

export const updatePassword = async (
  email: string,
  password: string
): Promise<User | null> => {
  const { error } = await supabase
    .from("users")
    .update({ password })
    .eq("email", email);

  if (error) throw error;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  return mapRecordToUserRaw(data);
};

export const getUserEmail = async (email: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return null;

  return mapRecordToUserRaw(data);
};
