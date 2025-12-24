/**
 * Remove propriedades específicas de um objeto e retorna um novo objeto sem elas.
 * 
 * 🔍 Para que serve?
 * - Útil quando precisamos retornar um objeto público sem campos sensíveis
 *   (ex: remover password, tokens, timestamps, etc.)
 * - Mantém imutabilidade: não altera o objeto original
 * 
 * @param obj  Objeto de entrada
 * @param keys Lista de chaves a serem removidas
 * @returns Um novo objeto sem os campos informados
 */
export function omitFields<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  // Cria uma cópia rasa do objeto original (evita mutação)
  const clone = { ...obj };

  // Remove cada chave solicitada
  for (const key of keys) {
    delete clone[key];
  }

  return clone;
}
