import { Component, type JSX } from "react";
import type { TitleProps } from "./Title.types";
import { TITLE_SIZE_VARIANTS, type TitleSize } from "./TitleSize.variants";
import classNames from "classnames";

/**
 * Title
 * ------------------------------------------------------------
 * Componente de título reutilizável.
 * Permite configurar o texto e o tamanho usando variantes predefinidas.
 */
export class Title extends Component<TitleProps> {
  // Props padrão caso não sejam fornecidas
  static defaultProps = {
    text: "New Title", // texto padrão
    size: "md", // tamanho médio como padrão
  };

  render(): JSX.Element {
    const { text, size } = this.props;

    // Garante que size seja um valor válido definido em TitleSize
    const sizeKey: TitleSize = (size ?? Title.defaultProps.size) as TitleSize;

    // Busca a classe de tamanho correspondente à variante
    const textSizeClass = TITLE_SIZE_VARIANTS[sizeKey];

    // Combina classes base com a classe de tamanho
    const titleClass = classNames(
      "font-extrabold font-raleway text-textColorHeader", // estilo base
      textSizeClass // tamanho específico
    );

    // Renderiza o título
    return <h1 className={titleClass}>{text}</h1>;
  }
}
