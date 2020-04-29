import React, {Component} from 'react';
import Helmet from "react-helmet";

import RankingText from 'components/RankingText';

export default class HECI extends Component {
  state = {}
  render() {
    return (
      <div className="rankings-page">
        <div className="rankings-content">
          <Helmet title="Historical ECI Rankings" />

          <RankingText type={'static'} title={"1995-2018 ECI Ranking"}/>

        </div>
      </div>
    );
  }
}
