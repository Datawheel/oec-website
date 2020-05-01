/**
 * Keys refer to the params: Reporters | Partners | Products
 *
 * Note in this UX, 0 means there's no cut on that dimension,
 * thus the request returns everything.
 */
export const combos = {
  "011": comboAllOneOne,
  "101": comboOneAllOne,
  "110": comboOneOneAny,
  "111": comboOneOneAny,
  "112": comboOneOneAny,
  "120": comboOneTwoAny,
  "121": comboOneTwoAny,
  "122": comboOneTwoAny,
  "210": comboTwoOneAny,
  "211": comboTwoOneAny,
  "212": comboTwoOneAny
};

/**
 * @param {TariffState["tariffMembers"]} members
 * @param {TariffState["productLevel"]} productLevel
 */
export const calculateMapMode = (members, productLevel) => {
  const re = members["Reporter Country ID"]?.length;
  const pa = members["Partner Country ID"]?.length;
  const pr = members[productLevel]?.length;
  return `${re > 2 ? 0 : re}${pa > 2 ? 0 : pa}${pr > 2 ? 0 : pr}`;
};

/**
 * @param {Pick<TariffState, "tariffDatums" | "tariffMembers" | "productLevel">} state
 * @return {Partial<ChartConfig>}
 */
export const pickCombo = state => {
  const mapMode = calculateMapMode(state.tariffMembers, state.productLevel);
  const comboFn = combos[mapMode];
  return comboFn ? comboFn(state) : {};
};

/**
 * The tariff a partner applies to all countries for one product category
 * @param {TariffState} state
 * @return {Partial<ChartConfig>}
 */
function comboAllOneOne({tariffMembers}) {
  const reporters = new Set(tariffMembers["Reporter Country ID"].map(id => id.substr(-3)));
  const partners = new Set(tariffMembers["Partner Country ID"].map(id => id.substr(-3)));

  return {
    groupBy: [d => `${d["Reporter Country ID"]}`.substr(-3)],
    fitFilter: d => reporters.has(d.id),
    topojsonFill: d => partners.has(d.id) ? "#585d6b" : "transparent"
  };
}

/**
 *
 * @param {TariffState} state
 * @return {Partial<ChartConfig>}
 */
function comboOneAllOne({tariffMembers}) {
  const reporters = new Set(tariffMembers["Reporter Country ID"].map(id => id.substr(-3)));
  const partners = new Set(tariffMembers["Partner Country ID"].map(id => id.substr(-3)));

  return {
    groupBy: [d => `${d["Partner Country ID"]}`.substr(-3)],
    fitFilter: d => partners.has(d.id),
    topojsonFill: d => reporters.has(d.id) ? "#585d6b" : "transparent"
  };
}

/**
 * @param {TariffState} state
 * @return {Partial<ChartConfig>}
 */
function comboOneOneAny({tariffMembers}) {
  const reporters = new Set(tariffMembers["Reporter Country ID"].map(id => id.substr(-3)));
  const partners = new Set(tariffMembers["Partner Country ID"].map(id => id.substr(-3)));

  return {
    groupBy: [d => `${d["Reporter Country ID"]}`.substr(-3)],
    fitFilter: d => reporters.has(d.id) || partners.has(d.id),
    topojsonFill: d => partners.has(d.id) ? "#585d6b" : "transparent"
  };
}

/**
 * @param {TariffState} state
 * @return {Partial<ChartConfig>}
 */
function comboOneTwoAny({tariffMembers}) {
  const reporters = new Set(tariffMembers["Reporter Country ID"].map(id => id.substr(-3)));
  const partners = new Set(tariffMembers["Partner Country ID"].map(id => id.substr(-3)));

  return {
    groupBy: [d => `${d["Partner Country ID"]}`.substr(-3)],
    fitFilter: d => reporters.has(d.id) || partners.has(d.id),
    topojsonFill: d => reporters.has(d.id) ? "#585d6b" : "transparent"
  };
}

/**
 * @param {TariffState} state
 * @return {Partial<ChartConfig>}
 */
function comboTwoOneAny({tariffMembers}) {
  const reporters = new Set(tariffMembers["Reporter Country ID"].map(id => id.substr(-3)));
  const partners = new Set(tariffMembers["Partner Country ID"].map(id => id.substr(-3)));

  return {
    groupBy: [d => `${d["Reporter Country ID"]}`.substr(-3)],
    fitFilter: d => reporters.has(d.id) || partners.has(d.id),
    topojsonFill: d => reporters.has(d.id) ? "#585d6b" : "transparent"
  };
}
