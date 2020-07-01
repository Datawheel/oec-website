const axios = require("axios"),
      jwt = require("jsonwebtoken");

const {OLAP_PROXY_ENDPOINT, OLAP_PROXY_SECRET} = process.env;

module.exports = function(app) {

  app.post("/api/cms/customAttributes/:pid", async(req, res) => {

    const pid = parseInt(req.params.pid, 10);
    const {variables, locale} = req.body;
    const {id1, dimension1, hierarchy1, slug1, name1, cubeName1, id2, dimension2, hierarchy2, slug2, name2, cubeName2, user} = variables;

    const apiToken = jwt.sign(
      {
        auth_level: 10,
        sub: "server",
        status: "valid"
      },
      OLAP_PROXY_SECRET,
      {expiresIn: "30m"}
    );

    const config = {
      headers: {
        "x-tesseract-jwt-token": apiToken
      }
    };

    if (pid === 1) { // country profile
      const subnatCubeNameDict = {
        nacan: "trade_s_can_m_hs",
        aschn: "trade_s_chn_m_hs",
        eudeu: "trade_s_deu_m_egw",
        asjpn: "trade_s_jpn_m_hs",
        eurus: "trade_s_rus_m_hs",
        euesp: "trade_s_esp_m_hs",
        sabra: "trade_s_bra_ncm_m_hs",
        eugbr: "trade_s_gbr_m_hs",
        nausa: "trade_s_usa_state_m_hs",
        afzaf: "trade_s_zaf_m_hs"
      };

      const defaultProductLevelDict = {
        nacan: "HS4",
        aschn: "HS4",
        eudeu: "Product",
        asjpn: "HS4",
        eurus: "HS4",
        euesp: "HS4",
        sabra: "HS4",
        eugbr: "HS4",
        nausa: "HS4",
        afzaf: "HS4"
      };

      const subnatCubeName = subnatCubeNameDict[id1] || "trade_s_chn_m_hs";
      const defaultProductLevel = defaultProductLevelDict[id1] || "HS4";

      const url = `${OLAP_PROXY_ENDPOINT}data?time=time.latest&cube=${subnatCubeName}&drilldowns=Time&measures=Trade+Value&parents=false&sparse=false&locale=${locale}`;
      const data = await axios.get(url, config).then(resp => resp.data.data).catch(error => console.error("Custom Attribute Error:", error));

      const latestSubnationalDate = data.length > 0 ? data[0].Time : false;
      const previousSubnationalDate = latestSubnationalDate ? `${latestSubnationalDate.toString().slice(0, 4) * 1 - 1}${latestSubnationalDate.toString().slice(-2)}` * 1 : false;

      return res.json({
        subnatCubeName,
        latestSubnationalDate,
        previousSubnationalDate,
        defaultProductLevel
      });

    }
    else if (pid === 2) { // product profile
      const url = `${OLAP_PROXY_ENDPOINT}data?${hierarchy1}=${id1}&cube=${cubeName1}&drilldowns=Year&measures=Trade+Value&parents=false&sparse=false&locale=${locale}`;
      const data = await axios.get(url, config).then(resp => resp.data.data).catch(error => console.error("Custom Attribute Error:", error));

      data.sort((a, b) => b.Year - a.Year);

      const latestYear = data.length > 0 ? data[0].Year : 2018;

      return res.json({
        latestYear
      });
    }
    else if (pid === 4) { // product-country profile
      const subnatCubeNameDict = {
        nacan: "trade_s_can_m_hs",
        aschn: "trade_s_chn_m_hs",
        eudeu: "trade_s_deu_m_egw",
        asjpn: "trade_s_jpn_m_hs",
        eurus: "trade_s_rus_m_hs",
        euesp: "trade_s_esp_m_hs",
        sabra: "trade_s_bra_ncm_m_hs",
        eugbr: "trade_s_gbr_m_hs",
        nausa: "trade_s_usa_state_m_hs",
        afzaf: "trade_s_zaf_m_hs"
      };

      const customSectionDict = {
        nacan: "Section",
        aschn: "Section",
        eudeu: "EGW1",
        asjpn: "Section",
        eurus: "Section",
        euesp: "Section",
        sabra: "Section",
        eugbr: "Section",
        nausa: "Section",
        afzaf: "Section"
      };

      const customHS2Dict = {
        nacan: "HS2",
        aschn: "HS2",
        eudeu: "Product",
        asjpn: "HS2",
        eurus: "HS2",
        euesp: "HS2",
        sabra: "HS2",
        eugbr: "HS2",
        nausa: "HS2",
        afzaf: "HS2"
      };

      const customHS4Dict = {
        nacan: "HS4",
        aschn: "HS4",
        eudeu: false,
        asjpn: "HS4",
        eurus: "HS4",
        euesp: "HS4",
        sabra: "HS4",
        eugbr: "HS4",
        nausa: "HS4",
        afzaf: "HS4"
      };

      const customHS6Dict = {
        nacan: "Product",
        aschn: "Product",
        eudeu: false,
        asjpn: "Product",
        eurus: "Product",
        euesp: "Product",
        sabra: "Product",
        eugbr: "Product",
        nausa: "Product",
        afzaf: "Product"
      };

      const customSection = customSectionDict[id2] || "Section";
      const customHS2 = customHS2Dict[id2] || "HS2";
      const customHS4 = customHS4Dict[id2] || "HS4";
      const customHS6 = customHS6Dict[id2] || "HS6";

      const customHierarchy1Dict = {
        Section: customSection,
        HS2: customHS2,
        HS4: customHS4,
        HS6: customHS6
      };

      const customHierarchy1 = customHierarchy1Dict[hierarchy1] || hierarchy1;

      const subnatCubeName = subnatCubeNameDict[id2] || "trade_s_chn_m_hs";

      const urlExporter = `${OLAP_PROXY_ENDPOINT}data?${hierarchy1}=${id1}&Exporter+Country=${id2}&cube=${cubeName1}&drilldowns=Year&measures=Trade+Value&parents=false&sparse=false&locale=${locale}`;
      const urlImporter = `${OLAP_PROXY_ENDPOINT}data?${hierarchy1}=${id1}&Importer+Country=${id2}&cube=${cubeName1}&drilldowns=Year&measures=Trade+Value&parents=false&sparse=false&locale=${locale}`;

      const dataExpo = await axios.get(urlExporter, config).then(resp => resp.data.data).catch(error => console.error("Custom Attribute Error:", error));
      const dataImpo = await axios.get(urlImporter, config).then(resp => resp.data.data).catch(error => console.error("Custom Attribute Error:", error));

      const exporterYear = dataExpo.length > 0 ? dataExpo.sort((a, b) => b.Year - a.Year)[0].Year : 2018;
      const importerYear = dataImpo.length > 0 ? dataImpo.sort((a, b) => b.Year - a.Year)[0].Year : 2018;

      const url = `${OLAP_PROXY_ENDPOINT}data?time=time.latest&cube=${subnatCubeName}&drilldowns=Time&measures=Trade+Value&parents=false&sparse=false&locale=${locale}`;
      const data = await axios.get(url, config).then(resp => resp.data.data).catch(error => console.error("Custom Attribute Error:", error));

      const latestSubnationalDate = data.length > 0 ? data[0].Time : false;
      const previousSubnationalDate = latestSubnationalDate ? `${latestSubnationalDate.toString().slice(0, 4) * 1 - 1}${latestSubnationalDate.toString().slice(-2)}` * 1 : false;


      return res.json({
        latestSubnationalDate,
        previousSubnationalDate,
        subnatCubeName,
        customHierarchy1,
        importerYear,
        exporterYear
      });
    }
    else if (pid === 38) { // subnational profile

      const timeDimDict = {
        trade_s_bol_m_sitc3: "Month",
        trade_s_fra_q_cpf: "Quarter",
        trade_s_deu_m_egw: "Month",
        trade_s_tur_m_hs: "Month",
        trade_s_usa_district_m_hs: "Month",
        trade_s_usa_port_m_hs: "Month",
        trade_s_usa_state_m_hs: "Month",
        trade_s_bra_mun_m_hs: "Month",
        trade_s_bra_ncm_m_hs: "Month",
        trade_s_can_m_hs: "Month",
        trade_s_chn_m_hs: "Month",
        trade_s_ecu_m_hs: "Month",
        trade_s_jpn_m_hs: "Month",
        trade_s_rus_m_hs: "Month",
        trade_s_zaf_m_hs: "Month",
        trade_s_esp_m_hs: "Month",
        trade_s_gbr_m_hs: "Month"
      };

      const timeDim = timeDimDict[cubeName1] || "Month";

      const url = `${OLAP_PROXY_ENDPOINT}data?cube=${cubeName1}&drilldowns=${timeDim}&measures=Trade+Value&Trade+Flow=2&parents=true&sparse=false&locale=${locale}`;
      const urlBaci = `${OLAP_PROXY_ENDPOINT}data?cube=trade_i_baci_a_92&drilldowns=Year&measures=Trade+Value&parents=false&sparse=false&locale=${locale}`;

      const data = await axios.get(url, config).then(resp => resp.data.data).catch(error => console.error("Custom Attribute Error:", error));
      const dataBaci = await axios.get(urlBaci, config).then(resp => resp.data.data).catch(error => console.error("Custom Attribute Error:", error));

      data.sort((a, b) => {
        if (b.Year > a.Year) return 1;
        if (b.Year < a.Year) return -1;
        if (b[`${timeDim} ID`] > a[`${timeDim} ID`]) return 1;
        if (b[`${timeDim} ID`] < a[`${timeDim} ID`]) return -1;
      });
      dataBaci.sort((a, b) => b.Year - a.Year);

      const notMonthCountries = ["trade_s_fra_q_cpf"];

      const period = notMonthCountries.includes(cubeName1) ? 4 : 11;

      const yearLast = data.length > 0 ? data[0][`${timeDim} ID`] >= period ? data[0].Year : data[0].Year - 1  : 2019;
      const yearLastBaci = dataBaci.length > 0 ? dataBaci[0].Year : 2018;

      const yearConcat = cubeName1 === "trade_s_chn_m_hs" ? yearLast : `${yearLast - 2},${yearLast - 1},${yearLast}`;
      const yearConcatBaci = cubeName1 === "trade_s_chn_m_hs" ? yearLastBaci : `${yearLastBaci - 2},${yearLastBaci - 1},${yearLastBaci}`;

      const countryThreshold = cubeName1 === "trade_s_chn_m_hs" ? 1000000000 : 3000000000;
      const hsThreshold = cubeName1 === "trade_s_chn_m_hs" ? 500000000 : 1500000000;
      const subnatThreshold = cubeName1 === "trade_s_chn_m_hs" ? 100000000 : 300000000;

      const productThreshold = cubeName1 === "trade_s_chn_m_hs" ? 10000000 : 30000000;

      const depthComplexityDict = {
        trade_s_bol_m_sitc3: "Product",
        trade_s_fra_q_cpf: "Product",
        trade_s_deu_m_egw: "Product",
        trade_s_tur_m_hs: "HS2",
        trade_s_usa_district_m_hs: "HS4",
        trade_s_usa_port_m_hs: "HS4",
        trade_s_usa_state_m_hs: "HS4",
        trade_s_bra_mun_m_hs: "HS4",
        trade_s_bra_ncm_m_hs: "HS4",
        trade_s_can_m_hs: "HS4",
        trade_s_chn_m_hs: "HS4",
        trade_s_ecu_m_hs: "HS4",
        trade_s_jpn_m_hs: "HS4",
        trade_s_rus_m_hs: "HS4",
        trade_s_zaf_m_hs: "HS4",
        trade_s_esp_m_hs: "HS4",
        trade_s_gbr_m_hs: "HS4"
      };

      const depthDict = {
        trade_s_bol_m_sitc3: "Product",
        trade_s_fra_q_cpf: "Product",
        trade_s_deu_m_egw: "Product",
        trade_s_tur_m_hs: "HS2",
        trade_s_usa_district_m_hs: "Product",
        trade_s_usa_port_m_hs: "Product",
        trade_s_usa_state_m_hs: "Product",
        trade_s_bra_mun_m_hs: "HS4",
        trade_s_bra_ncm_m_hs: "Product",
        trade_s_can_m_hs: "Product",
        trade_s_chn_m_hs: "Product",
        trade_s_ecu_m_hs: "Product",
        trade_s_jpn_m_hs: "Product",
        trade_s_rus_m_hs: "Product",
        trade_s_zaf_m_hs: "Product",
        trade_s_esp_m_hs: "Product",
        trade_s_gbr_m_hs: "Product"
      };

      const depthComplexity = depthComplexityDict[cubeName1] || "HS4";
      const depthProduct = depthDict[cubeName1] || "Product";

      const cubeNameVariantDict = {
        trade_s_bol_m_sitc3: "trade_s_bol_m_sitc3",
        trade_s_fra_q_cpf: "trade_s_fra_q_cpf",
        trade_s_deu_m_egw: "trade_s_deu_m_egw",
        trade_s_tur_m_hs: "trade_s_tur_m_countries",
        trade_s_usa_district_m_hs: "trade_s_usa_district_m_hs",
        trade_s_usa_port_m_hs: "trade_s_usa_port_m_hs",
        trade_s_usa_state_m_hs: "trade_s_usa_state_m_hs",
        trade_s_bra_mun_m_hs: "trade_s_bra_mun_m_hs",
        trade_s_bra_ncm_m_hs: "trade_s_bra_ncm_m_hs",
        trade_s_can_m_hs: "trade_s_can_m_hs",
        trade_s_chn_m_hs: "trade_s_chn_m_hs",
        trade_s_ecu_m_hs: "trade_s_ecu_m_hs",
        trade_s_jpn_m_hs: "trade_s_jpn_m_hs",
        trade_s_rus_m_hs: "trade_s_rus_m_hs",
        trade_s_zaf_m_hs: "trade_s_zaf_m_hs",
        trade_s_esp_m_hs: "trade_s_esp_m_hs",
        trade_s_gbr_m_hs: "trade_s_gbr_m_hs"
      };

      const cubeNameVariant = cubeNameVariantDict[cubeName1];

      return res.json({
        depthComplexity,
        depthProduct,
        yearConcat,
        yearConcatBaci,
        countryThreshold,
        hsThreshold,
        subnatThreshold,
        productThreshold,
        cubeNameVariant
      });
    }
    else return res.json({});
  });
};
