import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormField, Title } from "@/components";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { loginUser } from "@/services";
import { useToast } from "@/components/providers/useToast";
import {
  AuthForm,
  AuthLinkButton,
  AuthLinksContainer,
} from "@/components/auth";
import { handleToastResponse } from "@/helpers/handleToastResponse";
import { useAuth } from "@/hooks/UseAuth";

const schema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),
  password: z.string().nonempty("Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function SignIn() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const response = await loginUser(data.email, data.password);

    handleToastResponse(
      response,
      showToast,
      "Login Successful",
      "Login Failed",
      `Welcome back, ${response.user?.name || "user"}!`,
      "Invalid email or password"
    );

    if (response.success) {
      login(response.user?.id?.toString() || "true", response.user!);
      navigate("/home");
    }
  };

  return (
    <AuthForm onSubmit={handleSubmit(onSubmit)}>
      <Title text="Login" size="2xl" />

      <div className="flex flex-col w-full gap-2">
        <FormField
          {...register("email")}
          label="Email:"
          error={errors.email?.message}
        />

        <FormField
          {...register("password")}
          label="Password:"
          type="password"
          error={errors.password?.message}
        />
      </div>

      <Button text="Sign in" type="submit" size="full" variant="solid" />

      <AuthLinksContainer>
        <AuthLinkButton text="Create account" to="/signup" />
        <AuthLinkButton text="Forgot password?" to="/reset-password" />
      </AuthLinksContainer>
    </AuthForm>
  );
}
