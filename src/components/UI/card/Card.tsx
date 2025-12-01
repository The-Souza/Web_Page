import classNames from "classnames";
import type { CardProps, CardIconKey } from "./Card.types";
import { CARD_ICONS } from "./Card.variants";
import { Title } from "@/components";

/**
 * Card
 * ------------------------------------------------------------
 * Componente de cartão informativo.
 * Exibe título, valor e ícone opcional.
 */
export function Card({
  title,                // Título do cartão
  value,                // Valor a ser exibido
  emptyPlaceholder = "--", // Texto exibido se value for vazio
  icon,                 // Ícone: pode ser chave de CARD_ICONS ou JSX
  className,            // Classes adicionais do container
}: CardProps) {
  const isEmpty = value === undefined || value === null || value === ""; // Verifica valor vazio

  let iconNode: React.ReactNode = null;
  
  if (typeof icon === "string") {
    // Se for string, trata como chave de CARD_ICONS
    const iconKey = icon as CardIconKey;
    iconNode = CARD_ICONS[iconKey]?.() ?? null;
  } else {
    // Se for JSX, usa direto
    iconNode = icon ?? null;
  }

  // Classes base do container
  const baseClasses =
    "bg-dark flex flex-col gap-2 p-6 rounded-2xl border-2 border-greenLight";
  
  // Classes do valor
  const textClass = classNames("font-lato font-bold text-lg text-white tracking-tight", {
    "opacity-60": isEmpty, // valor vazio fica mais transparente
  });

  return (
    <div className={classNames(baseClasses, className)}>
      <div className="flex items-center justify-between">
        <Title text={title} size="xl"></Title>
        {iconNode && <span className="text-xl">{iconNode}</span>}
      </div>

      <div className={textClass}>
        {isEmpty ? emptyPlaceholder : value} {/* mostra valor ou placeholder */}
      </div>
    </div>
  );
}
