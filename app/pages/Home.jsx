import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import {hot} from "react-hot-loader/root";
import "./Home.css";
import {profileSearchConfig} from "helpers/search";

import OECNavbar from "../components/OECNavbar";
import Footer from "../components/Footer";

import {ProfileSearch} from "@datawheel/canon-cms";
import {fetchData} from "@datawheel/canon-core";

import {titleCase} from "d3plus-text";
import {max} from "d3-array";

/** Determines font-size based on title */
function titleSize(title, large = false) {
  const length = title.length;
  const longestWord = max(length ? title.match(/\w+/g).map(t => t.length) : 0);
  if (length > 25 || longestWord > 25) return large ? "lg" : "xs";
  if (length > 15 || longestWord > 15) return large ? "xl" : "sm";
  return large ? "xxl" : "lg";
}

/** Determines tile subtitles */
function subtitle(entity) {
  const {dimension} = entity;
  let {slug} = entity;
  if (["country", "technology"].includes(slug)) return titleCase(slug);
  else if (slug === "hs92") return "Product";
  else if (slug === "firm") return "Company";
  else if (dimension.toLowerCase() !== slug.toLowerCase()) {
    if (slug && slug.match(/[A-z]{1,}/g).join("").length < 4) {
      slug = slug.toUpperCase();
    }
    else slug = titleCase(slug);
    return `${dimension} (${slug})`;
  }
  return dimension;

}

class Home extends Component {
  render() {

    const {tiles} = this.props;
    let notMobile = true;
    if (typeof window !== "undefined") {
      notMobile = window.innerWidth > 768;
    }

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

            <img key="logo" className="home-hero-logo" src="/images/big_logo.png" alt="" />
            <span key="tagline" className="home-hero-tagline u-font-md">The world’s leading data visualization tool for international trade data.</span>

            <ProfileSearch key="search"
              {...profileSearchConfig}
              inputFontSize="xl"
              position="absolute"
              showExamples={true} />

            {/* <ul key="logos" className="home-hero-sponsor-list">
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
            </ul> */}

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

        <ul className="home-grid">
          {tiles.map((tile, i) =>
            <li className={`home-grid-tile cms-profilesearch-tile${tile.large ? " home-grid-tile-large" : ""}${tile.new ? " home-grid-tile-new" : ""}`} key={i}>
              <Link to={tile.link} className="cms-profilesearch-tile-link">
                { tile.title
                  ? <div className="cms-profilesearch-tile-link-text">
                    <div className={`cms-profilesearch-tile-link-title heading u-font-${titleSize(tile.title, notMobile ? tile.large : false)}`}>{tile.title}</div>
                    { tile.category && <div className={`cms-profilesearch-tile-link-sub u-margin-top-xs u-font-${tile.large ? "md" : "xs"}`}>{tile.category}</div>}
                  </div>
                  : tile.entities.map((r, i) =>
                    <React.Fragment key={`tile-entity-${i}`}>
                      { i > 0 && <span className={`cms-profilesearch-tile-link-joiner display u-font-${tile.large ? "xl" : "md"}`}>&amp;</span> }
                      <div className="cms-profilesearch-tile-link-text">
                        <div className={`cms-profilesearch-tile-link-title heading u-font-${titleSize(r.title, notMobile ? tile.large : false)}`}>{r.title}</div>
                        <div className="cms-profilesearch-tile-link-sub u-margin-top-xs u-font-xs">{subtitle(r)}</div>
                      </div>
                    </React.Fragment>
                  ) }
              </Link>
              <div className="cms-profilesearch-tile-image-container">
                { tile.image
                  ? <div key={`tile-image-${i}`}
                    className="cms-profilesearch-tile-image"
                    style={{backgroundImage: `url(${tile.image})`}} />
                  : tile.entities.map((r, i) =>
                    <div key={`tile-image-${i}`}
                      className="cms-profilesearch-tile-image"
                      style={{backgroundImage: `url(api/image?slug=${r.slug}&id=${r.id}&size=thumb)`}} />
                  ) }
              </div>
            </li>
          )}
        </ul>

        <Footer />
      </div>
    );
  }
}

Home.need = [
  fetchData("homeTiles", "/api/home")
];

export default connect(state => ({tiles: state.data.homeTiles}))(hot(Home));
