import { handleToastResponse } from "@/helpers/handleToastResponse";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Title } from "@/components";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { loginUser } from "@/services";
import { useToast } from "@/providers/hook/useToast";
import {
  AuthForm,
  AuthLinkButton,
  AuthLinksContainer,
} from "@/components/auth";
import { useAuth } from "@/providers/hook/useAuth";
import { useLoading } from "@/providers/hook/useLoading";

// 🔹 Schema de validação usando Zod
const schema = z.object({
  email: z
  .string()
  .nonempty("Email is required")
  .email("Invalid email address"),
  password: z.string().nonempty("Password is required"),
});

type FormData = z.infer<typeof schema>;


/**
 * SignIn
 * ------------------------------------------------------------
 * Componente de tela de login. 
 * - Utiliza React Hook Form para gerenciamento de formulário.
 * - Validação via Zod.
 * - Integra com serviço de login (`loginUser`) para autenticação.
 * - Exibe feedback visual usando toast e loading.
 * - Redireciona para "/home" em caso de login bem-sucedido.
 */
export default function SignIn() {
  const { showToast } = useToast(); // 🔹 Hook para mostrar toast
  const navigate = useNavigate(); // 🔹 Hook de navegação
  const { login } = useAuth(); // 🔹 Hook de autenticação
  const { setLoading } = useLoading(); // 🔹 Hook para controlar loader

  // 🔹 Configuração do React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // 🔹 Função chamada ao enviar o formulário
  const onSubmit = async (data: FormData) => {
    setLoading(true); // mostra loader
    try {
      // simula delay
      await new Promise(res => setTimeout(res, 1000));
      
      // chamada de API para autenticação
      const response = await loginUser(data.email, data.password);

      // exibe feedback visual via toast
      handleToastResponse(
        response,
        showToast,
        "Login Successful",
        "Login Failed",
        `Welcome back, ${response.data?.user?.name || "user"}!`,
        response.message
      );

      // se login bem-sucedido, atualiza contexto de auth e redireciona
      if (response.success && response.data?.token) {
        login(response.data.token, response.data.user!);
        navigate("/home");
      }
    } finally {
      setLoading(false); // garante que loader será escondido
    }
  };

  return (
    <AuthForm onSubmit={handleSubmit(onSubmit)}>
      {/* Título da tela */}
      <Title text="Login" size="2xl" />

      {/* Campos de email e senha */}
      <div className="flex flex-col w-full gap-2">
        <Input
          {...register("email")}
          label="Email:"
          error={errors.email?.message}
        />

        <Input
          {...register("password")}
          label="Password:"
          type="password"
          error={errors.password?.message}
        />
      </div>

      {/* Botão de submit */}
      <Button text="Sign in" type="submit" size="full" variant="solid" />

      {/* Links auxiliares */}
      <AuthLinksContainer>
        <AuthLinkButton text="Create account" to="/signup" />
        <AuthLinkButton text="Forgot password?" to="/reset-password" />
      </AuthLinksContainer>
    </AuthForm>
  );
}
