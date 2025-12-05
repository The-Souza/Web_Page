
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Title } from "@/components";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { checkUserExists, resetPassword } from "@/services";
import { useToast } from "@/providers/hook/useToast";
import {
  AuthForm,
  AuthLinkButton,
  AuthLinksContainer,
} from "@/components/auth";
import { handleToastResponse } from "@/helpers/handleToastResponse";
import { useLoading } from "@/providers/hook/useLoading";

// 🔹 Schema de validação usando Zod
const schema = z
.object({
  email: z
  .string()
  .nonempty("Email is required")
  .email("Invalid email address"),
  newPassword: z
  .string()
  .nonempty("Password is required")
  .min(6, "Password must be at least 6 characters"),
  confirmNewPassword: z.string().nonempty("Confirm New Password is required"),
})
.refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"], // atribui erro ao campo confirmNewPassword
});

type FormData = z.infer<typeof schema>;

/**
 * ResetPassword
 * ------------------------------------------------------------
 * Componente de tela para redefinir a senha de um usuário.
 * Utiliza React Hook Form para gerenciamento de formulário, 
 * Zod para validação, e integra com serviços de API para checar 
 * usuário e redefinir senha. Inclui feedback visual via toast e loading.
 */
export default function ResetPassword() {
  const { showToast } = useToast(); // 🔹 Hook para mostrar mensagens toast
  const navigate = useNavigate(); // 🔹 Para navegação programática
  const [userExists, setUserExists] = useState(false); // 🔹 Estado para habilitar campos de senha
  const { setLoading } = useLoading(); // 🔹 Hook para controle de loading

  // 🔹 React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const emailValue = watch("email"); // 🔹 Observa mudanças no campo email

  // 🔹 Verifica se o usuário existe sempre que o email muda
  useEffect(() => {
    const checkEmail = async () => {
      if (!emailValue) return; // não faz nada se o email estiver vazio

      setLoading(true, "Checking user..."); // mostra loader

      try {
        const result = await checkUserExists(emailValue); // API

        setUserExists(result.data?.exists ?? false);

        // Exibe feedback visual via toast
        handleToastResponse(
          result,
          showToast,
          "User found",
          "User not found",
          "This email is registered",
          "This email is not registered"
        );
      } catch (err) {
        console.error("Error checking user:", err);
      } finally {
        setLoading(false); // garante que o loader vai sumir
      }
    };

    checkEmail();
  }, [emailValue, showToast, setLoading]);

  // 🔹 Função chamada ao enviar o formulário
  const onSubmit = async (data: FormData) => {
    setLoading(true); // inicia loader

    try {
      // simula delay
      await new Promise(res => setTimeout(res, 1000));
      
      // chama API para resetar senha
      const response = await resetPassword(data.email, data.newPassword);

      // feedback visual
      handleToastResponse(
        response,
        showToast,
        "Password changed successfully",
        "Error changing password",
        "You can now log in with your new password.",
        "The new password cannot be the same as your current password."
      );

      if (response.success) navigate("/"); // redireciona para login
    } finally {
      setLoading(false); // garante que o loader vai sumir
    }
  };

  return (
    <AuthForm onSubmit={handleSubmit(onSubmit)}>
      <Title text="Change Password" size="2xl" />

      <div className="flex flex-col w-full gap-2">
        {/* Campo de email */}
        <Input
          {...register("email")}
          label="Email:"
          error={errors.email?.message}
        />

        {/* Campo de nova senha */}
        <Input
          {...register("newPassword")}
          label="New Password:"
          type="password"
          error={errors.newPassword?.message}
          disabled={!userExists} // só habilita se usuário existe
        />

        {/* Campo de confirmação de senha */}
        <Input
          {...register("confirmNewPassword")}
          label="Confirm New Password:"
          type="password"
          error={errors.confirmNewPassword?.message}
          disabled={!userExists} // só habilita se usuário existe
        />
      </div>

      {/* Botão de submit */}
      <Button
        text="Change Password"
        type="submit"
        size="full"
        variant="solid"
        disabled={!userExists} // desabilita enquanto usuário não existe
      />

      {/* Links auxiliares */}
      <AuthLinksContainer>
        <AuthLinkButton text="Back to Login" to="/" />
      </AuthLinksContainer>
    </AuthForm>
  );
}
