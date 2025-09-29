import { Component, type JSX } from "react";
import type { ButtonProps } from "./Button.types";
import classNames from "classnames";
import { BUTTON_ICONS } from "./ButtonIcons.variants";

export class Button extends Component<ButtonProps> {
  static defaultProps = {
    text: "",
    disabled: false,
    type: "button",
    size: "auto" as string | number,
    variant: "solid",
  };

  render(): JSX.Element {
    const {
      text,
      icon,
      disabled,
      type,
      size,
      variant = "solid",
      onClick,
    } = this.props;

    let sizeClass = "";
    if (!text && icon) {
      sizeClass =
        typeof size === "number"
          ? `w-[${size}rem]`
          : "min-w-[2.5rem] h-[2.5rem]";
    } else if (typeof size === "string") {
      switch (size) {
        case "auto":
          sizeClass = "w-auto";
          break;
        case "full":
          sizeClass = "w-full";
          break;
        default:
          sizeClass = size;
          break;
      }
    } else if (typeof size === "number") {
      sizeClass = `w-[${size}rem]`;
    }

    const buttonClass = classNames(
      "p-2 text-md rounded font-bold flex items-center justify-center gap-2",
      sizeClass,
      {
        "min-w-[3rem]": !text && icon,
        "bg-greenLight text-dark": variant === "solid",
        "bg-dark border-[0.2rem] border-greenLight text-greenLight":
          variant === "border",
        "text-greenLight text-md hover:underline": variant === "bottomless"
      },
      {
        "transition-transform active:scale-95 hover:bg-greenMid":
          !disabled && variant === "solid",
        "transition-transform active:scale-95 hover:bg-greenLight hover:text-dark":
          !disabled && variant === "border",
        "opacity-50 cursor-not-allowed": disabled,
      }
    );

    return (
      <button
        className={buttonClass}
        disabled={disabled}
        type={type}
        onClick={onClick}
      >
        {icon && BUTTON_ICONS[icon] && (
          <span className="flex items-center">{BUTTON_ICONS[icon]()}</span>
        )}
        {text}
      </button>
    );
  }
}
