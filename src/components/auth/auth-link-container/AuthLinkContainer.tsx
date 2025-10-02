import type { JSX } from "react";
import type { AuthLinksContainerProps } from "./AuthLinkContainer.types";
import classNames from "classnames";
import { Children } from "react";

export const AuthLinksContainer = ({
  children,
  className,
}: AuthLinksContainerProps): JSX.Element => {
  const count = Children.count(children);

  const containerClass = classNames(
    "flex gap-2 w-full text-greenLight text-md",
    {
      "justify-center": count === 1,
      "justify-between": count > 1,
    },
    className
  );

  return <div className={containerClass}>{children}</div>;
};
