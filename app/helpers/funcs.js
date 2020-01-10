export const toHS = (strOrNumId, length) => {
  const str = String(strOrNumId);
  if (!length) {
    length = 2 * Math.round(str.length / 2);
  }
  const zeroPaddedHs = ("0".repeat(length) + str).slice(str.length);
  return zeroPaddedHs.slice(2);
};

