import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {hot} from "react-hot-loader/root";
import "./Subscription.css";

import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";
import FeatureMatrix from "components/FeatureMatrix";
import DataMatrix from "components/DataMatrix";


class Subscription extends Component {

  render() {

    return (
      <div className="subscription">
        <OECNavbar />
        <div className="subscription-content">
          <FeatureMatrix />
          <DataMatrix />
        </div>
        <Footer />
      </div>
    );
  }

}

Subscription.contextTypes = {
  router: PropTypes.object
};

Subscription.need = [
  DataMatrix
];

export default connect(state => ({
  auth: state.auth,
  locale: state.i18n.locale
}))(hot(Subscription));
