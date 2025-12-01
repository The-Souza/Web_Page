/**
 * AuthLinkButtonProps
 * ------------------------------------------------------------
 * Interface de tipagem para o componente AuthLinkButton.
 * Define as props obrigatórias que o botão aceita:
 * 
 * - text: string
 *   Texto que será exibido no botão.
 * 
 * - to: string
 *   Caminho/rota para a qual o botão deve navegar ao ser clicado.
 */
export interface AuthLinkButtonProps {
  text: string;
  to: string;
}
