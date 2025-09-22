import chalk from "chalk";

export const logBackend = (action: string, data: object) => {
  const timestamp = new Date().toLocaleString("pt-BR", { hour12: false });

  console.log(chalk.blue(`\n[${action}] - ${timestamp}`));
  console.log(chalk.green(JSON.stringify(data, null, 2)));
  console.log("\n");
};
