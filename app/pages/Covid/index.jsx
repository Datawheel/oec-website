import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
//  import Helmet from "react-helmet";
import axios from "axios";
import {LinePlot} from "d3plus-react";

import Loading from "components/Loading";
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
      ],
      data: [],
      loading: true
    };
  }

  componentDidMount() {
    const {availableSubnatDatasets} = this.state;
    const BASE = "/olap-proxy/data";

    const promisesList = availableSubnatDatasets
      .map(cube => `${BASE}?cube=${cube}&drilldowns=Time&measures=Trade+Value&Trade+Flow=2&parents=false&sparse=false`);

    const allPromise = Promise.all(promisesList.map(url => axios.get(url))).then(responses => {
      const finalResponse = [];

      responses.map(res => {
        res.data.data.forEach(item => item["Country ID"] = res.data.source[0].name);
        finalResponse.push(res.data.data);
      });

      return finalResponse;
    });

    this.setState({
      data: allPromise,
      loading: false
    });
  }

  render() {

    const {data, loading} = this.state;

    console.log(data);

    if (loading) {
      return <Loading />;
    }

    return (
      <div className="covid-profile">
        <OECNavbar />
        <div className="covid-content">
          <h1 className="covid-title">How has COVID affected international trade patterns?</h1>
          <div className="covid-columns">
            <div className="covid-column aside">
              <p>Buttons</p>
            </div>
            <div className="covid-column">
              <LinePlot
                config={{
                  data: [
                    {id: "alpha", x: 4, y: 9},
                    {id: "alpha", x: 5, y: 17},
                    {id: "alpha", x: 6, y: 13},
                    {id: "beta",  x: 4, y: 17},
                    {id: "beta",  x: 5, y: 8},
                    {id: "beta",  x: 6, y: 16},
                    {id: "gamma",  x: 4, y: 14},
                    {id: "gamma",  x: 5, y: 9},
                    {id: "gamma",  x: 6, y: 11}
                  ],
                  groupBy: "id",
                  lineLabels: true,
                  x: "x",
                  y: "y"
                }}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default hot(Covid);
