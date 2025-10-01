import chalk from "chalk";

function colorizeKey(key: string) {
  return chalk.yellow(key);
}

function colorizeValue(value: string) {
  if (typeof value === "string") return chalk.green(`"${value}"`);
  if (typeof value === "number") return chalk.green(value);
  if (typeof value === "boolean") return chalk.green(value);
  if (value === null) return chalk.green("null");
  return value;
}

export function prettyPrint(obj: object, indent = 2, level = 0): string {
  const padding = " ".repeat(level * indent);
  const paddingInner = " ".repeat((level + 1) * indent);

  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";

    const preview = obj.length === 1 ? obj : obj.slice(0, 2);
    const items = preview.map((item) => prettyPrint(item, indent, level + 1));

    return (
      "[" +
      "\n" +
      items.map((i) => paddingInner + i).join(",\n") +
      "\n" +
      padding +
      "]" +
      (obj.length > 3
        ? ` ${chalk.yellow(`\n(Showing ${preview.length} of ${obj.length})`)}`
        : "")
    );
  } else if (obj && typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, object>).map(
      ([key, value]) =>
        `${colorizeKey(key)}: ${prettyPrint(value, indent, level + 1)}`
    );
    return (
      "{" +
      "\n" +
      entries.map((e) => paddingInner + e).join(",\n") +
      "\n" +
      padding +
      "}"
    );
  } else {
    return colorizeValue(obj);
  }
}

export function logData(label: string, data: object) {
  const timestamp = new Date().toLocaleString("pt-BR", { hour12: false });
  console.log(chalk.cyan(`\n[${label}] - ${timestamp}`));
  console.log(prettyPrint(data));
}
