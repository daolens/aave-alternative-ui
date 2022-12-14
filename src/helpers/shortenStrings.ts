export const shortenLongNumber = (num: string) => {
  return num?.length > 9 ? num.slice(0, 9) : num;
};
export const shortenAPY = (apy: number) => {
  if (!apy) return "-";
  return +apy * 100 < 0.1 ? "<0.01%" : (+apy * 100).toFixed(2) + "%";
};
export const shortenNumber = (num: number) => {
  if (!num) return 0;
  return num.toFixed(3);
};
