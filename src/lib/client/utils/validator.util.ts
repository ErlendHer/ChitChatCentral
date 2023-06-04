
export function validateNotEmpty(value: string): string | null {
  if (value.length === 0) {
    return 'Cannot be empty';
  }
  return null;
};