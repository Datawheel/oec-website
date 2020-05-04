/** */
export const getRandom = items => items[Math.floor(Math.random() * items.length)];

/** */
export const range = (start, end, step = 1) => {
  end *= 1, start *= 1;
  const len = Math.floor((end - start) / step) + 1;
  return Array(len).fill().map((_, idx) => start + idx * step);
};

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

/** Str to title case */
export function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/** */
export function normalizeString(str) {
  return str.normalize("NFD").toLowerCase().replace(/[\u0300-\u036f]/g, "");
}
