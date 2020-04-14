import React, {Component} from "react";
import {Helmet} from "react-helmet";
import OECNavbar from "components/OECNavbar";
import Error from "components/Error";
import Footer from "components/Footer";

export default class ErrorPage extends Component {

  render() {

    return (
      <div className="ErrorPage">
        <Helmet title="Error" />
        <OECNavbar />
        <Error />
        <Footer />
      </div>
    );
  }
}
