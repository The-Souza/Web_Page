import type { ReactNode } from "react";
import type { CardIconKey } from "./Card.types";

export const CARD_ICONS: Record<CardIconKey, () => ReactNode> = {
  money: () => <i className="fa-solid fa-dollar-sign fa-lg text-current" />,
  water: () => <i className="fa-solid fa-droplet fa-lg text-current" />,
  gas: () => <i className="fa-solid fa-fire-flame-simple fa-lg text-current" />,
  internet: () => <i className="fa-solid fa-wifi fa-lg text-current" />,
  energy: () => <i className="fa-solid fa-bolt fa-lg text-current" />,
};

export const ACCOUNT_TYPE_ICONS: Record<string, CardIconKey> = {
  Water: "water",
  Gas: "gas",
  Internet: "internet",
  Energy: "energy",
  Money: "money",
};
