import React, {Component} from "react";
import "./Welcome.css";

export default class Home extends Component {
  render() {
    return (
      <div className="welcome">
        <img className="welcome-bg" src="/images/stars.png" />
      </div>
    );
  }
}
