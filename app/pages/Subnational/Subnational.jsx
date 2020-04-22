import React from "react";
import {hot} from "react-hot-loader/root";
import PropTypes from "prop-types";

import axios from "axios";

import {connect} from "react-redux";
import {AnchorLink} from "@datawheel/canon-core";

import {withNamespaces} from "react-i18next";

import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";
import SubnationalCountryBlock from "./SubnationalCountryBlock";

import {nest as d3Nest} from "d3-collection";

import {fetchData} from "@datawheel/canon-core";

import "./Subnational.css";

import {SUBNATIONAL_COUNTRIES} from "helpers/consts";

class Subnational extends React.Component {

  getChildContext() {
    const {locale, router} = this.props;
    return {
      router,
      locale
    };
  }

  render() {
    const {subnationalLandingData, matrix} = this.props;

    return <div className="subnational">
      <OECNavbar />

      <div className="subnational-content">

        <h1 className="subnational-title">States/Provinces</h1>

        <p className="subnational-intro">Subnational data is available in the following countries, with more to come!</p>
        <div className="subnational-country-index">
          {SUBNATIONAL_COUNTRIES.sort((a, b) => a.name > b.name ? 1 : -1).map(country =>
            <AnchorLink key={country.code} to={`subnational-country-block-${country.code}`} className={`subnational-country-item ${country.available ? "" : "subnational-country-item-soon"}`}>
              {!country.available && <span className="subnational-country-item-soon-cover"></span>}
              <span className="subnational-country-item-flag">
                {!country.available && <span className="subnational-country-item-soon-label">Coming<br/>Soon</span>}
                <img src={`/images/icons/country/country_${country.code}.png`} />
              </span>
              <span className="subnational-country-item-name">{country.name}</span>
            </AnchorLink>
          )}
        </div>

        {SUBNATIONAL_COUNTRIES.filter(sc => sc.available).sort((a, b) => a.name > b.name ? 1 : -1).map((country, ix) =>
          <SubnationalCountryBlock key={`subnational-country-${ix}`} metadata={country} options={subnationalLandingData ? subnationalLandingData[country.code] : false} />
        )}

      </div>

      <Footer />
    </div>;
  }
}

Subnational.childContextTypes = {
  locale: PropTypes.string,
  router: PropTypes.object
};

Subnational.need = [(params, store) => {

  // Setup promises
  const promisesList = [];
  const countriesData = {};
  SUBNATIONAL_COUNTRIES.filter(sc => sc.available).map((country, ix) => {
    let limit = country.limit ? `${country.limit}` : "1000";
    let url = `${store.env.CANON_API}/api/search?cubeName=${country.cube}&dimension=${country.dimension}&level=${country.geoLevels.map(gl => gl.level).join(",")}&limit=${limit}&ref=${country.code}_0`;
    countriesData[`${country.code}_0`] = country;
    promisesList.push(url);
    country.geoLevels.map((gl, ix) => {
      if (gl.overrideCube) {
        limit = country.limit ? `${country.limit}` : "1000";
        url = `${store.env.CANON_API}/api/search?cubeName=${gl.overrideCube}&dimension=${country.dimension}&level=${gl.level}&limit=${limit}&ref=${country.code}_1`;
        countriesData[`${country.code}_${ix + 1}`] = country;
        promisesList.push(url);
      }
    });
  });

  // All promises finish
  const allPromise = Promise.all(promisesList.map(url => axios.get(url))).then(responses => {
    const finalResponse = {};
    let reponseMetadata;
    let records;
    let responseURL;
    let codeInURL;
    let nestResponse;
    responses.map(res => {
      responseURL = res.request.responseURL ? res.request.responseURL : res.request.res.responseUrl;
      codeInURL = responseURL.split("&ref=")[1];
      reponseMetadata = countriesData[codeInURL];
      if (reponseMetadata) {
        records = res.data.results.filter(datum =>
          datum.dimension === reponseMetadata.dimension &&
          reponseMetadata.geoLevels.map(gl => gl.level).indexOf(datum.hierarchy) > -1
        );
        nestResponse = d3Nest().key(d => `${d.cubeName}_${d.hierarchy}`).object(records);
        if (finalResponse[reponseMetadata.code]) {
          finalResponse[reponseMetadata.code] = {...finalResponse[reponseMetadata.code], ...nestResponse};
        }
        else {
          finalResponse[reponseMetadata.code] = nestResponse;
        }
      }
      else {
        console.warn("responseURL", res.request.res.responseUrl);
        // console.warn("not in", Object.keys(countriesData));
      }
    });
    return {
      key: "subnationalLandingData",
      data: finalResponse
    };
  });

  return {
    type: "GET_DATA",
    promise: allPromise
  };
}, fetchData("datamatrix", "/api/matrix")];

export default hot(withNamespaces()(
  connect(state => ({
    locale: state.i18n.locale,
    subnationalLandingData: state.data.subnationalLandingData,
    matrix: state.data.datamatrix
  }))(Subnational)
));
