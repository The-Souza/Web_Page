// Representa o resumo de um mês para exibição em gráficos.
// Inclui totais financeiros e porcentagens.
export type MonthSummary = {
  totalValue: number;        // Soma total de valores do mês
  paidValue: number;         // Soma das contas pagas
  unpaidValue: number;       // Soma das contas não pagas
  paidPercentage: number;    // Porcentagem do valor pago
  diffFromLastMonth: number; // Diferença percentual comparada ao mês anterior
};

// Representa uma conta completa registrada no sistema.
// Esses dados vêm geralmente do banco e são exibidos no frontend.
export type Account = {
  id: number;            // ID da conta
  userId: number;        // Relacionamento com o usuário dono da conta
  userEmail: string;     // E-mail do usuário para facilitar buscas
  address: string;       // Endereço associado à conta
  accountType: string;   // Tipo da conta (ex: energia, água, gás)
  year: number;          // Ano da leitura / cobrança
  month: string;         // Mês da leitura / cobrança
  consumption: number;   // Consumo (kWh, m³, etc.)
  days: number;          // Quantidade de dias da medição
  value: number;         // Valor em reais
  paid: boolean;         // Status de pagamento
};

// Resumo agrupado por tipo de conta (energia, água, gás...)
export type AccountTypeSummary = {
  type: string;          // Tipo da conta
  totalValue: number;    // Soma total dos valores deste tipo
  paidValue: number;     // Total pago deste tipo
  unpaidValue: number;   // Total não pago deste tipo
};

// Payload utilizado ao registrar uma nova conta no backend.
// Permite números como string para suportar inputs HTML.
export interface RegisterAccountPayload {
  userId: number;              // ID do usuário dono da conta
  userEmail: string;           // E-mail do usuário
  address: string;             // Endereço da unidade consumidora
  accountType: string;         // Tipo da conta
  year: string;                // Ano informado (string por ser input)
  month: string;               // Mês informado
  consumption: number | string;// Consumo inserido pelo usuário
  days: number | string;       // Dias de medição
  value: number | string;      // Valor total da conta
  paid: boolean;               // Status inicial de pagamento
}

// Toast item para contas, usado em notificações ou resumos rápidos.
export type AccountToastItem = {
  label: string;
  month: string;
};
