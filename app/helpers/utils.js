/** */
export const zfill = (num, len) => {
  // if (num.toString().length < 3) return num;
  const zero = len - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
};

/** */
export function parseURL(query) {
  return Object.entries(query)
    .map(([key, val]) => `${key}=${val}`)
    .join("&");
}

/** */
export function permalink(vbKey) {
  let _from = vbKey.scale === "hs"
    ? vbKey.partner || "all"
    : vbKey.scale === "flow"
      ? "all"
      : "show";

  let _to = vbKey.scale === "hs"
    ? "show"
    : vbKey.partner || "all";

  if (vbKey.partner) {
    _from = vbKey.partner;
    _to = "all";
  }

  const url = `/visualize/${vbKey.chart}/${vbKey.flow ? `${vbKey.flow}/` : ""}${_from}/${_to}${vbKey.product ? `/${vbKey.product}` : ""}/${vbKey.time}/?locale=${vbKey.lng}`;
  return url;
}
