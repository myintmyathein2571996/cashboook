import {
  format,
  isToday,
  isYesterday,
  parseISO,
  startOfMonth,
  endOfMonth,
} from 'date-fns';

export function toDateString(date: Date = new Date()): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDisplayDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d');
}

export function getMonthRange(): { start: string; end: string } {
  const now = new Date();
  return {
    start: format(startOfMonth(now), 'yyyy-MM-dd'),
    end: format(endOfMonth(now), 'yyyy-MM-dd'),
  };
}
