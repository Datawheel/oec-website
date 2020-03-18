export const timeTitleFormat = (time, isTimeSeriesChart = false) =>
  isTimeSeriesChart
    ? time.replace(".", "-")
    : time.split(".").sort((a, b) => a > b ? 1 : -1).join(", ");

export const hsId = prevId => {
  const text = prevId.toString();
  const len = text.length;
  const digit = len + len % 2 - 2;
  const newId = text.substr(-digit);
  return newId;
};

export const queryParser = params => Object.entries(params).map(d => `${d[0]}=${d[1]}`).join("&")
;
