export const timeFormat = time => {
  const timeItems = time.split(".").map(d => {
    const n = d.length;
    if (n === 4) return d;
    else if (n === 5) return `${d.slice(0, 4)}-Q${d.slice(4, 5)}`;
    else if (n === 6) return `${d.slice(0, 4)}-${d.slice(4, 6)}`;
    else return "";
  });
  return timeItems.join(".");
};

export const timeTitleFormat = (time, isTimeSeriesChart = false) =>
  isTimeSeriesChart
    ? timeFormat(time).replace(".", "-")
    : timeFormat(time).split(".").sort((a, b) => a > b ? 1 : -1).join(", ");

export const hsId = prevId => {
  const text = prevId.toString();
  const len = text.length;
  const digit = len + len % 2 - 2;
  const newId = text.substr(-digit);
  return newId;
};

export const queryParser = params => Object.entries(params).map(d => `${d[0]}=${d[1]}`).join("&")
;
