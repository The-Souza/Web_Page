import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  Button,
  Title,
  Table,
  Input,
  Pagination,
  Modal,
} from "@/components";
import type { SelectHandle } from "@/components/UI/select/Select.types";
import type { Account } from "@/types/account.types";
import {
  registerAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
} from "@/services";
import { useLoading } from "@/providers/hook/useLoading";
import { useAccountSummary } from "@/hooks/useAccountSummary";
import { useAuth } from "@/providers/hook/useAuth";
import { useToast } from "@/providers/hook/useToast";
import { useAccounts } from "@/hooks/useAccounts";
import { formatConsumption, formatCurrency } from "@/helpers/accountHelpers";
import { normalizeMonth } from "@/helpers/accountFormHelpers";
import {
  ACCOUNT_TYPE_OPTIONS,
  MONTH_OPTIONS,
  YEAR_OPTIONS,
} from "@/constants/accountOptions";

/* ========================================================================
 * 🧠 VALIDATION SCHEMA
 * ------------------------------------------------------------------------
 * Schema de validação usando Zod.
 * Responsável por:
 * - Validar os campos do formulário
 * - Normalizar valores antes da validação (preprocess)
 * - Garantir regras de negócio básicas
 * ====================================================================== */
const accountSchema = z.object({
  // Tipo da conta (ex: água, luz, internet)
  accountType: z.string().min(1, "Account type is required"),

  // Consumo:
  // - Converte string com vírgula para número
  // - Retorna undefined se não for número (dispara erro do Zod)
  // - Valor mínimo > 0
  consumption: z.preprocess((val) => {
    const n = Number(String(val).replace(",", "."));
    return isNaN(n) ? undefined : n;
  }, z.number().min(0.000001, "Consumption must be a number greater than 0")),

  // Dias:
  // - Converte para número
  // - Aceita apenas valores entre 1 e 31
  days: z.preprocess((val) => {
    const n = Number(val);
    return isNaN(n) ? undefined : n;
  }, z.number().min(1, "Days must be between 1 and 31").max(31, "Days must be between 1 and 31")),

  // Valor monetário:
  // - Normaliza vírgula para ponto
  // - Garante valor maior que zero
  value: z.preprocess((val) => {
    const n = Number(String(val).replace(",", "."));
    return isNaN(n) ? undefined : n;
  }, z.number().min(0.000001, "Value must be greater than 0")),

  // Status de pagamento
  paid: z.boolean(),

  // Endereço da conta
  address: z.string().min(1, "Address is required"),

  // Ano da conta
  year: z.string().min(1, "Year is required"),

  // Mês da conta
  month: z.string().min(1, "Month is required"),
});

// Tipo inferido automaticamente a partir do schema
type AccountFormData = z.infer<typeof accountSchema>;

/* ========================================================================
 * 📦 CONSTANTS
 * ------------------------------------------------------------------------
 * Valores iniciais do formulário.
 * Usado para:
 * - Reset
 * - Inicialização do React Hook Form
 * ====================================================================== */
const DEFAULT_FORM_VALUES = {
  accountType: "",
  consumption: "",
  days: "",
  value: "",
  paid: false,
  address: "",
  year: "",
  month: "",
};

/* ========================================================================
 * 🧱 COMPONENT
 * ====================================================================== */
export default function RegisterAccount() {
  /* --------------------------------------------------------------------
   * 🔌 EXTERNAL HOOKS
   * --------------------------------------------------------------------
   * Hooks de contexto e dados externos
   * ------------------------------------------------------------------ */
  const { user, token } = useAuth();
  const { setLoading } = useLoading();
  const { showToast } = useToast();

  // Hook responsável por buscar, armazenar e atualizar contas
  const { accounts, setAccounts, updatePaid } = useAccounts(user?.email);

  // Hook que deriva filtros, totais e listas a partir das contas
  const summary = useAccountSummary(accounts);

  /* --------------------------------------------------------------------
   * 🧠 STATE
   * ------------------------------------------------------------------ */
  // Conta em modo de edição (null = criação)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  // Controle de paginação
  const [startIndex, setStartIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  // Controle dos modais
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // Conta selecionada para exclusão
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  /* --------------------------------------------------------------------
   * 📌 REFS
   * --------------------------------------------------------------------
   * Referências para selects customizados
   * Usadas para limpar seleção imperativamente
   * ------------------------------------------------------------------ */
  const yearFilterRef = useRef<SelectHandle>(null);
  const monthFilterRef = useRef<SelectHandle>(null);
  const typeFilterRef = useRef<SelectHandle>(null);
  const paidFilterRef = useRef<SelectHandle>(null);

  const yearFormRef = useRef<SelectHandle>(null);
  const monthFormRef = useRef<SelectHandle>(null);
  const typeFormRef = useRef<SelectHandle>(null);

  /* --------------------------------------------------------------------
   * 🧮 DERIVED STATE
   * --------------------------------------------------------------------
   * Contas filtradas + paginadas
   * Memoriza para evitar renders desnecessários
   * ------------------------------------------------------------------ */
  const paginatedAccounts = useMemo(() => {
    return summary.filteredAccounts.slice(startIndex, startIndex + pageSize);
  }, [summary.filteredAccounts, startIndex, pageSize]);

  /* --------------------------------------------------------------------
   * 📝 FORM (React Hook Form + Zod)
   * ------------------------------------------------------------------ */
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<z.input<typeof accountSchema>, unknown, AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onBlur",
  });

  // Observa valor do campo "paid" para UI reativa
  const paidValue = watch("paid");

  /* --------------------------------------------------------------------
   * 🧹 HELPERS (SRP)
   * ------------------------------------------------------------------ */

  // Carrega contas do backend
  const loadAccounts = useCallback(async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
      const response = await getAccounts(user.email);
      if (response.success && response.data) {
        setAccounts(response.data);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.email, setAccounts, setLoading]);

  // Limpa selects do formulário
  const clearFormSelects = () => {
    yearFormRef.current?.clearSelection();
    monthFormRef.current?.clearSelection();
    typeFormRef.current?.clearSelection();
  };

  // Limpa selects dos filtros
  const clearFilterSelects = () => {
    yearFilterRef.current?.clearSelection();
    monthFilterRef.current?.clearSelection();
    typeFilterRef.current?.clearSelection();
    paidFilterRef.current?.clearSelection();
  };

  // Fecha modal de formulário e reseta estado
  const closeFormModal = () => {
    setFormModalOpen(false);
    setEditingAccount(null);
    reset(DEFAULT_FORM_VALUES);
    clearFormSelects();
  };

  // Reseta apenas o formulário
  const resetForm = () => {
    reset(DEFAULT_FORM_VALUES);
    setValue("paid", false);
    clearFormSelects();
  };

  // Abre formulário em modo edição
  const openEditForm = (account: Account) => {
    setEditingAccount(account);

    reset({
      address: account.address,
      accountType: account.accountType,
      consumption: account.consumption,
      days: account.days,
      value: account.value,
      paid: account.paid,
      year: String(account.year),
      month: account.month.split("/")[0],
    });

    setFormModalOpen(true);
  };

  /* --------------------------------------------------------------------
   * 🎯 HANDLERS
   * ------------------------------------------------------------------ */
  const handleEdit = (account: Account) => {
    openEditForm(account);
  };

  const handleDeleteClick = (account: Account) => {
    setAccountToDelete(account);
    setDeleteModalOpen(true);
  };

  // Limpa filtros e estados derivados
  const clearFilters = () => {
    clearFilterSelects();

    summary.setSelectedYear("");
    summary.setSelectedMonth("");
    summary.setSelectedType("");
    summary.setSelectedPaid("");
  };

  /* --------------------------------------------------------------------
   * 🔄 EFFECTS
   * ------------------------------------------------------------------ */

  // Carrega contas ao iniciar ou trocar usuário
  useEffect(() => {
    loadAccounts();
  }, [user?.email, loadAccounts]);

  // Reseta paginação ao mudar filtros
  useEffect(() => {
    setStartIndex(0);
  }, [summary.filteredAccounts]);

  /* --------------------------------------------------------------------
   * 📩 SUBMIT
   * ------------------------------------------------------------------ */
  const onSubmit = async (data: AccountFormData) => {
    if (!user?.id || !user?.email) return;

    setLoading(true, editingAccount ? "Updating..." : "Saving...");

    try {
      if (editingAccount) {
        // Atualização
        const response = await updateAccount(
          editingAccount.id,
          {
            ...data,
            year: Number(data.year),
            month: normalizeMonth(data.month, data.year),
          },
          token!
        );

        if (response.success) {
          await loadAccounts();
          showToast({
            type: "success",
            title: "Account updated!",
            text: response.message,
          });
        } else {
          showToast({ type: "error", text: response.message });
        }
      } else {
        // Criação
        const response = await registerAccount(
          {
            userId: user.id,
            userEmail: user.email,
            ...data,
          },
          token!
        );

        if (response.success) {
          await loadAccounts();
          showToast({
            type: "success",
            title: "Account added",
            text: response.message,
          });
        } else {
          showToast({ type: "error", text: response.message });
        }
      }

      resetForm();
      closeFormModal();
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

  /* --------------------------------------------------------------------
   * 🗑️ Confirma exclusão
   * ------------------------------------------------------------------ */
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
                resetForm(); // apenas form
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
        onPageChange={({ startIndex, itemsPerPage }) => {
          setStartIndex(startIndex);
          setPageSize(itemsPerPage);
        }}
      />

      {/* --------------------------------------------------------
      📝 MODAL DE FORMULÁRIO (CRIAR/EDITAR)
      -------------------------------------------------------- */}
      <Modal
        isOpen={isFormModalOpen}
        variant="default"
        onClose={closeFormModal}
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
                options={YEAR_OPTIONS}
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
                options={MONTH_OPTIONS}
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
                options={ACCOUNT_TYPE_OPTIONS}
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
                onClick={closeFormModal}
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
