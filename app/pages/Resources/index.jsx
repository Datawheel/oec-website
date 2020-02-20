import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import "./index.css";

import OECNavbar from "../../components/OECNavbar";
import Footer from "../../components/Footer";
import Error from "../../components/Error";

import About from "./About";
import Api from "./Api";
import Data from "./Data";
import Faq from "./Faq";
import Methodology from "./Methodology";
import Permissions from "./Permissions";
import Privacy from "./Privacy";
import Publications from "./Publications";

class Resources extends Component {
  render() {
    const {page} = this.props.router.params;

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
              case "faq":
                return <Faq />;
              case "methodology":
                return <Methodology />;
              case "permissions":
                return <Permissions />;
              case "privacy":
                return <Privacy />;
              case "publications":
                return <Publications />;
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

export default hot(Resources);
