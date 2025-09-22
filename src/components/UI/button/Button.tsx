import type { JSX } from "react";
import { Component } from "react";
import type { ButtonProps } from "./Button.types";
import classNames from "classnames";

export class Button extends Component<ButtonProps> {
  static defaultProps = {
    text: "New Button",
    disabled: false,
    type: "button",
  };

  render(): JSX.Element {
    const { text, disabled, type, onClick } = this.props;

    const buttonClass = classNames(
      "w-full bg-greenLight text-md text-dark w-full p-2 rounded font-bold",
      {
        "transition-transform active:scale-95 hover:bg-greenMid": !disabled,
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
        {text}
      </button>
    );
  }
}
