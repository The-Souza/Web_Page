import { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/providers/hook/useAuth";
import { useToast } from "@/providers/hook/useToast";
import { Input, Select, Button, Title, Table } from "@/components";
import { registerAccount, getAccounts } from "@/services";
import { useLoading } from "@/providers/hook/useLoading";
import type { SelectHandle } from "@/components/UI/select/Select.types";
import type { Account, RegisterAccountPayload } from "@/types/account.types";

// -------------------- 🧠 Validation Schema --------------------
// ------------ schema (igual ao seu) ------------
const accountSchema = z.object({
  accountType: z.string().min(1, "Account type is required"),
  consumption: z.preprocess((v) => Number(v), z.number().positive()),
  days: z.preprocess((v) => Number(v), z.number().min(1).max(31)),
  value: z.preprocess((v) => Number(v), z.number().positive()),
  paid: z.boolean(),
  address: z.string().min(1),
  year: z.string().min(1),
  month: z.string().min(1),
});

type AccountFormData = z.infer<typeof accountSchema>;

// ------------ opções dos selects ------------
const accountTypeOptions = [
  { label: "Water", value: "Water" },
  { label: "Energy", value: "Energy" },
  { label: "Gas", value: "Gas" },
  { label: "Internet", value: "Internet" },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 6 }, (_, i) => ({
  label: String(currentYear + i),
  value: String(currentYear + i),
}));

const monthOptions = Array.from({ length: 12 }, (_, i) => {
  const month = String(i + 1).padStart(2, "0");
  return { label: month, value: month };
});

// ---------------------------------------------------
// 🧱 COMPONENTE PRINCIPAL
// ---------------------------------------------------
export default function RegisterAccount() {
  const { user, token } = useAuth();
  const { setLoading } = useLoading();
  const { showToast } = useToast();

  // 👉 estado que armazena todas as contas do usuário
  const [accounts, setAccounts] = useState<Account[]>([]);

  // 👉 busca inicial das contas
  useEffect(() => {
    async function loadAccounts() {
      setLoading(true, "Loading accounts...");
      const response = await getAccounts();
      if (response.success && response.data) {
        setAccounts(response.data);
      }
      setLoading(false);
    }
    loadAccounts();
  }, [setLoading]);

  // ------------ form setup ------------
  const defaultValues = {
    accountType: "",
    consumption: "",
    days: "",
    value: "",
    paid: false,
    address: "",
    year: "",
    month: "",
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<z.input<typeof accountSchema>, unknown, AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues,
    mode: "onBlur",
  });

  const paidValue = watch("paid");

  const yearSelectRef = useRef<SelectHandle>(null);
  const monthSelectRef = useRef<SelectHandle>(null);
  const accountTypeSelectRef = useRef<SelectHandle>(null);

  // ---------------------------------------------------
  // 📩 ENVIO DO FORMULÁRIO (salva e atualiza tabela)
  // ---------------------------------------------------
  const onSubmit = async (data: AccountFormData) => {
    if (!user?.id || !user?.email) {
      showToast({ type: "error", text: "User not found. Log in again." });
      return;
    }

    setLoading(true, "Saving...");
    try {
      const payload: RegisterAccountPayload = {
        userId: user.id,
        userEmail: user.email,
        ...data,
      };

      const response = await registerAccount(payload, token!);

      if (response.success && response.data) {
        showToast({ type: "success", text: "Account registered!" });

        // 👉 atualiza a tabela imediatamente
        const account = response.data;
        if (!account) return;

        setAccounts((prev) => [...prev, account]);

        // reset visual
        reset(defaultValues);
        yearSelectRef.current?.clearSelection();
        monthSelectRef.current?.clearSelection();
        accountTypeSelectRef.current?.clearSelection();
        setValue("paid", false);
      } else {
        showToast({ type: "error", text: response.message });
      }
    } catch {
      showToast({ type: "error", text: "Error registering account" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 text-greenLight">
      <Title text="Register Account" size="2xl" />

      <Table<Account>
        data={accounts}
        columns={[
          { key: "address", label: "Address" },
          { key: "accountType", label: "Type" },
          { key: "year", label: "Year" },
          { key: "month", label: "Month" },
          { key: "consumption", label: "Consumption" },
          { key: "value", label: "Value" },
          {
            key: "paid",
            label: "Paid",
            render: (value) => (value ? "Yes" : "No"),
          },
        ]}
        emptyMessage="No accounts found"
      />
    </div>
  );
}
