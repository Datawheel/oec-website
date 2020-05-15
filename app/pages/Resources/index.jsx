import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {hot} from "react-hot-loader/root";

import OECNavbar from "../../components/OECNavbar";
import Footer from "../../components/Footer";
import Error from "../../components/Error";

import About from "./About";
import Api from "./Api";
import Data from "./Data";
import Library from "./Library";
import Methodology from "./Methodology";
import Privacy from "./Privacy";
import Publications from "./Publications";
import Terms from "./Terms";
import DataMatrix from "components/DataMatrix";

import "./index.css";
import "../User/Subscription.css";

class Resources extends Component {
  render() {
    const {page} = this.props.router.params;

    if (page === "publications") {
      return (
        <div className="publications-content">
          <OECNavbar />
          <Publications />
          <Footer />
        </div>
      );
    }

    if (page === "library") {
      return (
        <div className="library-content">
          <OECNavbar />
          <Library />
          <Footer />
        </div>
      );
    }

    if (page === "data-availability") {
      return (
        <div className="subscription">
          <OECNavbar />
          <div className="subscription-content">
            <h1 className="data-matrix-title">Data Availability</h1>
            <DataMatrix />
          </div>
          <Footer />
        </div>
      );
    }

    return (
      <div className="resources">
        <OECNavbar />
        <div className="resources-content">
          {(function() {
            switch (page) {
              case "about":
                return <About />;
              case "api":
                return <Api />;
              case "data":
                return <Data />;
              case "methods":
                return <Methodology />;
              case "privacy":
                return <Privacy />;
              case "terms":
                return <Terms />;
              default:
                return <Error />;
            }
          }())}
        </div>
        <Footer />
      </div>
    );
  }
}

Resources.contextTypes = {
  router: PropTypes.object
};

Resources.need = [
  DataMatrix
];

export default connect(state => ({
  auth: state.auth,
  locale: state.i18n.locale
}))(hot(Resources));
