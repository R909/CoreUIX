// Recursively merges two plain objects.

// Checks if a value is a plain object (not an array, null, or a class instance).
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

// Merges source into target; if both sides have a plain object for the same key, merges recursively.
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Record<string, unknown>,
): T {
  const result: Record<string, unknown> = { ...target };

  Object.entries(source).forEach(([key, sourceValue]: [string, unknown]) => {
    const targetValue: unknown = result[key];

    result[key] =
      isPlainObject(targetValue) && isPlainObject(sourceValue)
        ? deepMerge(targetValue, sourceValue)
        : sourceValue;
  });

  return result as T;
}
