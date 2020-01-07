import React, {Fragment} from "react";
import {hot} from "react-hot-loader/root";
import PropTypes from "prop-types";
import axios from "axios";

import {fetchData} from "@datawheel/canon-core";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import libs from "@datawheel/canon-cms/src/utils/libs";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import SubnationalMap from "./SubnationalMap";

import {nest as d3Nest} from "d3-collection";

import "./Subnational.css";

import {SUBNATIONAL_COUNTRIES} from "helpers/consts";

class Subnational extends React.Component {
  state = {
    scrolled: false
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    if (window.scrollY > 5) {
      this.setState({scrolled: true});
    }
    else {
      this.setState({scrolled: false});
    }

  };

  render() {
    const {scrolled} = this.state;

    return <div className="subnational" onScroll={this.handleScroll}>
      <Navbar
        className={scrolled ? "background" : ""}
        title={scrolled ? "Subnational" : ""}
      />

      {/* spinning orb thing */}
      <div className="welcome-bg">
        <img className="welcome-bg-img" src="/images/stars.png" alt="" draggable="false" />
      </div>

      <div className="subnational-content">

        <h1>Subnational Countries</h1>

        {SUBNATIONAL_COUNTRIES.map((country, ix) =>
          <SubnationalMap key={`subnational-country-${ix}`} country={country} />
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
    responses.map(res => {
      reponseMetadata = countriesData[res.request.responseURL];
      if (reponseMetadata) {
        records = res.data.results.filter(datum =>
          datum.profile === `subnational_${reponseMetadata.code}` &&
          datum.dimension === reponseMetadata.dimension &&
          reponseMetadata.geoLevels.map(gl => gl.level).indexOf(datum.hierarchy) > -1
        );
        finalResponse[reponseMetadata.code] = d3Nest().key(d => d.hierarchy).object(records);
      }
      else {
        console.warn("responseURL", res.request);
        console.warn("not in", Object.keys(countriesData));
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
    locale: state.i18n.locale
  }))(Subnational)
));
