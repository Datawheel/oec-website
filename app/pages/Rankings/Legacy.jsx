import React, {Component} from 'react';
import Helmet from "react-helmet";

import RankingText from 'components/RankingText';

export default class Legacy extends Component {
  state = {}
  render() {
    return (
      <div className="rankings-page">
        <div className="rankings-content">
          <Helmet title="Legacy Rankings" />

          <RankingText type={'static'} title={"Legacy Rankings"}/>

        </div>
      </div>
    );
  }
}
