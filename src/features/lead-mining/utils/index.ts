export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString();
};

export const truncate = (str: string, max = 40): string => {
  if (!str) return '';
  return str.length > max ? `${str.slice(0, max)}...` : str;
};
