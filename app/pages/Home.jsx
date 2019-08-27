import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import "./Home.css";

import Nav from "../components/Nav";
import Footer from "../components/Footer";

class Home extends Component {
  render() {
    return (
      <div className="home">
        <Nav />

        <div className="bg-frame">
          <div className="ring-pulse" />
          <div className="ring-pulse echo-ring" />
          <div className="ring">
            <img className="big-logo" src="/images/big_logo.png" alt="" />
            <img className="star-rotate" src="/images/stars.png" alt="" />
            <img className="observatory" src="/images/observatory.png" alt="" />
            <p className="info">
              We are the world’s leading visualization engine for international trade data.
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

export default hot(Home);
