import React, {Component} from "react";
import {connect} from "react-redux";
import {hot} from "react-hot-loader/root";
import "./Reset.css";

import {Reset as CanonReset} from "@datawheel/canon-core";
import OECNavbar from "../../components/OECNavbar";
import Footer from "../../components/Footer";

class Reset extends Component {

  render() {

    const {locale, router} = this.props;

    return (
      <div className="reset-page">
        <OECNavbar />
        <div className="reset-page-content">
          <h1 className="reset-page-title">Password Reset</h1>
          <h3 className="reset-page-subtitle">Please select a new password</h3>
          <div className="reset-page-form">
            <CanonReset redirect={`/${locale}/login`} router={router} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

}

export default connect(state => ({
  locale: state.i18n.locale
}))(hot(Reset));
