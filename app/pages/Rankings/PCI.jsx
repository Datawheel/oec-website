import React, {Component} from 'react';
import Helmet from "react-helmet";

import RankingText from 'components/RankingText';

export default class PCI extends Component {
  state = {}
  render() {
    const {depth, rev} = this.props;
    console.log(depth, rev);

    return (
      <div className="rankings-page">
        <div className="rankings-content">
          <Helmet title="2018 PCI Rankings" />

          <RankingText type={'static'} title={"PCI Ranking"}/>

        </div>
      </div>
    );
  }
}
