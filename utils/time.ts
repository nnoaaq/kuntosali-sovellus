export function formatTime(dateString: string) {
  const dateObj = new Date(dateString);
  const formatted = new Intl.DateTimeFormat("fi-FI", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatted.format(dateObj);
}
