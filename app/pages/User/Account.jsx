import React, {Component} from "react";
import {connect} from "react-redux";
import {hot} from "react-hot-loader/root";
import "./Account.css";

import OECNavbar from "../../components/OECNavbar";
import Footer from "../../components/Footer";

class Account extends Component {

  render() {

    return (
      <div className="account">
        <OECNavbar />
        <a href="/auth/logout">Click here to log out.</a>
        <Footer />
      </div>
    );
  }

}

export default connect(state => ({auth: state.auth}))(hot(Account));
