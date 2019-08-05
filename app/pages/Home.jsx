import React, {Component} from "react";
import "./Home.css";
import "../Profile.css";

import Nav from "../components/Nav";
import Footer from "../components/Footer";

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
            <p className="info">
              We are the world's leading visualization engine for international trade data.
              <a href="" className="more-info">Learn More</a>
            </p>
            <div className="launch-video">Watch a video</div>
            <div type="text" className="search-home">Search</div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

}
