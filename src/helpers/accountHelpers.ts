import type { Account, MonthSummary } from "@/types/account.types";

/* -------------------------------------------------------------------------- */
/* 🧮 Funções utilitárias genéricas */
/* -------------------------------------------------------------------------- */

/**
 * Arredonda um número para 2 casas decimais de forma segura.
 * Adiciona Number.EPSILON para evitar erros de ponto flutuante.
 */
function roundTwo(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Soma os valores de uma lista de contas.
 * Permite aplicar uma condição opcional para filtrar quais contas somar.
 * 
 * @param accounts → lista de contas
 * @param predicate → função opcional para filtrar contas
 * @returns soma arredondada com 2 casas decimais
 */
function sumValues(accounts: Account[], predicate?: (acc: Account) => boolean): number {
  const filtered = predicate ? accounts.filter(predicate) : accounts;
  const total = filtered.reduce((acc, a) => acc + a.value, 0);
  return roundTwo(total);
}

/**
 * Retorna um array de valores únicos a partir de um array qualquer.
 */
function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

/* -------------------------------------------------------------------------- */
/* 📅 Helpers de datas */
/* -------------------------------------------------------------------------- */

/**
 * Retorna a string do mês anterior no formato MM/YYYY.
 * Útil para calcular diferenças entre meses.
 * 
 * Ex: "03/2025" → "02/2025"
 */
export function getPreviousMonth(month: string): string {
  const [m, y] = month.split("/").map(Number);
  const date = new Date(y, m - 2); // subtrai 1 mês (0-based)
  const newMonth = (date.getMonth() + 1).toString().padStart(2, "0");
  const newYear = date.getFullYear();
  return `${newMonth}/${newYear}`;
}

/**
 * Retorna todos os anos disponíveis nos dados.
 * Útil para filtros de anos ou geração de relatórios.
 */
export function getAvailableYears(accounts: Account[]): string[] {
  const years = accounts.map((a) => a.year.toString());
  return unique(years);
}

/**
 * Retorna todos os meses disponíveis para um ano específico no formato MM/YYYY.
 * Ordena do mês mais antigo para o mais recente.
 */
export function getMonthsByYear(accounts: Account[], year: string): string[] {
  const months = accounts
    .filter((a) => a.year.toString() === year)
    .map((a) => a.month);

  // Ordena primeiro pelo ano, depois pelo mês
  return unique(months).sort((a, b) => {
    const [ma, ya] = a.split("/").map(Number);
    const [mb, yb] = b.split("/").map(Number);
    return ya === yb ? ma - mb : ya - yb;
  });
}

/* -------------------------------------------------------------------------- */
/* 💰 Cálculos financeiros */
/* -------------------------------------------------------------------------- */

/**
 * Objeto padrão para quando não há dados de resumo do mês.
 * Evita undefined e permite cálculos seguros mesmo sem contas.
 */
export const emptySummary: MonthSummary = {
  totalValue: 0,
  paidValue: 0,
  unpaidValue: 0,
  paidPercentage: 0,
  diffFromLastMonth: 0,
};

/**
 * Calcula o resumo financeiro de um mês específico.
 *
 * ⚡ Relacionamento:
 * - totalValue → soma de todos os valores do mês
 * - paidValue → soma dos valores marcados como pagos
 * - unpaidValue → diferença entre total e pagos
 * - paidPercentage → percentual de contas pagas
 * - diffFromLastMonth → pode ser calculado usando getDiffFromLastMonth
 * 
 * @param accounts → lista de contas
 * @param month → mês desejado
 * @returns MonthSummary com totais, pagos, não pagos e percentual
 */
export function computeMonthSummary(accounts: Account[], month: string): MonthSummary {
  const monthAccounts = accounts.filter((acc) => acc.month === month);

  if (monthAccounts.length === 0) return emptySummary;

  const totalValue = sumValues(monthAccounts);
  const paidValue = sumValues(monthAccounts, (a) => a.paid);
  const unpaidValue = roundTwo(totalValue - paidValue);
  const paidPercentage = totalValue > 0 ? roundTwo((paidValue / totalValue) * 100) : 0;

  return {
    totalValue: roundTwo(totalValue),
    paidValue: roundTwo(paidValue),
    unpaidValue,
    paidPercentage,
    diffFromLastMonth: 0, // será preenchido com getDiffFromLastMonth
  };
}

/**
 * Calcula a diferença do total entre o mês atual e o anterior.
 * ⚡ Relacionamento:
 * - Recebe dois MonthSummary
 * - Atualiza diffFromLastMonth para exibir evolução financeira
 */
export function getDiffFromLastMonth(current: MonthSummary, previous: MonthSummary): number {
  return roundTwo(current.totalValue - previous.totalValue);
}

/**
 * Calcula resumo agrupado por tipo de conta (ex: "Receita", "Despesa").
 * ⚡ Relacionamento:
 * - Permite detalhar cada tipo de conta dentro de um mês
 * - Pode ser usado em gráficos ou relatórios detalhados
 *
 * @param accounts → lista de contas
 * @param month → mês desejado
 * @returns array de objetos: tipo, totalValue, paidValue, unpaidValue
 */
export function computeAccountTypeSummary(accounts: Account[], month: string) {
  const monthAccounts = accounts.filter((acc) => acc.month === month);
  const types = unique(monthAccounts.map((a) => a.accountType));

  return types.map((type) => {
    const filtered = monthAccounts.filter((a) => a.accountType === type);
    const totalValue = sumValues(filtered);
    const paidValue = sumValues(filtered, (a) => a.paid);
    const unpaidValue = roundTwo(totalValue - paidValue);

    return { type, totalValue: roundTwo(totalValue), paidValue: roundTwo(paidValue), unpaidValue };
  });
}

/* -------------------------------------------------------------------------- */
/* 💵 Formatação de valores */
/* -------------------------------------------------------------------------- */

/**
 * Formata um número como moeda brasileira (BRL).
 * ⚡ Relacionamento:
 * - Útil para exibir totais, pagos e não pagos de MonthSummary ou AccountTypeSummary
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
