import classNames from "classnames";
import type { CardProps, CardIconKey } from "./Card.types";
import { CARD_ICONS } from "./Card.variants";
import { Title } from "@/components";

export function Card({
  title,
  value,
  emptyPlaceholder = "--",
  icon,
  className,
}: CardProps) {
  const isEmpty = value === undefined || value === null || value === "";

  let iconNode: React.ReactNode = null;
  
  if (typeof icon === "string") {
    const iconKey = icon as CardIconKey;
    iconNode = CARD_ICONS[iconKey]?.() ?? null;
  } else {
    iconNode = icon ?? null;
  }

  const baseClasses =
    "bg-dark flex flex-col gap-2 p-6 rounded-2xl border-2 border-greenLight";
  
  const textClass = classNames("font-lato font-bold text-lg text-white tracking-tight", {
    "opacity-60": isEmpty,
  });

  return (
    <div className={classNames(baseClasses, className)}>
      <div className="flex items-center justify-between">
        <Title text={title} size="xl"></Title>
        {iconNode && <span className="text-xl">{iconNode}</span>}
      </div>

      <div className={textClass}>{isEmpty ? emptyPlaceholder : value}</div>
    </div>
  );
}
