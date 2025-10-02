import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormField, Title } from "@/components";
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

      <div className="flex flex-col w-full gap-2">
        <FormField
          {...register("name")}
          label="Full Name"
          error={errors.name?.message}
        />

        <FormField
          {...register("email")}
          label="Email:"
          type="email"
          error={errors.email?.message}
        />

        <FormField
          {...register("password")}
          label="Password:"
          type="password"
          error={errors.password?.message}
        />

        <FormField
          {...register("confirmPassword")}
          label="Confirm Password:"
          type="password"
          error={errors.confirmPassword?.message}
        />
      </div>

      <Button text="Sign up" type="submit" size="full" variant="solid" />

      <AuthLinksContainer>
        <AuthLinkButton text="Already have an account? Login" to="/" />
      </AuthLinksContainer>
    </AuthForm>
  );
}
