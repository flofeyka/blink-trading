export const compactNumber = (num: number): string => {
  return num.toLocaleString("en-US", {
    notation: "compact",
    compactDisplay: "short",
  })
}