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
    "bg-dark shadow-greenLight rounded-lg flex flex-col p-8 sm:p-10 items-center justify-center gap-6 border-2 border-greenLight",
    {
      "w-full": isMobile,
      "w-[31.25rem]": !isMobile,
    }
  );

  return (
    <form onSubmit={onSubmit} className={formClass}>
      {children}
    </form>
  );
};
