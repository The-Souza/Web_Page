import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormField, Title } from "@/components";
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
        setUserExists(result.exists);

        handleToastResponse(
          result,
          showToast,
          "User found",
          "User not found",
          "This email is registered",
          "This email is not registered"
        );
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

      <div className="flex flex-col w-full gap-2">
        <FormField
          {...register("email")}
          label="Email:"
          error={errors.email?.message}
        />

        <FormField
          {...register("newPassword")}
          label="New Password:"
          type="password"
          error={errors.newPassword?.message}
          disabled={!userExists}
        />

        <FormField
          {...register("confirmNewPassword")}
          label="Confirm New Password:"
          type="password"
          error={errors.confirmNewPassword?.message}
          disabled={!userExists}
        />
      </div>

      <Button
        text="Change Password"
        type="submit"
        size="full"
        variant="solid"
        disabled={!userExists}
      />

      <AuthLinksContainer>
        <AuthLinkButton text="Back to Login" to="/" />
      </AuthLinksContainer>
    </AuthForm>
  );
}
