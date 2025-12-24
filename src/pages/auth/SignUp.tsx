import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Title } from "@/components";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { registerUser } from "@/services";
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
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().nonempty("Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // 🔹 Mensagem de erro atrelada ao campo confirmPassword
  });
  
  type FormData = z.infer<typeof schema>;

  /**
   * SignUp
   * ------------------------------------------------------------
   * Componente de tela de cadastro de usuário.
   * - Utiliza React Hook Form para gerenciamento de formulário.
   * - Validação via Zod, incluindo confirmação de senha.
   * - Integra com serviço de registro (`registerUser`) para criação de usuário.
   * - Exibe feedback visual usando toast e loading.
   * - Redireciona para "/" (login) após cadastro bem-sucedido.
   */
  export default function SignUp() {
    const { showToast } = useToast(); // 🔹 Hook para exibir toast
  const navigate = useNavigate(); // 🔹 Hook de navegação
  const { setLoading } = useLoading(); // 🔹 Hook para controle de loader

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

      // chamada de API para registro de usuário
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // exibe feedback visual via toast
      handleToastResponse(
        response,
        showToast,
        "User registered successfully!",
        "Registration Failed",
        "You can now log in with your credentials.",
        response.message
      );

      // redireciona para login caso o cadastro tenha sido bem-sucedido
      if (response.success) navigate("/");
    } finally {
      setLoading(false); // garante que loader será escondido
    }
  };

  return (
    <AuthForm onSubmit={handleSubmit(onSubmit)}>
      {/* Título da tela */}
      <Title text="Create Account" size="2xl" />

      {/* Campos do formulário */}
      <div className="flex flex-col w-full gap-2">
        <Input
          {...register("name")}
          label="Full Name"
          error={errors.name?.message}
        />

        <Input
          {...register("email")}
          label="Email:"
          type="email"
          error={errors.email?.message}
        />

        <Input
          {...register("password")}
          label="Password:"
          type="password"
          error={errors.password?.message}
        />

        <Input
          {...register("confirmPassword")}
          label="Confirm Password:"
          type="password"
          error={errors.confirmPassword?.message}
        />
      </div>

      {/* Botão de submit */}
      <Button text="Sign up" type="submit" size="full" variant="solid" />

      {/* Link para login */}
      <AuthLinksContainer>
        <AuthLinkButton text="Already have an account? Login" to="/" />
      </AuthLinksContainer>
    </AuthForm>
  );
}
