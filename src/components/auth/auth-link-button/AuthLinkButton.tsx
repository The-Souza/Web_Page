import { useNavigate } from "react-router-dom";
import type { JSX } from "react";
import type { AuthLinkButtonProps } from "./AuthLinkButton.types";
import classNames from "classnames";
import { useLoading } from "@/providers";

/**
 * AuthLinkButton
 * ------------------------------------------------------------
 * Componente de botão que funciona como link para navegação de autenticação.
 * Mostra um loading ao navegar para a rota especificada.
 * 
 * Props:
 * - text: texto exibido no botão.
 * - to: rota para a qual o botão deve navegar ao ser clicado.
 */
export const AuthLinkButton = ({ text, to }: AuthLinkButtonProps): JSX.Element => {
  const navigate = useNavigate(); // hook do React Router para navegação
  const { setLoading } = useLoading(); // hook para controle de loading global

  /**
   * loading
   * ------------------------------------------------------------
   * Função assíncrona chamada ao clicar no botão.
   * - Ativa o loading com mensagem "Loading..."
   * - Aguarda 2 segundos (simula delay visual)
   * - Navega para a rota passada via props
   * - Desativa o loading ao final
   */
  const loading = async () => {
    setLoading(true, "Loading...");
    try {
      await new Promise(res => setTimeout(res, 2000));
      navigate(to);
    } finally {
      setLoading(false);
    }
  };

  const linkClass = classNames(
    "text-greenLight text-sm hover:underline focus:underline focus:outline-none"
  );

  return (
    <button
      type="button"
      onClick={loading} // chama função de loading e navegação ao clicar
      className={linkClass}
    >
      {text}
    </button>
  );
};
