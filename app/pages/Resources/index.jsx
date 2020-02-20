import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import "./index.css";

import OECNavbar from "../../components/OECNavbar";
import Footer from "../../components/Footer";

import Error from "../../components/Error";
import Privacy from "./Privacy";
import Terms from "./Terms";

class Resources extends Component {

  render() {

    const {page} = this.props.router.params;

    return (
      <div className="resources">
        <OECNavbar />
        <div className="resources-content">
          { (function() {
            switch (page) {
              case "privacy":
                return <Privacy />;
              case "terms":
                return <Terms />;
              default:
                return <Error />;
            }
          }()) }
        </div>
        <Footer />
      </div>
    );
  }

}

export default hot(Resources);
