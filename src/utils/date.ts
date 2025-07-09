export function isValidPastDate(dateString: string): boolean {
  const dateISOString = dateString.split('.').reverse().join('-');
  const today = new Date();
  const inputDate = new Date(dateISOString);
  return inputDate <= today;
}
