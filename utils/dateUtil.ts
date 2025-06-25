import {isThisMonth, isThisWeek, isThisYear, isToday, parseISO} from 'date-fns';

export const formatTime = (seconds: number | null) => {
  if (seconds == null) {
    return '-';
  }
  const minutes = Math.floor(seconds / 60);
  const totalSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${totalSeconds
    .toString()
    .padStart(2, '0')}`;
};

export function isInTimeRange(dateStr: string, range: string): boolean {
  const date = parseISO(dateStr);

  switch (range) {
    case 'today':
      return isToday(date);
    case 'week':
      return isThisWeek(date, {weekStartsOn: 1}); // ISO week (starts Monday)
    case 'month':
      return isThisMonth(date);
    case 'year':
      return isThisYear(date);
    case 'all':
    default:
      return true;
  }
}

export function formatShortChartDate(dateStr: string, locale?: string): string {
  const date = new Date(dateStr);
  const systemLocale = locale || Intl.DateTimeFormat().resolvedOptions().locale;
  const shortLocale = systemLocale.split('-')[0]; // e.g. "en-US" -> "en"

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  const ddmmLocales = ['vi', 'ja', 'fr', 'de', 'es'];

  if (ddmmLocales.includes(shortLocale)) {
    return `${day}/${month}`;
  } else {
    return `${month}/${day}`;
  }
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

export function pad(num: number): string {
  return num.toString().padStart(2, '0');
}
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
