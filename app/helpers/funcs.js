export const toHS = (strOrNumId, length) => {
  const str = String(strOrNumId);
  if (!length) {
    length = 2 * Math.round(str.length / 2);
  }
  const zeroPaddedHs = ("0".repeat(length) + str).slice(str.length);
  return zeroPaddedHs.slice(2);
};

/**
 * Transforms an array into a dict, where keys are defined by the values
 * of the `prop` property of each item.
 * @template T
 * @param {T[]} array
 * @param {keyof T} prop
 */
export function keyBy(array, prop) {
  const target = {};
  let n = array.length;
  while (n--) {
    const item = array[n];
    target[item[prop]] = item;
  }
  return target;
}
