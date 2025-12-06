import { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/providers/hook/useAuth";
import { useToast } from "@/providers/hook/useToast";
import { Select, Button, Title, Table, Input } from "@/components";
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

// -------------------- 🧠 Validation Schema --------------------
// ------------ schema (igual ao seu) ------------
const accountSchema = z.object({
  accountType: z.string().min(1, "Account type is required"),
  consumption: z.preprocess((v) => Number(v), z.number().positive()),
  days: z.preprocess((v) => Number(v), z.number().min(1).max(31)),
  value: z.preprocess((v) => Number(v), z.number().positive()),
  paid: z.boolean(),
  address: z.string().min(1),
  year: z.preprocess((v) => Number(v), z.number()),
  month: z.preprocess((v) => Number(v), z.number()),
});

type AccountFormData = z.infer<typeof accountSchema>;

// -------------------- 📅 Select Options --------------------
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
  const { accounts, setAccounts } = useAccounts(user?.email);

  const summary = useAccountSummary(accounts);

  // 👉 estado que armazena todas as contas do usuário
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  // -------------------- MODAL STATES --------------------
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  const handleEdit = (account: Account) => {
    setEditingAccount(account);

    setValue("address", account.address);
    setValue("accountType", account.accountType);
    setValue("consumption", account.consumption);
    setValue("days", account.days);
    setValue("value", account.value);
    setValue("paid", account.paid);
    setValue("year", account.year);
    setValue("month", account.month);

    setFormModalOpen(true);
  };

  const handleDeleteClick = (account: Account) => {
    setAccountToDelete(account);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!accountToDelete) return;

    setLoading(true, "Deleting...");
    const response = await deleteAccount(accountToDelete.id, token!);

    if (response.success) {
      setAccounts((prev) => prev.filter((a) => a.id !== accountToDelete.id));
      showToast({ type: "success", text: "Account deleted!" });
    } else {
      showToast({ type: "error", text: response.message });
    }

    setLoading(false);
    setDeleteModalOpen(false);
    setAccountToDelete(null);
  };

  // 👉 busca inicial das contas
  useEffect(() => {
    if (!user?.email) return;
    async function loadAccounts() {
      setLoading(true, "Loading accounts...");
      const response = await getAccounts(user!.email);
      if (response.success && response.data) {
        setAccounts(response.data);
      }
      setLoading(false);
    }
    loadAccounts();
  }, [setLoading, user, setAccounts]);

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

    setLoading(true, editingAccount ? "Updating..." : "Saving...");

    try {
      if (editingAccount) {
        // --- UPDATE ---
        const response = await updateAccount(editingAccount.id, data, token!);

        if (response.success && response.data) {
          setAccounts((prev) =>
            prev.map((a) => (a.id === editingAccount.id ? response.data! : a))
          );
          showToast({ type: "success", text: "Account updated!" });
        } else {
          showToast({ type: "error", text: response.message });
        }

        setEditingAccount(null);
      } else {
        // --- CREATE ---
        const payload: RegisterAccountPayload = {
          userId: user.id,
          userEmail: user.email,
          ...data,
        };

        const response = await registerAccount(payload, token!);

        if (response.success && response.data) {
          setAccounts((prev) => [...prev, response.data!]);
          showToast({ type: "success", text: "Account registered!" });
        } else {
          showToast({ type: "error", text: response.message });
        }
      }

      // limpar UI sempre que salvar
      reset(defaultValues);
      yearSelectRef.current?.clearSelection();
      monthSelectRef.current?.clearSelection();
      accountTypeSelectRef.current?.clearSelection();
      setValue("year", "");
      setValue("month", "");
      setValue("accountType", "");
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

  return (
    <div className="flex flex-col gap-4 text-greenLight">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <Title text="Register Account" size="2xl" />

        <div className="flex flex-col items-end sm:flex-row gap-2 w-full sm:w-auto">
          <Select
            ref={yearSelectRef}
            label="Year"
            options={summary.availableYears.map((y) => ({
              label: y,
              value: y,
            }))}
            placeholder="Select a year"
            value={String(watch("year") ?? "")}
            onChange={(val) => summary.setSelectedYear(val)}
          />

          <Select
            ref={monthSelectRef}
            label="Month"
            options={summary.availableMonths.map((m) => ({
              label: m,
              value: m,
            }))}
            placeholder="Select a month"
            value={String(watch("month") ?? "")}
            onChange={(val) => summary.setSelectedMonth(val)}
          />

          <Select
            ref={accountTypeSelectRef}
            label="Type"
            options={summary.availableTypes.map((t) => ({
              label: t,
              value: t,
            }))}
            placeholder="Select a type"
            value={String(watch("accountType") ?? "")}
            onChange={(val) => summary.setSelectedType(val)}
          />

          <Button
            text="Clear filters"
            size="full"
            variant="solid"
            onClick={() => {
              // Limpa selects
              yearSelectRef.current?.clearSelection();
              monthSelectRef.current?.clearSelection();
              accountTypeSelectRef.current?.clearSelection();

              // Limpa valores do formulário
              reset(defaultValues);

              // LIMPA FILTROS DO HOOK useAccountSummary
              summary.setSelectedYear("");
              summary.setSelectedMonth("");
              summary.setSelectedType("");

              // Garante que o form não mantenha valores residuais
              setValue("year", "");
              setValue("month", "");
              setValue("accountType", "");
            }}
          />

          <Button
            text="Add Account"
            size="full"
            variant="solid"
            onClick={() => {
              reset(defaultValues);
              setEditingAccount(null); // garantindo modo criar
              setFormModalOpen(true); // abre o modal
            }}
          />
        </div>
      </div>

      <Table<Account>
        data={summary.filteredAccounts}
        rowKey={(acc) => acc.id}
        columns={[
          { key: "address", label: "Address" },
          { key: "accountType", label: "Type" },
          { key: "year", label: "Year" },
          { key: "month", label: "Month" },
          {
            key: "consumption",
            label: "Consumption",
            render: (val, row) =>
              formatConsumption(row.accountType, val as number),
          },
          {
            key: "value",
            label: "Value",
            render: (val) => formatCurrency(val as number),
          },
          {
            key: "paid",
            label: "Paid",
            render: (value) => (value ? "✅ Paid" : "❌ Unpaid"),
          },
          {
            key: "actions",
            label: "Custom",
            className: "px-4 py-3 flex justify-center items-center",
            render: (_, row) => (
              <div className="flex items-center gap-2">
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

      {/* FORM MODAL (ADD & EDIT) */}
      <Modal
        isOpen={isFormModalOpen}
        variant="default"
        onClose={() => {
          setFormModalOpen(false);
          setEditingAccount(null);
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          // className="bg-dark p-8 sm:p-10 rounded-2xl border-2 border-greenLight flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              {...register("address")}
              theme="light"
              label="Address"
              placeholder="Ex: Rua XYZ, nº 123"
              error={errors.address?.message}
            />

            <Select
              ref={yearSelectRef}
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
              ref={monthSelectRef}
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
              ref={accountTypeSelectRef}
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
              placeholder="Consumption in m³ or kWh"
              type="number"
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
              type="number"
              error={errors.value?.message}
            />

            {/* ----- Paid Status ----- */}
            <div className="flex flex-col gap-1">
              <label className="font-lato font-semibold text-md">
                Paid Status
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="true"
                    checked={paidValue === true}
                    onChange={() => setValue("paid", true)}
                    className="accent-greenLight"
                  />
                  <span>Paid</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="false"
                    checked={paidValue === false}
                    onChange={() => setValue("paid", false)}
                    className="accent-red-400"
                  />
                  <span>Unpaid</span>
                </label>
              </div>
              {errors.paid && (
                <p className="text-red-500 text-sm font-lato">
                  {errors.paid.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button type="submit" variant="solid" size="full" text="Save" />
            <Button
              variant="unpaid"
              size="full"
              text="Cancel"
              onClick={() => setFormModalOpen(false)}
            />
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        variant="confirm"
        onClose={() => setDeleteModalOpen(false)}
      >
        <div className="flex flex-col items-center gap-2 text-greenLight">
          <Title text="Delete Account" size="2xl" />

          <p className="font-lato text-lg leading-10">Are you sure you want to delete this account?</p>

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
