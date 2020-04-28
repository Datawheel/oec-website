import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import "./index.css";

import OECNavbar from "../../components/OECNavbar";
import Footer from "../../components/Footer";
import Error from "../../components/Error";

import ECI from "./ECI";
import HECI from "./HECI";
import PCI from "./PCI";
import HPCI from "./HPCI";
import Custom from "./Custom";
import Legacy from "./Legacy";

class Rankings extends Component {
  render() {
    const {page} = this.props.router.params;

    return (
      <div >
        <OECNavbar />
        {(function () {
          switch (page) {
            case "eci":
              return <ECI />;
            case "heci":
              return <HECI />;
            case "pci":
              return <PCI />;
            case "hpci":
              return <HPCI />;
            case "custom":
              return <Custom />;
            case "legacy":
              return <Legacy />;
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
