import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/UseAuth";
import { useToast } from "@/components/providers/useToast";
import { Input, Select, Button, Title } from "@/components";
import { registerAccount } from "@/services";

// -------------------- 🧠 Schema de validação --------------------
const accountSchema = z.object({
  accountType: z.string().min(1, "Account type is required"),
  consumption: z
    .union([z.string(), z.number()])
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Consumption must be a number greater than 0",
    }),
  days: z
    .union([z.string(), z.number()])
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 31,
      {
        message: "Days must be between 1 and 31",
      }
    ),
  value: z
    .union([z.string(), z.number()])
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Value must be greater than 0",
    }),
  paid: z.boolean(),
  address: z.string().min(1, "Address is required"),
  year: z.string().min(1, "Year is required"),
  month: z.string().min(1, "Month is required"),
});

type AccountFormData = z.infer<typeof accountSchema>;

// -------------------- 📅 Opções de Select --------------------
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

const monthOptions = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
].map((m) => ({
  label: m,
  value: m,
}));

// -------------------- 🧱 Componente principal --------------------
export default function RegisterAccount() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      paid: false,
    },
  });

  const paidValue = watch("paid");

  const onSubmit = async (data: AccountFormData) => {
    if (!user?.id || !user?.email) {
      showToast({
        type: "error",
        text: "User not found. Please log in again.",
      });
      return;
    }

    const payload = {
      ...data,
      userId: user.id,
      userEmail: user.email,
      month: `${data.month}/${data.year}`,
    };

    try {
      const response = await registerAccount(payload);
      if (response.success) {
        showToast({ type: "success", text: "Account registered successfully" });
        reset();
      } else {
        showToast({
          type: "error",
          text: response.message || "Error registering account",
        });
      }
    } catch {
      showToast({ type: "error", text: "Error registering account" });
    }
  };

  return (
    <div className="flex flex-col gap-4 text-greenLight">
      <Title text="Register Account" size="2xl" />

      {/* ---------- Seção: Cadastro Manual ---------- */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-dark p-10 rounded-2xl border-2 border-greenLight shadow-greenLight flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            label="Account Type"
            theme="dark"
            placeholder="Select account type"
            options={accountTypeOptions}
            onChange={(val) => setValue("accountType", val)}
            error={errors.accountType?.message}
          />

          <Input
            {...register("consumption", { valueAsNumber: true })}
            label="Consumption"
            theme="light"
            placeholder="Consumption in m³ or kWh"
            type="number"
            error={errors.consumption?.message}
            />

          <Input
            {...register("days", { valueAsNumber: true })}
            label="Days"
            theme="light"
            placeholder="Number of days"
            type="number"
            error={errors.days?.message}
          />

          <Input
            {...register("value", { valueAsNumber: true })}
            label="Value"
            placeholder="R$ 0,00"
            type="number"
            error={errors.value?.message}
          />

          {/* Pago / Não Pago */}
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

          <Input
            {...register("address")}
            theme="light"
            label="Address"
            placeholder="Ex: Rua XYZ, nº 123"
            error={errors.address?.message}
          />

          <Select
            label="Year"
            theme="light"
            placeholder="Select year"
            options={yearOptions}
            onChange={(val) => setValue("year", val)}
            error={errors.year?.message}
          />

          <Select
            label="Month"
            theme="light"
            placeholder="Select month"
            options={monthOptions}
            onChange={(val) => setValue("month", val)}
            error={errors.month?.message}
          />
        </div>

        {/* ---------- Botões ---------- */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end mt-4">
          <Button
            text="Reset"
            type="button"
            variant="border"
            onClick={() => reset()}
          />
          <Button text="Save" type="submit" variant="solid" size="auto" />
        </div>
      </form>

      {/* ---------- Seção futura: Upload Excel ---------- */}
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
