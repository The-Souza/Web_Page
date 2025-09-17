import type { JSX } from "react";
import type { AuthFormProps } from "./AuthForm.types";
import classNames from "classnames";

export const AuthForm = ({
  onSubmit,
  children,
}: AuthFormProps): JSX.Element => {
  const formClass = classNames(
    "bg-dark shadow-greenLight rounded-lg p-6 sm:p-10 w-full sm:w-[31.25rem] h-auto flex flex-col items-center justify-center gap-4"
  );

  return (
    <form onSubmit={onSubmit} className={formClass}>
      {children}
    </form>
  );
};
