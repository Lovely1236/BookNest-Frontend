// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const classNames = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
};

export const generatePlaceholderCover = (title: string): string => {
  const colors = ['3b82f6', '8b5cf6', 'f97316', '10b981', 'ef4444', 'f59e0b'];
  const colorIndex = title.charCodeAt(0) % colors.length;
  const color = colors[colorIndex];
  const initials = title.substring(0, 2).toUpperCase();
  return `https://via.placeholder.com/200x300/${color}/ffffff?text=${encodeURIComponent(initials)}`;
};
