import React, {Component} from "react";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";
import {NonIdealState, Spinner} from "@blueprintjs/core";
import "./Loading.css";

/**
  This component is displayed when the needs of another component are being
  loaded into the redux store.
*/
class Loading extends Component {
  render() {
    const {t} = this.props;
    return <NonIdealState
      className="app-loading"
      title={t("Loading.title")}
      icon={<Spinner />} />;
  }
}

export default withNamespaces()(connect(
  (state, ownProps) => "total" in ownProps ? {
    total: ownProps.total,
    progress: ownProps.progress
  } : {
    total: state.loadingProgress.requests,
    progress: state.loadingProgress.fulfilled
  }
)(Loading));
