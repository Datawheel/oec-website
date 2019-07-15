import React, {Component} from "react";
import "./Home.css";
import Nav from "../components/Nav";

export default class Home extends Component {

  render() {
    return (
      <div id="Home">
        <Nav />
        <div className="bg-frame">
          <div className="ring-pulse" />
          <div className="ring-pulse echo-ring" />
          <div className="ring">
            <img className="big-logo" src="/images/big_logo.png" />
            <img className="star-rotate" src="/images/stars.png" />
            <img className="observatory" src="/images/observatory.png" />
          </div>
        </div>
      </div>
    );
  }

}
