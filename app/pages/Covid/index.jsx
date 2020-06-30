import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
//  import Helmet from "react-helmet";
//  import axios from "axios";

import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";

class Covid extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <OECNavbar />
        <div>
          <h1>COVID-19</h1>
        </div>
        <Footer />
      </div>
    );
  }

}

export default hot(Covid);
