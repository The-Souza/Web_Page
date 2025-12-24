// Função utilitária simples para padronizar logs no frontend.
// Recebe uma descrição da ação e exibe no console com um prefixo visual.
export const logFrontend = (action: string) => {
  console.log(`✅ [${action}]`);
};
