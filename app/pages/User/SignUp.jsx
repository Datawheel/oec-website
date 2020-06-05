import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import {hot} from "react-hot-loader/root";
import "./SignUp.css";

import SignUpForm from "components/SignUpForm";
import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";

class SignUp extends Component {

  render() {

    const {locale} = this.props;

    return (
      <div className="signup-page">
        <OECNavbar />
        <div className="signup-page-content">
          <h1 className="signup-page-title">Welcome to the OEC</h1>
          <h3 className="signup-page-subtitle">Register for the OEC pro today, and enjoy unlimited access to all of our premium features for free until <strong>September 1st 2020</strong>.</h3>
          <div className="signup-page-form">
            <SignUpForm redirect={`/${locale}/account`} />
            <div className="signup-page-signup">
              Already have an account? <Link to={`/${locale}/login`}>Login</Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

}

export default connect(state => ({
  auth: state.auth,
  locale: state.i18n.locale
}))(hot(SignUp));
