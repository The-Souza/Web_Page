import { useRef, useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/providers/hook/useAuth";
import { useToast } from "@/providers/hook/useToast";
import { Select, Button, Title, Table, Input, Pagination } from "@/components";
import {
  registerAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
} from "@/services";
import { useLoading } from "@/providers/hook/useLoading";
import type { SelectHandle } from "@/components/UI/select/Select.types";
import type { Account, RegisterAccountPayload } from "@/types/account.types";
import { useAccountSummary } from "@/hooks/useAccountSummary";
import { useAccounts } from "@/hooks/useAccounts";
import { formatConsumption, formatCurrency } from "@/helpers/accountHelpers";
import Modal from "@/components/UI/modal/Modal";

// ------------------------------------------------------------
// 🧠 SCHEMA DE VALIDAÇÃO COM ZOD
// ------------------------------------------------------------
// - Define os campos do formulário
// - Normaliza valores numéricos
// - Garante coerência e mensagens de erro automáticas
const accountSchema = z.object({
  accountType: z.string().min(1, "Account type is required"),

  consumption: z.preprocess((val) => {
    const n = Number(String(val).replace(",", "."));
    return isNaN(n) ? undefined : n;
  }, z.number().min(0.000001, "Consumption must be a number greater than 0")),

  days: z.preprocess((val) => {
    const n = Number(val);
    return isNaN(n) ? undefined : n;
  }, z.number().min(1, "Days must be between 1 and 31").max(31, "Days must be between 1 and 31")),

  value: z.preprocess((val) => {
    const n = Number(String(val).replace(",", "."));
    return isNaN(n) ? undefined : n;
  }, z.number().min(0.000001, "Value must be greater than 0")),

  paid: z.boolean(),
  address: z.string().min(1, "Address is required"),
  year: z.string().min(1, "Year is required"),
  month: z.string().min(1, "Month is required"),
});

// Dados gerados a partir do schema
type AccountFormData = z.infer<typeof accountSchema>;

// ------------------------------------------------------------
// 📅 OPÇÕES FIXAS PARA SELECTS
// ------------------------------------------------------------
const accountTypeOptions = [
  { label: "Water", value: "Water" },
  { label: "Energy", value: "Energy" },
  { label: "Gas", value: "Gas" },
  { label: "Internet", value: "Internet" },
];

const currentYear = 2024;

// Gera anos futuros
const yearOptions = Array.from({ length: 6 }, (_, i) => ({
  label: String(currentYear + i),
  value: String(currentYear + i),
}));

// Gera meses 01–12
const monthOptions = Array.from({ length: 12 }, (_, i) => {
  const month = String(i + 1).padStart(2, "0");
  return { label: month, value: month };
});

// ------------------------------------------------------------
// 🧱 COMPONENTE PRINCIPAL: RegisterAccount
// ------------------------------------------------------------
export default function RegisterAccount() {
  // Dados do usuário autenticado
  const { user, token } = useAuth();

  // Providers gerais
  const { setLoading } = useLoading();
  const { showToast } = useToast();

  // Hook global de contas do usuário
  const { accounts, setAccounts, updatePaid } = useAccounts(user?.email);

  // Hook de filtros e resumos
  const summary = useAccountSummary(accounts);

  // Controle de edição no formulário
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [pageSize] = useState(5);

  // -------------------- MODAIS --------------------
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  function normalizeMonth(month: string, year: string | number): string {
    const paddedMonth = String(month).padStart(2, "0");
    return `${paddedMonth}/${year}`;
  }

  // ------------------------------------------------------------
  // ✏️ Preenche o formulário ao editar uma conta
  // ------------------------------------------------------------
  const handleEdit = (account: Account) => {
    setEditingAccount(account);

    setValue("address", account.address);
    setValue("accountType", account.accountType);
    setValue("consumption", account.consumption);
    setValue("days", account.days);
    setValue("value", account.value);
    setValue("paid", account.paid);
    setValue("year", String(account.year));

    // 🔥 AQUI ESTÁ O FIX
    // Se vier "01/2025", pega só o mês
    const normalizedMonth = account.month.includes("/")
      ? account.month.split("/")[0]
      : account.month;

    setValue("month", normalizedMonth);

    setFormModalOpen(true);
  };

  // ------------------------------------------------------------
  // 🗑️ Abertura do modal de exclusão
  // ------------------------------------------------------------
  const handleDeleteClick = (account: Account) => {
    setAccountToDelete(account);
    setDeleteModalOpen(true);
  };

  const paginatedAccounts = useMemo(() => {
    return summary.filteredAccounts.slice(startIndex, startIndex + pageSize);
  }, [summary.filteredAccounts, startIndex, pageSize]);

  // ------------------------------------------------------------
  // 🗑️ Confirma exclusão
  // ------------------------------------------------------------
  const confirmDelete = async () => {
    if (!accountToDelete) return;

    setLoading(true, "Deleting...");
    const response = await deleteAccount(accountToDelete.id, token!);

    if (response.success) {
      setAccounts((prev) => prev.filter((a) => a.id !== accountToDelete.id));
      showToast({
        type: "success",
        title: "Account deleted",
        text: response.message,
      });
    } else {
      showToast({ type: "error", text: response.message });
    }

    setLoading(false);
    setDeleteModalOpen(false);
    setAccountToDelete(null);
  };

  const resetFormFields = () => {
    reset(defaultValues);
    setValue("paid", false);
    yearFormRef.current?.clearSelection();
    monthFormRef.current?.clearSelection();
    typeFormRef.current?.clearSelection();
    paidFormRef.current?.clearSelection();
  };

  const clearFilters = () => {
    yearFilterRef.current?.clearSelection();
    monthFilterRef.current?.clearSelection();
    typeFilterRef.current?.clearSelection();
    paidFilterRef.current?.clearSelection();

    summary.setSelectedYear("");
    summary.setSelectedMonth("");
    summary.setSelectedType("");
    summary.setSelectedPaid("");

    reset(defaultValues);
  };

  // ------------------------------------------------------------
  // 🔄 Busca inicial das contas do usuário
  // ------------------------------------------------------------
  useEffect(() => {
    if (!user?.email) return;

    async function loadAccounts() {
      setLoading(true);
      try {
        const response = await getAccounts(user!.email);

        if (response.success && response.data) {
          setAccounts(response.data);
        }
      } finally {
        setLoading(false);
      }
    }

    loadAccounts();
  }, [setLoading, user, setAccounts]);

  useEffect(() => {
    setStartIndex(0);
  }, [summary.filteredAccounts]);

  // ------------------------------------------------------------
  // 📝 Configuração do formulário (React Hook Form + Zod)
  // ------------------------------------------------------------
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

  // Observa o valor "paid" (radio button)
  const paidValue = watch("paid");

  // Refs para limpeza dos selects
  // Filtros
  const yearFilterRef = useRef<SelectHandle>(null);
  const monthFilterRef = useRef<SelectHandle>(null);
  const typeFilterRef = useRef<SelectHandle>(null);
  const paidFilterRef = useRef<SelectHandle>(null);

  // Modal
  const yearFormRef = useRef<SelectHandle>(null);
  const monthFormRef = useRef<SelectHandle>(null);
  const typeFormRef = useRef<SelectHandle>(null);
  const paidFormRef = useRef<SelectHandle>(null);

  // ------------------------------------------------------------
  // 📩 SUBMIT — Cria ou atualiza conta
  // ------------------------------------------------------------
  const onSubmit = async (data: AccountFormData) => {
    if (!user?.id || !user?.email) {
      showToast({ type: "error", text: "User not found. Log in again." });
      return;
    }

    setLoading(true, editingAccount ? "Updating..." : "Saving...");

    try {
      if (editingAccount) {
        // UPDATE
        const response = await updateAccount(
          editingAccount.id,
          {
            ...data,
            year: Number(data.year),
            month: normalizeMonth(data.month, data.year),
          },
          token!
        );

        if (!response.data?.id) {
          throw new Error("Account id not returned from API");
        }

        if (response.success && response.data) {
          setAccounts((prev) =>
            prev.map((a) => (a.id === editingAccount.id ? response.data! : a))
          );
          showToast({
            type: "success",
            title: "Account updated!",
            text: response.message,
          });
        } else {
          showToast({ type: "error", text: response.message });
        }

        setEditingAccount(null);
      } else {
        // CREATE
        const payload: RegisterAccountPayload = {
          userId: user.id,
          userEmail: user.email,
          address: data.address,
          accountType: data.accountType,
          year: data.year,
          month: data.month,
          consumption: data.consumption,
          days: data.days,
          value: data.value,
          paid: data.paid,
        };

        const response = await registerAccount(payload, token!);

        if (response.success && response.data) {
          const normalizedAccount: Account = {
            id: response.data.id,
            userId: user.id,
            userEmail: user.email,

            address: data.address,
            accountType: data.accountType,

            year: Number(data.year),
            month: normalizeMonth(data.month, data.year),

            consumption: data.consumption,
            days: data.days,
            value: data.value,

            paid: data.paid,
          };

          setAccounts((prev) => [...prev, normalizedAccount]);
          showToast({
            type: "success",
            title: "Account added",
            text: response.message,
          });
        } else {
          showToast({ type: "error", text: response.message });
        }
      }

      // 🔹 Limpa apenas selects do formulário (não filtros)
      yearFormRef.current?.clearSelection();
      monthFormRef.current?.clearSelection();
      typeFormRef.current?.clearSelection();
      paidFormRef.current?.clearSelection();

      reset(defaultValues);

      // Garantir que os radios resetem
      setValue("paid", false);
    } catch {
      showToast({
        type: "error",
        text: editingAccount
          ? "Error updating account"
          : "Error registering account",
      });
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // 🖥️ RENDERIZAÇÃO
  // ------------------------------------------------------------
  return (
    <div className="flex flex-col gap-4 text-greenLight">
      {/* HEADER + FILTROS ------------------------------------- */}
      <div className="flex flex-col gap-4 items-start w-full">
        <Title text="Accounts" size="2xl" />

        <div className="w-full flex flex-col xl:flex-row gap-4 items-end">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full xl:w-auto">
            <Select
              ref={yearFilterRef}
              label="Year"
              options={summary.availableYears.map((y) => ({
                label: y,
                value: y,
              }))}
              placeholder="Select a year"
              value={summary.selectedYear}
              onChange={(val) => summary.setSelectedYear(val)}
            />

            <Select
              ref={monthFilterRef}
              label="Month"
              options={summary.availableMonths.map((m) => ({
                label: m,
                value: m,
              }))}
              placeholder="Select a month"
              value={summary.selectedMonth}
              onChange={(val) => summary.setSelectedMonth(val)}
            />

            <Select
              ref={typeFilterRef}
              label="Type"
              options={summary.availableTypes.map((t) => ({
                label: t,
                value: t,
              }))}
              placeholder="Select a type"
              value={summary.selectedType}
              onChange={(val) => summary.setSelectedType(val)}
            />

            <Select
              ref={paidFilterRef}
              label="Type"
              options={summary.availablePaids.map((p) => ({
                label: p ? "Paid" : "Unpaid",
                value: String(p), // converte boolean → string
              }))}
              placeholder="Select an account status"
              value={
                summary.selectedPaid === "" ? "" : String(summary.selectedPaid)
              }
              onChange={(val) => {
                summary.setSelectedPaid(val === "" ? "" : val === "true");
              }}
            />
          </div>

          <div className="flex w-full xl:flex-1 gap-4">
            {/* Limpar filtros */}
            <Button
              text="Clear filters"
              size="full"
              variant="solid"
              onClick={clearFilters}
            />

            {/* Botão de criar */}
            <Button
              text="Add Account"
              size="full"
              variant="solid"
              onClick={() => {
                resetFormFields(); // apenas form
                setEditingAccount(null);
                setFormModalOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------
          📋 TABELA DE CONTAS FILTRADAS
      -------------------------------------------------------- */}
      <Table<Account>
        id="table-accounts"
        data={paginatedAccounts}
        rowKey={(acc) => acc.id}
        columns={[
          {
            key: "__index",
            label: "Nº",
            render: (_, __, rowIndex) => startIndex + rowIndex + 1,
          },
          { key: "address", label: "Address" },
          { key: "year", label: "Year" },
          { key: "month", label: "Month" },
          { key: "accountType", label: "Type" },
          {
            key: "consumption",
            label: "Consumption",
            render: (val, row) =>
              formatConsumption(row.accountType, val as number),
          },
          { key: "days", label: "Days" },
          {
            key: "value",
            label: "Value",
            render: (val) => formatCurrency(val as number),
          },
          {
            key: "paid",
            label: "Paid/Unpaid",
            render: (value, acc) => (
              <div className="flex items-center justify-center">
                <div className="w-[6rem]">
                  <Button
                    text={value ? "Paid" : "Unpaid"}
                    icon="money"
                    size="full"
                    variant={value ? "solid" : "unpaid"}
                    onClick={() =>
                      updatePaid(
                        acc.id,
                        !value, // inverte o estado
                        acc.accountType,
                        acc.address,
                        acc.month
                      )
                    }
                  />
                </div>
              </div>
            ),
          },
          {
            key: "actions",
            label: "Actions",
            render: (_, row) => (
              <div className="flex items-center gap-2 justify-center">
                <Button
                  size="full"
                  variant="solid"
                  icon="edit"
                  onClick={() => handleEdit(row)}
                />
                <Button
                  size="full"
                  variant="solid"
                  icon="trash"
                  onClick={() => handleDeleteClick(row)}
                />
              </div>
            ),
          },
        ]}
        emptyMessage="No accounts found"
      />

      <Pagination
        items={summary.filteredAccounts}
        initialPageSize={5}
        onPageChange={({ startIndex }) => {
          setStartIndex(startIndex);
        }}
      />

      {/* --------------------------------------------------------
      📝 MODAL DE FORMULÁRIO (CRIAR/EDITAR)
      -------------------------------------------------------- */}
      <Modal
        isOpen={isFormModalOpen}
        variant="default"
        onClose={() => {
          setFormModalOpen(false);
          setEditingAccount(null);
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Input
                {...register("address")}
                theme="light"
                label="Address"
                placeholder="Ex: Rua XYZ, nº 123"
                error={errors.address?.message}
              />

              <Select
                ref={yearFormRef}
                label="Year"
                theme="light"
                required={true}
                placeholder="Select year"
                options={yearOptions}
                onChange={(val) => setValue("year", val)}
                value={String(watch("year") ?? "")}
                error={errors.year?.message}
              />

              <Select
                ref={monthFormRef}
                label="Month"
                theme="light"
                required={true}
                placeholder="Select month"
                options={monthOptions}
                onChange={(val) => setValue("month", val)}
                value={String(watch("month") ?? "")}
                error={errors.month?.message}
              />

              <Select
                ref={typeFormRef}
                label="Account Type"
                theme="light"
                required={true}
                placeholder="Select account type"
                options={accountTypeOptions}
                onChange={(val) => setValue("accountType", val)}
                value={String(watch("accountType") ?? "")}
                error={errors.accountType?.message}
              />

              <Input
                {...register("consumption")}
                label="Consumption"
                theme="light"
                placeholder="123,450"
                type="text"
                inputMode="decimal"
                error={errors.consumption?.message}
              />

              <Input
                {...register("days")}
                label="Days"
                theme="light"
                placeholder="Ex: 1 to 31"
                type="number"
                error={errors.days?.message}
              />

              <Input
                {...register("value")}
                label="Value"
                placeholder="90,45"
                type="text"
                inputMode="decimal"
                error={errors.value?.message}
              />

              {/* Campo Paid — APENAS NO MODAL DE CRIAÇÃO */}
              {!editingAccount && (
                <div className="flex flex-col items-start justify-center gap-1">
                  <span className="font-lato font-semibold">
                    {paidValue ? "Paid" : "Unpaid"}
                  </span>

                  <button
                    type="button"
                    onClick={() => setValue("paid", !paidValue)}
                    className={`
                    relative w-14 h-8 rounded-full transition-colors
                    ${paidValue ? "bg-greenLight" : "bg-red-400"}
                  `}
                  >
                    <span
                      className={`
                        absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform
                        ${paidValue ? "translate-x-6" : "translate-x-0"}
                      `}
                    />
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <Button type="submit" variant="solid" size="full" text="Save" />
              <Button
                variant="unpaid"
                size="full"
                text="Cancel"
                onClick={() => {
                  resetFormFields(); // reseta apenas form
                  setFormModalOpen(false);
                }}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* --------------------------------------------------------
      🗑️ MODAL DE CONFIRMAÇÃO DE EXCLUSÃO
      -------------------------------------------------------- */}
      <Modal
        isOpen={isDeleteModalOpen}
        variant="confirm"
        onClose={() => setDeleteModalOpen(false)}
      >
        <div className="flex flex-col items-center gap-2 text-greenLight">
          <Title text="Delete Account" size="2xl" />

          <p className="font-lato text-md leading-10">
            Are you sure you want to delete this account?
          </p>

          <div className="flex w-full gap-3">
            <Button
              text="Delete"
              variant="solid"
              size="full"
              onClick={confirmDelete}
            />
            <Button
              text="Cancel"
              variant="unpaid"
              size="full"
              onClick={() => setDeleteModalOpen(false)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
