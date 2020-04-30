import {tariffCubeName} from "./constants";

/**
 * @param {import("@datawheel/olap-client").IClient} client
 * @param {string} [language]
 */
export function requestPartnerList(client, language = "en") {
  return client.getCube(tariffCubeName).then(cube => {
    const query = cube.query
      .setLocale(language)
      .addDrilldown({level: "Partner Country"})
      .addMeasure("Tariff")
      .addProperty("Partner Country", "ISO 3")
      .setOption("distinct", true)
      .setOption("nonempty", true)
      .setOption("parents", true);
    return client.execQuery(query, "aggregate");
  });
}

/**
 * @param {import("@datawheel/olap-client").IClient} client
 * @param {string} [language]
 */
export function requestProductList(client, language = "en") {
  return client.getCube(tariffCubeName).then(cube => {
    const query = cube.query
      .setLocale(language)
      .addDrilldown({dimension: "HS Product", hierarchy: "Master HS", level: "HS6"})
      .addMeasure("Tariff")
      .setOption("distinct", true)
      .setOption("nonempty", true)
      .setOption("parents", true);
    return client.execQuery(query, "aggregate");
  });
}

/**
 * @param {import("@datawheel/olap-client").IClient} client
 * @param {string} [language]
 */
export function requestReporterList(client, language = "en") {
  return client.getCube(tariffCubeName).then(cube => {
    const query = cube.query
      .setLocale(language)
      .addDrilldown({level: "Reporter Country"})
      .addMeasure("Tariff")
      .setOption("distinct", true)
      .setOption("nonempty", true)
      .setOption("parents", true);
    return client.execQuery(query, "aggregate");
  });
}

/**
 * Returns the initial information required to fill the option lists.
 * @param {import("@datawheel/olap-client").IClient} client
 * @param {string} [language]
 */
export function requestOptionLists(client, language) {
  return Promise.all([
    requestPartnerList(client, language),
    requestProductList(client, language),
    requestReporterList(client, language)
  ]);
}

/**
 * Returns a promise that resolves to the Tariff data for the current user parameters.
 * @param {import("@datawheel/olap-client").IClient} client
 * @param {TariffState} state
 * @param {string} [language]
 * @returns {Promise<import("@datawheel/olap-client").Aggregation<TariffDatum[]>>}
 */
export function requestTariffDataset(client, state, language = "en") {
  const {reporterCuts, partnerCuts, productCuts} = state;

  return client.getCube(tariffCubeName).then(cube => {
    const query = cube.query
      .setLocale(language)
      .setOption("sparse", true)
      .addMeasure("Tariff")
      .addDrilldown("Year")
      .addDrilldown("Partner Country")
      .addDrilldown(state.productLevel)
      .addDrilldown("Reporter Country")
      .addDrilldown("Agreement")
      .addProperty("Partner Country", "ISO3")
      .addProperty("Reporter Country", "ISO3");

    partnerCuts.length > 0 &&
      query.addCut(
        {dimension: "Partner", level: partnerCuts[0].type},
        partnerCuts.map(item => `${item.id}`)
      );
    productCuts.length > 0 &&
      query.addCut(
        {dimension: "HS Product", level: productCuts[0].type},
        productCuts.map(item => `${item.id}`)
      );
    reporterCuts.length > 0 &&
      query.addCut(
        {dimension: "Reporter", level: reporterCuts[0].type},
        reporterCuts.map(item => `${item.id}`)
      );

    return client.execQuery(query, "logiclayer");
  });
}
