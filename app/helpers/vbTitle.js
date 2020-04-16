import {timeTitleFormat} from "./formatters";

export const getList = n => getNames(n).reduce((str, item, i) => {
  if (!i) str += item;
  else if (i === n.length - 1 && i === 1) str += ` and ${item}`;
  else if (i === n.length - 1) str += `, and ${item}`;
  else str += `, ${item}`;
  return str;
}, "");

const getNames = items => items.map(d => d.name || d.title);

export const getVbTitle = (items, axis, routeParams) => {
  const {geo, geoPartner, product, technology} = items;
  const {x, y} = axis;

  const {chart, flow, country, partner, viztype, time} = routeParams;
  const _countryNames = getList(geo);
  const _partnerNames = getList(geoPartner);
  const _productNames = getList(product ? product : []);
  const _technologyNames = getList(technology);

  const isTrade = new RegExp(/(export|import)/).test(flow);
  const isTimeSeriesChart = new RegExp(/(stacked|line)/).test(chart);
  const isCountry = new RegExp(/^(?!(all|show)).*$/).test(country);
  const isPartner = new RegExp(/^(?!(all|show)).*$/).test(partner);
  const isGeoGrouping = new RegExp(/show/).test(partner);
  const isProduct = new RegExp(/^(?!(all|show)).*$/).test(viztype);
  const isTradeBalance = flow === "show";

  const preps = {
    export: "to",
    import: "from",
    uspto: ""
  };

  let params = {
    country: _countryNames,
    partner: _partnerNames,
    flow,
    prep: preps[flow],
    product: _productNames,
    time: timeTitleFormat(time, isTimeSeriesChart)
  };

  let title = "vb_title_what_country_flow";

  if (chart === "network") {
    // Titles for Network section
    const networkTitleParams = {country: _countryNames, time};
    const networkTitleOptions = {
      export: ["vb_title_network_rca", networkTitleParams],
      pgi: ["vb_title_network_pgi", networkTitleParams],
      relatedness: ["vb_title_network_relatedness", networkTitleParams]
    };

    title = networkTitleOptions[flow][0] || networkTitleOptions.export[0];
  }
  else if (chart === "rings") {
    title = "vb_title_rings";
  }
  else if (chart === "scatter") {
    title = "vb_title_scatter";
    params = {measure: x.title, compare: y.title, time};
  }
  else if (isTradeBalance) {
    title = isPartner
      ? "vb_title_trade_balance_partner"
      : "vb_title_trade_balance";
  }
  else if (isTrade) {
    // Titles for Trade charts
    if (!isCountry && isProduct) {
      title = "vb_title_which_countries_flow_product";
    }
    else if (isCountry && isProduct) {
      title = "vb_title_where_country_flow_product";
    }
    else if (isGeoGrouping) {
      title = "vb_title_where_country_flow";
    }
    else if (isCountry && isPartner) {
      title = "vb_title_what_country_flow_partner";
    }
  }
  else {
    // Titles for Technology charts
    if (isCountry) {
      title = "vb_title_what_country_patent";
    }
    else if (!isCountry && isProduct) {
      title = "vb_title_which_countries_patent";
    }
  }

  return {vbTitle: title, vbParams: params};
};

