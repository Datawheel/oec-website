import {Button} from "@blueprintjs/core";
import {Client, TesseractDataSource} from "@datawheel/olap-client";
import Footer from "components/Footer";
import OECNavbar from "components/OECNavbar";
import {extendItems} from "components/SelectMultiHierarchy";
import queryString from "query-string";
import React from "react";
import {withNamespaces} from "react-i18next";
import {countryConsts, productConsts, productLevels, vizTypes} from "./constants";
import {calculateMapMode, combos} from "./mapcase";
import {requestPartnerList, requestProductList, requestReporterList, requestTariffDataset} from "./requests";
import TariffControls from "./TariffControls";
import TariffGeomap from "./TariffGeomap";
import TariffTable from "./TariffTable";
import TariffViz from "./TariffViz";
import {capitalize, findInDataTree, getMembers, parseSearchParams} from "./toolbox";

import "./Tariffs.css";

/** @extends {React.PureComponent<import("react-i18next").WithNamespaces & import("react-router").RouteComponentProps, TariffState>} */
class Tariffs extends React.PureComponent {
  constructor(props) {
    super(props);

    const params = parseSearchParams(decodeURIComponent(props.location.search));

    /** @type {TariffState} */
    this.state = {
      tariffError: "",
      isGeomapAvailable: true,
      isLoadingPartner: true,
      isLoadingProduct: true,
      isLoadingReporter: true,
      isLoadingTariffs: true,
      partnerCuts: params.partnerCuts ?? [],
      partnerOptions: [],
      productCuts: params.productCuts ?? [],
      productLevel: params.productLevel ?? "Section",
      productOptions: [],
      reporterCuts: params.reporterCuts ?? [],
      reporterOptions: [],
      tariffDatums: [],
      tariffMembers: {},
      vizType: vizTypes.GEOMAP
    };

    this.client = new Client(new TesseractDataSource("/olap-proxy/"));
  }

  /**
   * The same purpose as this.setState, but returns a promise.
   * @template {keyof TariffState} K
   * @param {Record<K, TariffState[K]> | ((state: Readonly<TariffState>) => Record<K, TariffState[K]>)} value
   */
  setStatePromise = value => new Promise(resolve => this.setState(value, resolve));

  /**
   * @param {keyof TariffState} key
   * @param {TariffState[keyof TariffState] | ((state: TariffState) => TariffState[keyof TariffState])} value
   */
  stateUpdateHandler = (key, value) => {
    if (
      key === "partnerCuts" ||
      key === "productCuts" ||
      key === "productLevel" ||
      key === "reporterCuts" ||
      key === "vizType"
    ) {
      const finalValue = typeof value === "function" ? value(this.state) : value;

      /** @type {{[K in keyof TariffState]: TariffState[K]}} */
      const nextState = {[key]: finalValue};

      if (key === "productCuts" && Array.isArray(finalValue) && finalValue.length > 0) {
        const currentDepth = productLevels.indexOf(this.state.productLevel);
        const itemDepth = productLevels.indexOf(finalValue[0].type);
        if (currentDepth < itemDepth) {
          nextState.productLevel = finalValue[0].type;
        }
      }

      this.setState(nextState);
    }
  };

  /**
   * This function is in charge of reacting to the user pressing the browser's
   * back and forward buttons.
   * Checks is there's a saved state and applies it.
   * @param {PopStateEvent} evt
   */
  historyPopHandler = evt => evt.state &&
    this.setState({
      partnerCuts: evt.state.partnerCuts,
      productCuts: evt.state.productCuts,
      productLevel: evt.state.productLevel,
      reporterCuts: evt.state.reporterCuts,
      vizType: evt.state.vizType
    }, this.requestDataHandler);

  /**
   * Gets the data after all parameters are set.
   */
  requestDataHandler = () => this.setStatePromise({
    tariffError: "",
    isLoadingTariffs: true,
    tariffDatums: [],
    tariffMembers: {}
  }).then(() => requestTariffDataset(this.client, this.state, this.props.i18n.language))
    .then(
      aggregation => {
        const {productLevel} = this.state;

        const tariffDatums = aggregation.data;
        const tariffMembers = getMembers(tariffDatums, [
          "Partner Country ID",
          "Partner Country",
          "Reporter Country ID",
          "Reporter Country",
          "Year",
          productLevel
        ]);

        // disable map viz if there's no configuration set for the combo
        const mapMode = calculateMapMode(tariffMembers, productLevel);
        const isGeomapAvailable = combos.hasOwnProperty(mapMode);
        const vizType = isGeomapAvailable ? this.state.vizType : vizTypes.TABLE;

        if (typeof window === "object") {
          const {reporterCuts, partnerCuts, productCuts} = this.state;
          const qsParams = {
            detail: productLevel,
            reporters: reporterCuts.map(item => item.id).join(","),
            partners: partnerCuts.map(item => item.id).join(","),
            products: productCuts.map(item => item.id).join(","),
            viz: vizType
          };
          const qs = queryString.stringify(qsParams, {skipEmptyString: true});
          if (window.location.search.indexOf(qs) === -1) {
            const qsState = {reporterCuts, partnerCuts, productCuts, productLevel, vizType};
            window.history.pushState(qsState, "", `${window.location.pathname}?${qs}`);
          }
        }

        return this.setStatePromise({isGeomapAvailable, isLoadingTariffs: false, tariffDatums, tariffMembers, vizType});
      },
      error => {
        const data = error.response?.data;
        const tariffError = data ? data.data || data.statusText : error.message;
        return this.setStatePromise({tariffError, isLoadingTariffs: false});
      }
    );

  componentDidMount() {
    const client = this.client;
    const state = this.state;
    const {language} = this.props.i18n;

    const makeInitialRequest = (key, requestFn, {levels, getColor, getIcon}) => {
      const onResolve = agg => {
        const dataTree = extendItems(agg.data, levels, {getColor, getIcon});
        const updatedCuts = findInDataTree(state[`${key}Cuts`], dataTree);
        // @ts-ignore
        this.setStatePromise({
          [`isLoading${capitalize(key)}`]: false,
          [`${key}Options`]: agg.data,
          [`${key}Cuts`]: updatedCuts
        });
        return updatedCuts;
      };
      const onReject = () => requestFn(client, language).then(onResolve, onReject);
      return requestFn(client, language).then(onResolve, onReject);
    };

    Promise.all([
      makeInitialRequest("partner", requestPartnerList, countryConsts),
      makeInitialRequest("product", requestProductList, productConsts),
      makeInitialRequest("reporter", requestReporterList, countryConsts)
    ]).then(cuts => {
      cuts.some(cut => cut.length > 0)
        ? this.requestDataHandler()
        : this.setState({tariffError: "", isLoadingTariffs: false, tariffDatums: []});
    });

    window.addEventListener("popstate", this.historyPopHandler);
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.historyPopHandler);
  }

  render() {
    const {t} = this.props;
    const state = this.state;

    const mapMode = calculateMapMode(state.tariffMembers, state.productLevel);
    const Visualization = state.isGeomapAvailable && state.vizType === vizTypes.GEOMAP
      ? TariffGeomap : TariffTable;

    return (
      <div className="tariff-page">
        <OECNavbar />

        <div className="welcome-bg">
          <img
            className="welcome-bg-img"
            src="/images/home/stars.png"
            alt="[Stars background]"
          />
        </div>

        <div className="tariff-content">
          <h1>{t("tariffsexplorer_maintitle")}</h1>

          <TariffControls
            className="tariffs-parameters"
            disableGeomap={!state.isGeomapAvailable}
            onChange={this.stateUpdateHandler}
            partnerCuts={state.partnerCuts}
            isLoadingPartner={state.isLoadingPartner}
            partnerOptions={state.partnerOptions}
            productCuts={state.productCuts}
            productLevel={state.productLevel}
            isLoadingProduct={state.isLoadingProduct}
            productOptions={state.productOptions}
            reporterCuts={state.reporterCuts}
            isLoadingReporter={state.isLoadingReporter}
            reporterOptions={state.reporterOptions}
            vizType={state.vizType}
          >
            <Button
              className="query-button field-sm"
              onClick={this.requestDataHandler}
              rightIcon="double-chevron-right"
              text={t("tariffsexplorer_action_query")}
            />
          </TariffControls>

          <TariffViz
            className="tariffs-visualization"
            error={state.tariffError}
            isLoading={state.isLoadingTariffs}
            isEmpty={state.tariffDatums.length === 0}
          >
            <span>{mapMode}</span>
            {state.tariffDatums.length > 0 && <Visualization
              productLevel={state.productLevel}
              tariffDatums={state.tariffDatums}
              tariffMembers={state.tariffMembers}
            />}
          </TariffViz>
        </div>

        <Footer />
      </div>
    );
  }
}

export default withNamespaces()(Tariffs);
