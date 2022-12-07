export const shortenLongNumber = (num: string) => {
  return num?.length > 6 ? num.slice(0, 6) : num;
};
export const shortenAPY = (apy: number) => {
  if (!apy) return "-";
  return apy < 0.1 ? "<0.1%" : (+apy).toFixed(3);
};
export const shortenNumber = (num: number) => {
  if (!num) return 0;
  return num.toFixed(3);
};
