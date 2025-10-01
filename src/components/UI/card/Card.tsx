import type { CardProps } from "./Card.types";

export function Card({ title, value, emptyPlaceholder = "--" }: CardProps) {
  return (
    <div className="bg-dark text-white p-4 rounded-lg shadow flex flex-col gap-1">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-2xl font-bold">{value ?? emptyPlaceholder}</p>
    </div>
  );
}
