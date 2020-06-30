import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
//  import Helmet from "react-helmet";
//  import axios from "axios";

import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";

import "./Covid.css";

class Covid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availableSubnatDatasets: [
        "trade_s_bra_ncm_m_hs",
        "trade_s_can_m_hs",
        "trade_s_chn_m_hs",
        "trade_s_deu_m_egw",
        "trade_s_jpn_m_hs",
        "trade_s_rus_m_hs",
        "trade_s_zaf_m_hs",
        "trade_s_esp_m_hs",
        "trade_s_gbr_m_hs",
        "trade_s_usa_state_m_hs"
      ]
    };
  }

  componentDidMount() {
    const {availableSubnatDatasets} =
  }

  render() {
    return (
      <div className="covid-profile">
        <OECNavbar />
        <div className="covid-content">
          <h1 className="covid-title">How has COVID affected international trade patterns?</h1>
          <div className="covid-columns">
            <div className="covid-column aside">
              <p>Buttons</p>
              <p>Buttons</p>
            </div>
            <div className="covid-column">
              <p>Content</p>
              <p>Content</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default hot(Covid);
