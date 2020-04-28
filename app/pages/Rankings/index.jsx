import React, {Component} from "react";
import {hot} from "react-hot-loader/root";

import OECNavbar from "../../components/OECNavbar";
import Footer from "../../components/Footer";
import Error from "../../components/Error";

import Custom from "./Custom";

class Rankings extends Component {
  render() {
    const {page} = this.props.router.params;

    return (
      <div >
        <OECNavbar />
        {(function () {
          switch (page) {
            case "custom":
              return <Custom />;
            default:
              return <Error />;
          }
        }())}
        <Footer />
      </div>
    );
  }
}

export default hot(Rankings);
