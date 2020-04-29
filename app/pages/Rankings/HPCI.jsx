import React, {Component} from 'react';
import Helmet from "react-helmet";

import RankingText from 'components/RankingText';

export default class HPCI extends Component {
  state = {}
  render() {
    return (
      <div className="rankings-page">
        <div className="rankings-content">
          <Helmet title="Historical PCI Rankings" />

          <RankingText type={'static'} title={"1995-2018 PCI Ranking"}/>

        </div>
      </div>
    );
  }
}
