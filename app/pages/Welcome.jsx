import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import "./Welcome.css";

class Welcome extends Component {
  render() {
    return (
      <div className="welcome">
        <div className="welcome-bg">
          <img className="welcome-bg-img" src="/images/stars.png" />
        </div>
      </div>
    );
  }
}

export default hot(Welcome);
