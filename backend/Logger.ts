import chalk from "chalk";

export const logBackend = (action: string, data: object) => {
  const timestamp = new Date().toLocaleString("pt-BR", { hour12: false });

  console.log(chalk.blue(`\n[${action}] - ${timestamp}`)); // ação em azul
  console.log(chalk.green(JSON.stringify(data, null, 2)));   // dados em verde
  console.log("\n"); // separador
};
