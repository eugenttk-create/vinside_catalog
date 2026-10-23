const FIELD_PRIORITY = new Map(
  ["code", "pic", "id", "series"].map((key, index) => [key, index]),
);

export function orderCatalogFields<T>(
  fields: readonly T[],
  getKey: (field: T) => string,
): T[] {
  const priority = (field: T) =>
    FIELD_PRIORITY.get(getKey(field).trim().toLowerCase()) ??
    FIELD_PRIORITY.size;

  return [...fields].sort((left, right) => priority(left) - priority(right));
}
