import { Component, type JSX } from "react";
import type { HeaderProps } from "./Header.types";
import classNames from "classnames";
import { Title } from "../title/Title";
import { Button } from "../button/Button";

export class Header extends Component<HeaderProps> {
  static defaultProps = {
    text: "Header Title",
    userName: "",
  };

  render(): JSX.Element {
    const { text, userName, onClick } = this.props;

    const headerClass = classNames(
      "fixed top-0 left-0 flex w-full h-auto justify-between items-center py-5 px-5 sm:px-10 z-50",
      "bg-dark shadow-md shadow-greenLight"
    );

    return (
      <header className={headerClass}>
        <div className="flex gap-2 sm:gap-4 items-center justify-center">
          <button className="cursor-pointer">
            <i className="fa-solid fa-bars text-greenLight fa-2xl"></i>
          </button>
          <img src="/icon.png" alt="Logo" className="w-10 h-10" />
          <Title text={text} size="3xl"></Title>
        </div>
        <div className="flex items-center gap-2">
          {userName && <span className="text-greenLight text-lg font-extrabold font-[lato]">{userName}</span>}
        <Button
          variant="border"
          icon="logout"
          size={"auto"}
          onClick={onClick}
          ></Button>
          </div>
      </header>
    );
  }
}
