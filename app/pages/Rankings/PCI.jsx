import React, {Component} from 'react';
import Helmet from "react-helmet";

import RankingText from 'components/RankingText';

export default class PCI extends Component {
  state = {}
  render() {
    return (
      <div className="rankings-page">
        <div className="rankings-content">
          <Helmet title="2018 PCI Rankings" />

          <RankingText type={'static'} title={"2018 PCI Ranking"}/>

        </div>
      </div>
    );
  }
}
