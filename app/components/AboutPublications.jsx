import React from "react";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

class AboutPublications extends React.Component {
  state = {}
  render() {
    return (
      <div className="about-publications">
        Hello World
      </div>
    );
  }
}

export default withNamespaces()(connect()(AboutPublications));
