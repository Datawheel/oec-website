import React, {Component} from "react";
import {NonIdealState} from "@blueprintjs/core";
import "./Error.css";

export default class Error extends Component {
  render() {
    return <NonIdealState
      className="app-error"
      title="404 Page Not Found"
      icon="error" />;
  }
}
