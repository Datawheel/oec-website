import React from "react";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

class Vizbuilder extends React.Component {
  render() {
    return <div>Hello</div>;
  }
}

export default withNamespaces()(connect()(Vizbuilder));
