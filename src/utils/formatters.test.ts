import { formatCurrency, formatDate, truncateText } from './formatters';

describe('formatters', () => {
  it('formats dates in a readable day-month-year format', () => {
    expect(formatDate('2024-01-05T12:00:00')).toBe('05 Jan 2024');
  });

  it('truncates long text with an ellipsis', () => {
    expect(truncateText('BookNest frontend testing', 8)).toBe('BookNest...');
  });

  it('formats currency in INR', () => {
    const formatted = formatCurrency(1234.5);
    expect(formatted).toContain('₹');
    expect(formatted).toContain('1,234.50');
  });
});
