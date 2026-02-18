export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  // @ts-ignore
  return date.toLocaleDateString("en-US", options);
}
