import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router";
import {hot} from "react-hot-loader/root";
import "./Login.css";

import {Login as CanonLogin} from "@datawheel/canon-core";
import OECNavbar from "../../components/OECNavbar";
import Footer from "../../components/Footer";

class Login extends Component {

  constructor(props) {
    super(props);
    const {query} = props.router.location;
    this.state = {
      redirect: query.redirect || "/"
    };
  }

  render() {

    const {locale} = this.props;
    const {redirect} = this.state;

    return (
      <div className="login-page">
        <OECNavbar />
        <div className="login-page-content">
          <h1 className="login-page-title">Welcome Back</h1>
          <h3 className="login-page-subtitle">Please login to your account</h3>
          <div className="login-page-form">
            <CanonLogin redirect={redirect} />
            <div className="login-page-signup">
              Not a member yet? <Link to={`/${locale}/signup`}>Register</Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

}

Login.contextTypes = {
  router: PropTypes.object
};

export default connect(state => ({
  auth: state.auth,
  locale: state.i18n.locale
}))(hot(Login));
