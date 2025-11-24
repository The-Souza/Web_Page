import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/UseAuth";
import { useToast } from "@/components/providers/hook/useToast";
import { Input, Select, Button, Title } from "@/components";
import { registerAccount } from "@/services";
import { useLoading } from "@/components/providers/hook/useLoading";
import type { SelectHandle } from "@/components/UI/select/Select.types";
import type { RegisterAccountPayload } from "@/types/account.types";

// -------------------- 🧠 Validation Schema --------------------
const accountSchema = z.object({
  accountType: z.string().min(1, "Account type is required"),

  consumption: z.preprocess((val) => {
    const n = Number(val);
    return isNaN(n) ? undefined : n;
  }, z.number().min(0.000001, "Consumption must be a number greater than 0")),

  days: z.preprocess((val) => {
    const n = Number(val);
    return isNaN(n) ? undefined : n;
  }, z.number().min(1, "Days must be between 1 and 31").max(31, "Days must be between 1 and 31")),

  value: z.preprocess((val) => {
    const n = Number(val);
    return isNaN(n) ? undefined : n;
  }, z.number().min(0.000001, "Value must be greater than 0")),

  paid: z.boolean(),
  address: z.string().min(1, "Address is required"),
  year: z.string().min(1, "Year is required"),
  month: z.string().min(1, "Month is required"),
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

// -------------------- 🧱 Main Component --------------------
export default function RegisterAccount() {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const { setLoading } = useLoading();

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

  // Tipagem do useForm adaptada para o Zod pre-processado
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

  // ---- refs para os selects ----
  const yearSelectRef = useRef<SelectHandle>(null);
  const monthSelectRef = useRef<SelectHandle>(null);
  const accountTypeSelectRef = useRef<SelectHandle>(null);

  // ---- envio de formulário ----
  const onSubmit = async (data: AccountFormData) => {
    if (!user?.id || !user?.email) {
      showToast({
        type: "error",
        text: "User not found. Please log in again.",
      });
      return;
    }

    setLoading(true, "Saving Account...");
    try {
      // Incluindo userId e userEmail no payload
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

      if (!token) {
        console.error("User not authenticated.");
        return;
      }

      const response = await registerAccount(payload, token);

      if (response.success) {
        showToast({
          type: "success",
          text: "Account registered successfully",
        });

        // Reset geral: inputs + radio + selects
        reset(defaultValues);
        yearSelectRef.current?.clearSelection();
        monthSelectRef.current?.clearSelection();
        accountTypeSelectRef.current?.clearSelection();

        setValue("year", "");
        setValue("month", "");
        setValue("accountType", "");
        setValue("paid", false);

        // Aqui você poderia atualizar localmente a lista de contas do usuário, se houver
        // ex: setAccounts(prev => [...prev, response.account]);
      } else {
        showToast({
          type: "error",
          text: response.message || "Error registering account",
        });
      }
    } catch (err) {
      console.error("❌ Error registering account:", err);
      showToast({ type: "error", text: "Error registering account" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 text-greenLight">
      <Title text="Register Account" size="2xl" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-dark p-8 sm:p-10 rounded-2xl border-2 border-greenLight flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            value={watch("year") || ""}
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
            value={watch("month") || ""}
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
            value={watch("accountType") || ""}
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

        {/* ----- Buttons ----- */}
        <div className="w-full sm:w-[20rem] flex flex-col sm:flex-row gap-3 self-end">
          <Button
            text="Reset"
            type="button"
            variant="solid"
            size="full"
            onClick={() => {
              reset(defaultValues);
              yearSelectRef.current?.clearSelection();
              monthSelectRef.current?.clearSelection();
              accountTypeSelectRef.current?.clearSelection();

              setValue("year", "");
              setValue("month", "");
              setValue("accountType", "");
              setValue("paid", false);
            }}
          />
          <Button text="Save" type="submit" variant="solid" size="full" />
        </div>
      </form>

      <section className="mt-8 border-t border-greenMid pt-6">
        <Title text="Upload Excel (coming soon...)" size="lg" />
        <p className="text-greenMid font-lato">
          Soon you’ll be able to import multiple accounts from a spreadsheet
          here.
        </p>
      </section>
    </div>
  );
}
