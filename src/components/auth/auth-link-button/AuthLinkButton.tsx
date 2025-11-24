import { useNavigate } from "react-router-dom";
import type { JSX } from "react";
import type { AuthLinkButtonProps } from "./AuthLinkButton.types";
import classNames from "classnames";

export const AuthLinkButton = ({ text, to }: AuthLinkButtonProps): JSX.Element => {
  const navigate = useNavigate();
  const linkClass = classNames("text-greenLight text-sm hover:underline focus:underline focus:outline-none");

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className={linkClass}
    >
      {text}
    </button>
  );
};
