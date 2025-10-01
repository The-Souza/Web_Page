import type { JSX } from "react";
import type { AuthFormProps } from "./AuthForm.types";
import classNames from "classnames";
import { useMediaQuery } from "@/hooks/UseMediaQuery";

export const AuthForm = ({
  onSubmit,
  children,
}: AuthFormProps): JSX.Element => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const formClass = classNames(
    "bg-dark shadow-greenLight rounded-lg flex flex-col items-center justify-center gap-4",
    {
      "p-4 w-full": isMobile,
      "p-10 w-[31.25rem]": !isMobile,
    }
  );

  return (
    <form onSubmit={onSubmit} className={formClass}>
      {children}
    </form>
  );
};
