import React from "react";

export const LoadingOverlay: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div
      role="status"
      aria-busy="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Fundo semi-transparente */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Ícone animado */}
        <i
          className="fa-solid fa-gear text-green-400"
          style={{
            fontSize: 64,
            animation: "spin 2000ms linear infinite",
            display: "block",
          }}
          aria-hidden="true"
        />

        {/* Pontinhos animados */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-3 h-3 bg-green-400 rounded-full"
              style={{
                animation: `loadingDots 900ms ${
                  i * 120
                }ms infinite ease-in-out`,
              }}
            />
          ))}
        </div>

        {/* Mensagem personalizada */}
        {message && (
          <div className="text-greenLight font-semibold">{message}</div>
        )}

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
