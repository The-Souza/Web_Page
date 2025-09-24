import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Title } from "@/components";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { checkUserExists, resetPassword } from "@/services";
import { useToast } from "@/components/providers/useToast";
import {
  AuthForm,
  AuthLinkButton,
  AuthLinksContainer,
} from "@/components/auth";
import { handleToastResponse } from "@/helpers/handleToastResponse";

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

export default function ResetPassword() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [userExists, setUserExists] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const emailValue = watch("email");

  useEffect(() => {
    const checkEmail = async () => {
      if (emailValue) {
        const result = await checkUserExists(emailValue);
        setUserExists(result.exists ?? false);

        if (!result.success) {
          showToast({
            type: "error",
            title: "User not found",
            text: result.message || "This email is not registered",
          });
        }
      }
    };
    checkEmail();
  }, [emailValue, showToast]);

  const onSubmit = async (data: FormData) => {
    const response = await resetPassword(data.email, data.newPassword);

    handleToastResponse(
      response,
      showToast,
      "Password changed successfully",
      "Error changing password",
      "You can now log in with your new password.",
      "The new password cannot be the same as your current password."
    );

    if (response.success) navigate("/");
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
