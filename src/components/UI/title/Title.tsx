import type { JSX } from "react";
import { Component } from "react";
import type { TitleProps } from "./Title.types";
import { TITLE_SIZE_VARIANTS, type TitleSize } from "./TitleSize.variants";
import classNames from "classnames";

export class Title extends Component<TitleProps> {
  static defaultProps = {
    text: "New Title",
    size: "md",
  };

  render(): JSX.Element {
    const { text, size } = this.props;
    const sizeKey: TitleSize = (size ?? Title.defaultProps.size) as TitleSize;
    const textSizeClass = TITLE_SIZE_VARIANTS[sizeKey];

    const titleClass = classNames(
      "font-extrabold font-[lato] text-greenLight",
      textSizeClass
    );

    return <h1 className={titleClass}>{text}</h1>;
  }
}
