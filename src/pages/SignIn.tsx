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
import { loginUser } from "../utils/Auth";

const schema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),
  password: z.string().nonempty("Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function SignIn() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const success = await loginUser(data.email, data.password);
    if (success) {
      alert("✅ User logged in successfully!");
      navigate("/"); // depois você pode trocar para dashboard
    } else {
      alert("❌ Invalid email or password");
    }
  };

  return (
    <AuthForm onSubmit={handleSubmit(onSubmit)}>
      <Title text="Login" size="2xl" />

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

      <Button text="Sign in" type="submit" />

      <AuthLinksContainer>
        <AuthLinkButton text="Create account" to="/signup" />
        <AuthLinkButton text="Forgot password?" to="/remember-password" />
      </AuthLinksContainer>
    </AuthForm>
  );
}
