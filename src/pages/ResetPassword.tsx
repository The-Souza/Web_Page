import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Title,
  AuthForm,
  AuthLinkButton,
  AuthLinksContainer,
} from "../components";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { checkUserExists, resetPassword } from "../utils/Auth";

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
    path: ["confirmNewPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function RememberPassword() {
  const navigate = useNavigate();
  const [userExists, setUserExists] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Observa o campo de email
  const emailValue = watch("email");

  useEffect(() => {
    const checkEmail = async () => {
      if (emailValue) {
        const exists = await checkUserExists(emailValue);
        setUserExists(exists);
      } else {
        setUserExists(false);
      }
    };
    checkEmail();
  }, [emailValue]);

  const onSubmit = async (data: FormData) => {
    const success = await resetPassword(data.email, data.newPassword);
    if (success) {
      alert("✅ Password changed successfully!");
      navigate("/"); // volta para login
    } else {
      alert("❌ Email not found");
    }
  };

  return (
    <AuthForm onSubmit={handleSubmit(onSubmit)}>
      <Title text="Change Password" size="2xl" />

      <Input
        {...register("email")}
        placeholder="Email"
        error={errors.email?.message}
      />

      <Input
        {...register("newPassword")}
        placeholder="New Password"  
        type="password"
        error={errors.newPassword?.message}
        disabled={!userExists}
      />

      <Input
        {...register("confirmNewPassword")}
        placeholder="Confirm New Password"
        type="password"
        error={errors.confirmNewPassword?.message}
        disabled={!userExists}
      />

      <Button text="Change Password" type="submit" disabled={!userExists} />

      <AuthLinksContainer>
        <AuthLinkButton text="Back to Login" to="/" />
      </AuthLinksContainer>
    </AuthForm>
  );
}
