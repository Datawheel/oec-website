import axios from "axios";
import React, {Component} from "react";
import {Helmet} from "react-helmet";
import OECNavbar from "components/OECNavbar";
import {connect} from "react-redux";
import {hot} from "react-hot-loader/root";

class Keytest extends Component {

  generateKey() {
    //
  }

  render() {

    const {auth} = this.props;
    const {user} = auth;
    const {apikey} = user;

    return (
      <div>
        <Helmet title="API Generation" />
        <OECNavbar />
        <p style={{
          marginTop: "100px",
          width: "100%",
          display: "block",
          padding: "20px",
          color: "white"
        }}>
          key: {apikey}
        </p>
        <button>regen</button>
      </div>
    );
  }
}

export default connect(state => ({
  auth: state.auth
}))(hot(Keytest));
