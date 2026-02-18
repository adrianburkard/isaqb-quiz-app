/**
 * Interpolates placeholders in a string with provided values.
 * Supports {placeholder} syntax.
 *
 * @example
 * interpolate('Select {count} answers.', { count: 3 })
 * // Returns: 'Select 3 answers.'
 */
export function interpolate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = values[key];
    return value !== undefined ? String(value) : match;
  });
}
