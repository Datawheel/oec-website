import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import "./index.css";

import OECNavbar from "../../components/OECNavbar";
import Footer from "../../components/Footer";
import Error from "../../components/Error";

import About from "./About";
import Api from "./Api";
import Data from "./Data";
import Definitions from "./Definitions";
import Faq from "./Faq";
import Library from "./Library";
import Methodology from "./Methodology";
import Permissions from "./Permissions";
import Privacy from "./Privacy";
import Publications from "./Publications";
import Terms from "./Terms";

class Resources extends Component {
  render() {
    const {page} = this.props.router.params;

    if (page === "publications") {
      return (
        <div className="publications-content">
          <OECNavbar />
          <Publications />
          <Footer />
        </div>
      );
    }

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
              case "definitions":
                return <Definitions />;
              case "faq":
                return <Faq />;
              case "library":
                return <Library />;
              case "methodology":
                return <Methodology />;
              case "permissions":
                return <Permissions />;
              case "privacy":
                return <Privacy />;
              case "terms":
                return <Terms />;
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
