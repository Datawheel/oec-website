import React from "react";
import {hot} from "react-hot-loader/root";

import axios from "axios";

import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";
import SubnationalCountryBlock from "./SubnationalCountryBlock";

import {nest as d3Nest} from "d3-collection";

import "./Subnational.css";

import {SUBNATIONAL_COUNTRIES} from "helpers/consts";

class Subnational extends React.Component {

  render() {
    const {subnationalLandingData} = this.props;

    return <div className="subnational">
      <OECNavbar />

      {/* spinning orb thing */}
      <div className="welcome-bg">
        <img className="welcome-bg-img" src="/images/stars.png" alt="" draggable="false" />
      </div>

      <div className="subnational-content">

        <h1>Subnational Countries</h1>

        {SUBNATIONAL_COUNTRIES.sort((a, b) => a.name > b.name ? 1 : -1).map((country, ix) =>
          <SubnationalCountryBlock key={`subnational-country-${ix}`} metadata={country} options={subnationalLandingData ? subnationalLandingData[country.code] : false} />
        )}

      </div>

      <Footer />
    </div>;
  }
}


Subnational.need = [(params, store) => {

  // Setup promises
  const promisesList = [];
  const countriesData = {};
  SUBNATIONAL_COUNTRIES.map((country, ix) => {
    const url = `${store.env.CANON_API}/api/search?dimension=${country.dimension}&level=${country.geoLevels.map(gl => gl.level).join(",")}&limit=100`;
    countriesData[encodeURI(url)] = country;
    promisesList.push(url);
  });

  // All promises finish
  const allPromise = Promise.all(promisesList.map(url => axios.get(url))).then(responses => {
    const finalResponse = {};
    let reponseMetadata;
    let records;
    let responseURL;
    responses.map(res => {
      responseURL = res.request.responseURL ? res.request.responseURL : res.request.res.responseUrl;
      reponseMetadata = countriesData[responseURL];
      if (reponseMetadata) {
        records = res.data.results.filter(datum =>
          datum.profile === `subnational_${reponseMetadata.code}` &&
          datum.dimension === reponseMetadata.dimension &&
          reponseMetadata.geoLevels.map(gl => gl.level).indexOf(datum.hierarchy) > -1
        );
        finalResponse[reponseMetadata.code] = d3Nest().key(d => d.hierarchy).object(records);
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
}];

export default hot(withNamespaces()(
  connect(state => ({
    locale: state.i18n.locale,
    subnationalLandingData: state.data.subnationalLandingData
  }))(Subnational)
));
