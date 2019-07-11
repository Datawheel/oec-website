import React from "react";
import PropTypes from "prop-types";

import {fetchData} from "@datawheel/canon-core";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";
import {Geomap} from "d3plus-react";

// import {Profile as CMSProfile, Topic} from "@datawheel/canon-cms";
import libs from "@datawheel/canon-cms/src/utils/libs";
import {Section} from "@datawheel/canon-cms";

import "./styles.css";

class Profile extends React.Component {

  getChildContext() {
    const {formatters, locale, profile, router} = this.props;
    const {variables} = profile;

    return {
      formatters: formatters.reduce((acc, d) => {
        const f = Function("n", "libs", "formatters", d.logic);
        const fName = d.name.replace(/^\w/g, chr => chr.toLowerCase());
        acc[fName] = n => f(n, libs, acc);
        return acc;
      }, {}),
      router,
      variables,
      locale
    };
  }

  render() {
    const {title, subtitle, sections, variables} = this.props.profile;
    const {id, name} = variables;
    return <div id="Profile">
      <header className="hero country" style={{backgroundImage: `url(/images/headers/country/${variables.iso3}.jpg)`}}>
        <div>
          <Geomap
            config={{
              data: [],
              height: 250,
              width: 250,
              zoom: false,
              topojsonId: "id",
              topojsonKey: "id",
              fitObject: !["usa", "rus"].includes(variables.iso3)
                ? `/topojson/${variables.iso3}.topo.json` : "/json/world.json",
              topojson: !["usa", "rus"].includes(variables.iso3)
                ? `/topojson/${variables.iso3}.topo.json` : "/json/world.json",
              ocean: "transparent",
              total: false
            }}
          />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            <img className="hero-icon" src={`/images/icons/country/country_${variables.iso3}.png`} alt=""/>
            {name}</h1>
          <div className="hero-stats">
            <div className="stat">XXX</div>
            <div className="stat">XXX</div>
            <div className="stat">XXX</div>
            <div className="stat">XXX</div>
          </div>
        </div>
      </header>


      <div className="sections">
        {sections.map(section => <Section
          key={section.slug}
          router={this.props.router}
          contents={section}
        />)}
      </div>
    </div>;
  }
}

Profile.need = [
  fetchData("profile", "/api/profile/?slug1=<pslug>&id1=<pid>&locale=<i18n.locale>"),
  fetchData("formatters", "/api/formatters")
];

Profile.childContextTypes = {
  formatters: PropTypes.object,
  locale: PropTypes.string,
  router: PropTypes.object,
  variables: PropTypes.object
};

export default withNamespaces()(
  connect(state => ({
    formatters: state.data.formatters,
    locale: state.i18n.locale,
    profile: state.data.profile
  }))(Profile)
);

