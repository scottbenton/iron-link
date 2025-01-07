export function filterObject<T>(
  obj: Record<string, T>,
  predicate: (value: T) => boolean,
) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => predicate(value)),
  );
}
