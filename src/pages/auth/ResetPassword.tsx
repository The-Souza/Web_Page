import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Title } from "@/components";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { checkUserExists } from "@/services";
import { useToast } from "@/components/providers/useToast";
import {
  AuthForm,
  AuthLinkButton,
  AuthLinksContainer,
} from "@/components/auth";

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
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const emailValue = watch("email");

  useEffect(() => {
    const checkEmail = async () => {
      if (emailValue) {
        const exists = await checkUserExists(emailValue);
        setUserExists(exists);

        if (!exists) {
          showToast({
            type: "error",
            title: "User not found",
            text: "This email is not registered",
          });
        }
      }
    };
    checkEmail();
  }, [emailValue, showToast]);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(`http://localhost:5000/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.newPassword }),
      });
      const response = await res.json();

      if (res.ok) {
        showToast({
          type: "success",
          title: "Password changed successfully",
          text: "You can now log in with your new password.",
        });
        navigate("/");
      } else if (
        response.message === "New password cannot be the same as current"
      ) {
        showToast({
          type: "error",
          title: "New password invalid",
          text: "The new password cannot be the same as your current password.",
        });
      } else {
        showToast({
          type: "error",
          title: "Error changing password",
          text: response.message || "Please try again later.",
        });
      }
    } catch {
      showToast({
        type: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
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
