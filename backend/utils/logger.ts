import chalk from "chalk"; 

/* 
  ==========================================================================
  FUNÇÕES DE ESTILIZAÇÃO  
  ==========================================================================
*/

function colorizeKey(key: string) {
  return chalk.yellow(key); 
  // Deixa as chaves (nomes de propriedades) amarelas.
}

function colorizeValue(value: unknown): string {
  if (typeof value === "string") return chalk.green(`"${value}"`);
  if (typeof value === "number") return chalk.green(String(value));
  if (typeof value === "boolean") return chalk.green(String(value));
  if (value === null) return chalk.green("null");

  return chalk.green(String(value));
}


/* 
  ==========================================================================
  IMPRESSÃO BONITA DE OBJETOS / JSON (pretty print)
  ========================================================================== 
*/

export function prettyPrint(obj: object, indent = 2, level = 0): string {
  const padding = " ".repeat(level * indent); // Recuo do nível atual
  const paddingInner = " ".repeat((level + 1) * indent); // Recuo interno

  // -----------------------------
  // Caso 1: o objeto é um array
  // -----------------------------
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]"; // Array vazio → retorno simples

    // Mostra somente os 2 primeiros itens se o array for grande
    const preview = obj.length === 1 ? obj : obj.slice(0, 2);

    // Processa cada item recursivamente
    const items = preview.map((item) => prettyPrint(item, indent, level + 1));

    return (
      "[" +
      "\n" +
      // Indenta cada item
      items.map((i) => paddingInner + i).join(",\n") +
      "\n" +
      padding +
      "]" +
      // Mostra aviso se o array for maior que 3 itens
      (obj.length > 3
        ? ` ${chalk.yellow(`\n(Showing ${preview.length} of ${obj.length})`)}`
        : "")
    );
  }

  // -----------------------------
  // Caso 2: o objeto é um objeto comum
  // -----------------------------
  else if (obj && typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, object>).map(
      ([key, value]) =>
        `${colorizeKey(key)}: ${prettyPrint(value, indent, level + 1)}`
        // Chave colorida + valor formatado recursivamente
    );

    return (
      "{" +
      "\n" +
      // Indenta cada linha
      entries.map((e) => paddingInner + e).join(",\n") +
      "\n" +
      padding +
      "}"
    );
  }

  // -----------------------------
  // Caso 3: valor primitivo
  // -----------------------------
  else {
    return colorizeValue(obj); // Cor aplicada ao valor simples
  }
}

/* 
  ==========================================================================
  LOGGER FORMATADO
  ==========================================================================
*/

export function logData(label: string, data: object) {
  // Gera timestamp formatado BR (24h)
  const timestamp = new Date().toLocaleString("pt-BR", { hour12: false });

  // Título do log
  console.log(chalk.cyan(`\n[${label}] - ${timestamp}`));

  // Imprime o objeto formatado com cores e recuo
  console.log(prettyPrint(data));
}

/* 
  ==========================================================================
  EXECUTOR DE ETAPAS (com título e captura de erro)
  ==========================================================================
*/

export async function runStep(title: string, fn: () => Promise<void>) {
  // Cabeçalho visual para organizar etapas no terminal
  console.log(
    `\n========================================\n${title}\n========================================`
  );

  try {
    // Executa a função assíncrona passada como “passo”
    await fn();

    // Sucesso
    console.log(chalk.green(`\n✅ ${title} completed successfully!\n`));
  } catch (err) {
    // Erro com destaque vermelho
    console.error(chalk.red(`\n❌ Error in ${title}:`), err);
    throw err; // Relança o erro para não silenciar
  }
}
