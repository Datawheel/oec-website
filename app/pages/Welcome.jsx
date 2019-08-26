import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import "./Welcome.css";

class Welcome extends Component {
  render() {
    return (
      <div className="welcome">
        <img className="welcome-bg" src="/images/stars.png" />
      </div>
    );
  }
}

export default hot(Welcome);
