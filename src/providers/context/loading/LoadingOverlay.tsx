import type { LoadingOverlayProps } from "@/types/loadingOverdalay";

/**
 * LoadingOverlay
 * ------------------------------------------------------------
 * Componente que exibe um overlay de carregamento com:
 * - Fundo semi-transparente
 * - Ícone animado de engrenagem
 * - Pontinhos animados
 * - Mensagem opcional
 *
 * Props:
 * - message?: string → Mensagem exibida abaixo do ícone
 */
export function LoadingOverlay({ message }: LoadingOverlayProps) {

  return (
    <div
      role="status"           // Acessibilidade: indica que é um status de carregamento
      aria-busy="true"        // Acessibilidade: componente está carregando
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Fundo semi-transparente com blur */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Ícone animado de engrenagem */}
        <i
          className="fa-solid fa-gear text-green-400"
          style={{
            fontSize: 64,
            animation: "spin 2000ms linear infinite",
            display: "block",
          }}
          aria-hidden="true"
        />

        {/* Pontinhos animados abaixo do ícone */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-3 h-3 bg-green-400 rounded-full"
              style={{
                animation: `loadingDots 900ms ${i * 120}ms infinite ease-in-out`,
              }}
            />
          ))}
        </div>

        {/* Mensagem opcional abaixo dos pontinhos */}
        {message && (
          <div className="text-greenLight font-semibold">{message}</div>
        )}

        {/* Animações CSS */}
        <style>{`
          @keyframes loadingDots {
            0%, 80%, 100% { transform: translateY(0); opacity: .25; }
            40% { transform: translateY(-6px); opacity: 1; }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default LoadingOverlay;
