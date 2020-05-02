import React, {Component} from 'react';
import Helmet from "react-helmet";
import axios from 'axios';

import RankingText from 'components/RankingText';
import RankingTable from 'components/RankingTable';

export default class Legacy extends Component {
  state = {}

  fetchData = (path, type) => {
    axios.get(path).then((resp) => {
      const data = resp.data.data;
      console.log(data);
      // Get list of unique countries/products
      const unique = [...new Set(data.map((m) => m.Subtopic1))];
    });
  };

  componentDidMount() {
    const path = '/olap-proxy/data.jsonrecords?cube=legacy_complexity_eci_a&drilldowns=Country%2CYear&measures=ECI&parents=false&sparse=false';
    this.fetchData(path);
  }

  render() {
    return (
      <div className="rankings-page">
        <div className="rankings-content">
          <Helmet title="Legacy Rankings" />

          <RankingText type={'legacy'} title={"Legacy Rankings"} />

        </div>
      </div>
    );
  }
}
