import type { JSX } from "react";
import { Component } from "react";
import type { ButtonProps } from "./interface/ButtonInterface";
import classNames from "classnames";

export class Button extends Component<ButtonProps> {
  static defaultProps = {
    text: "New Button",
    disabled: false,
    type: "button",
  };

  render(): JSX.Element {
    const { text, disabled, type } = this.props;

    const buttonClass = classNames(
      "w-full bg-greenMid text-md text-dark w-full p-2 rounded font-bold", // base
      {
        "transition-transform active:scale-95 hover:bg-greenLight": !disabled, // habilitado
        "opacity-50 cursor-not-allowed": disabled, // desabilitado
      }
    );

    return (
      <button className={buttonClass} disabled={disabled} type={type}>
        {text}
      </button>
    );
  }
}
