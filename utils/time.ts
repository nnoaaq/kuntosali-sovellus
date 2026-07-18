export function formatTime(dateString: string) {
  const dateObj = new Date(dateString);
  const formatted = new Intl.DateTimeFormat("fi-FI", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatted.format(dateObj);
}
export function calculateWorkoutDuration(startTime: string, endTime: string) {
  const startObj = new Date(startTime);
  const endObj = new Date(endTime);
  return Math.round((endObj.getTime() - startObj.getTime()) / 1000 / 60);
}
