import React from "react";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import {FAQ} from "helpers/about";

class AboutFAQ extends React.Component {
  state = {}
  render() {
    const {t} = this.props;
    console.log(FAQ);
    return (
      <div className="about-faq">
        Aqui ira el FAQ
      </div>
    );
  }
}

export default withNamespaces()(connect()(AboutFAQ));
