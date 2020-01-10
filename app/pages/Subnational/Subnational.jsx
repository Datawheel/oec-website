import React, {Fragment} from "react";
import {hot} from "react-hot-loader/root";
import PropTypes from "prop-types";

import {fetchData} from "@datawheel/canon-core";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import libs from "@datawheel/canon-cms/src/utils/libs";
import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";
import "./Subnational.css";

import {SUBNATIONAL} from "helpers/consts";

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
      <OECNavbar
        className={scrolled ? "background" : ""}
        title={scrolled ? "Subnational" : ""}
      />

      <div className="welcome">
        {/* spinning orb thing */}
        <div className="welcome-bg">
          <img className="welcome-bg-img" src="/images/stars.png" alt="" draggable="false" />
        </div>

        {/* entity selection form */}
        <div className="subnat-list-outer">
          <h1>Countries with Subnational Trade Data</h1>
          {SUBNATIONAL.map(country =>
            <div key={country.title}>
              <h2>{country.title}</h2>
              {country.items.map(subnationalGroup =>
                <Fragment key={subnationalGroup.title}>
                  <h3 className="nav-group-subtitle display">{subnationalGroup.title}</h3>
                  <ul className="nav-group-list nav-group-nested-list">
                    {subnationalGroup.items.map(subnation =>
                      <li className="nav-group-item nav-group-nested-item" key={`${country.title}-${subnationalGroup.title}-${subnation.title}`}>
                        <a href={subnation.url} className="nav-group-link" onFocus={() => this.setState({isOpen: true})}>
                          {subnation.title}
                        </a>
                      </li>
                    )}
                  </ul>
                </Fragment>
              )}
            </div>
          )}
        </div>

      </div>

      <Footer />
    </div>;
  }
}


Subnational.need = [
];

Subnational.childContextTypes = {
  formatters: PropTypes.object,
  locale: PropTypes.string,
  router: PropTypes.object
};


export default hot(withNamespaces()(
  connect(state => ({
    formatters: state.data.formatters,
    locale: state.i18n.locale
  }))(Subnational)
));
