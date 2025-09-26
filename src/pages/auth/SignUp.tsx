import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Title } from "@/components";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { registerUser } from "@/services";
import { useToast } from "@/components/providers/useToast";
import {
  AuthForm,
  AuthLinkButton,
  AuthLinksContainer,
} from "@/components/auth";
import { handleToastResponse } from "@/helpers/handleToastResponse";

const schema = z
  .object({
    name: z.string().nonempty("Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().nonempty("Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function SignUp() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const response = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    handleToastResponse(
      response,
      showToast,
      "User registered successfully!",
      "Registration Failed",
      "You can now log in with your credentials.",
      "Email already in use"
    );

    if (response.success) navigate("/");
  };

  return (
    <AuthForm onSubmit={handleSubmit(onSubmit)}>
      <Title text="Create Account" size="2xl" />

      <Input
        {...register("name")}
        placeholder="Full name"
        error={errors.name?.message}
      />
      <Input
        {...register("email")}
        placeholder="Email"
        error={errors.email?.message}
      />
      <Input
        {...register("password")}
        placeholder="Password"
        type="password"
        error={errors.password?.message}
      />
      <Input
        {...register("confirmPassword")}
        placeholder="Confirm Password"
        type="password"
        error={errors.confirmPassword?.message}
      />

      <Button text="Sign up" type="submit" size={"full"} variant="solid" />

      <AuthLinksContainer>
        <AuthLinkButton text="Already have an account? Login" to="/" />
      </AuthLinksContainer>
    </AuthForm>
  );
}
