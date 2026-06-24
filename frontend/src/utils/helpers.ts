export function formatDistance(km: number): string {
  if (km === undefined || km === null || isNaN(km)) return 'N/A';
  if (km >= 1000) return `${(km / 1000).toFixed(1)}k km`;
  return `${Math.round(km)} km`;
}

export function formatDuration(minutes: number): string {
  if (minutes === undefined || minutes === null || isNaN(minutes)) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} mins`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatCurrency(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return 'N/A';
  return `\u20B9${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatDate(date: string | Date): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateInput(date: string | Date): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

export function getInitials(name: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength) + '...';
}

export function getRandomColor(): string {
  const colors = [
    '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getCityCode(cityName: string): string {
  const cityCodes: Record<string, string> = {
    'mumbai': 'BOM',
    'delhi': 'DEL',
    'bangalore': 'BLR',
    'bengaluru': 'BLR',
    'hyderabad': 'HYD',
    'chennai': 'MAA',
    'kolkata': 'CCU',
    'ahmedabad': 'AMD',
    'pune': 'PNQ',
    'jaipur': 'JAI',
    'lucknow': 'LKO',
    'goa': 'GOI',
    'kochi': 'COK',
    'chandigarh': 'IXC',
    'guwahati': 'GAU',
    'indore': 'IDR',
    'bhubaneswar': 'BBI',
    'nagpur': 'NAG',
    'srinagar': 'SXR',
    'varanasi': 'VNS',
    'patna': 'PAT',
    'thiruvananthapuram': 'TRV',
    'calicut': 'CCJ',
    'visakhapatnam': 'VTZ',
  };
  return cityCodes[cityName.toLowerCase().trim()] || cityName.slice(0, 3).toUpperCase();
}

export function getWeatherEmoji(condition: string): string {
  const map: Record<string, string> = {
    'clear': '\u2600\uFE0F',
    'clouds': '\u2601\uFE0F',
    'rain': '\uD83C\uDF27\uFE0F',
    'drizzle': '\uD83C\uDF26\uFE0F',
    'thunderstorm': '\u26C8\uFE0F',
    'snow': '\u2744\uFE0F',
    'mist': '\uD83C\uDF2B\uFE0F',
    'fog': '\uD83C\uDF2B\uFE0F',
    'haze': '\uD83C\uDF2B\uFE0F',
    'smoke': '\uD83C\uDF2B\uFE0F',
    'dust': '\uD83C\uDF2A\uFE0F',
    'sand': '\uD83C\uDF2A\uFE0F',
    'tornado': '\uD83C\uDF2A\uFE0F',
    'squall': '\uD83D\uDCA8',
  };
  return map[condition.toLowerCase()] || '\uD83C\uDF24\uFE0F';
}

export function downloadPDF(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function shareTrip(tripData: any) {
  const text = `Check out my trip plan from ${tripData.source?.name || 'N/A'} to ${tripData.destination?.name || 'N/A'} planned with TravelRoute AI!`;
  if (navigator.share) {
    navigator.share({ title: 'TravelRoute AI Trip', text, url: window.location.href }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).catch(() => {});
  }
}
