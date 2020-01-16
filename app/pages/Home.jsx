import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import "./Home.css";

import OECNavbar from "../components/OECNavbar";
import Footer from "../components/Footer";

import {ProfileSearch} from "@datawheel/canon-cms";

class Home extends Component {
  render() {
    return (
      <div className="home">
        <OECNavbar />

        <div className="home-hero">

          <div className="home-hero-skybox">
            <div className="home-hero-sky">
              <div className="home-hero-stars"></div>
              <div className="home-hero-twinkling"></div>
            </div>
          </div>

          <div className="home-hero-content">

            <img className="home-hero-logo" src="/images/big_logo.png" alt="" />
            <span className="home-hero-tagline u-font-md">The world’s leading data visualization tool for international trade data.</span>

            <ProfileSearch position="absolute" inputFontSize="xl" />

            {/* logos */}
            <ul className="home-hero-sponsor-list">
              <li className="home-hero-sponsor-item">
                <a href="https://www.iadb.org" className="home-hero-sponsor-link">
                  <img
                    className="home-hero-sponsor-img"
                    src="/images/logos/idb-logo.svg"
                    alt="Inter-American Development Bank"
                    draggable="false"
                  />
                </a>
              </li>
              <li className="home-hero-sponsor-item">
                <a href="https://www.datawheel.us/" className="home-hero-sponsor-link">
                  <img
                    className="home-hero-sponsor-img"
                    src="/images/logos/datawheel-logo.svg"
                    alt="Datawheel"
                    draggable="false"
                  />
                </a>
              </li>
            </ul>

          </div>
          {/* <div className="home-hero-video">
            <iframe id="vimeo_embed" src="https://player.vimeo.com/video/351708375?autoplay=0&amp;api=1&amp;color=ffffff&amp;title=0&amp;byline=0&amp;portrait=0" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen=""></iframe>
          </div> */}
          <div className="home-hero-observatory">
            <img src="/images/home/observatory.png" alt="" />
          </div>
          {/* <p className="info">
              We are the world’s leading visualization engine for international trade data.
            <a href="" className="more-info">Learn More</a>
          </p>
          <div className="launch-video">Watch a video</div> */}
        </div>

        <Footer />
      </div>
    );
  }
}

export default hot(Home);
