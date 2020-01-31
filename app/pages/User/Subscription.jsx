import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {hot} from "react-hot-loader/root";
import "./Subscription.css";

import {NonIdealState, Spinner} from "@blueprintjs/core";

import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";
import FeatureMatrix from "components/FeatureMatrix";


class Account extends Component {

  componentDidUpdate(prevProps) {
    const {loading, user} = this.props.auth;
    if (prevProps.auth.loading !== loading) {
      const {locale, router} = this.props;
      if (!user) router.push(`/${locale}/login?redirect=/${locale}/account`);
      else if (user.role > 0) router.push(`/${locale}/account`);
    }
  }

  render() {

    const {user} = this.props.auth;

    return (
      <div className="subscription">
        <OECNavbar />
        <div className="subscription-content">
          { user ? <FeatureMatrix /> : <NonIdealState icon={<Spinner />} title="Authenticating" /> }
        </div>
        <Footer />
      </div>
    );
  }

}

Account.contextTypes = {
  router: PropTypes.object
};

export default connect(state => ({
  auth: state.auth,
  locale: state.i18n.locale
}))(hot(Account));
