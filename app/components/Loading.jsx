import React, {Component} from "react";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";
import {NonIdealState, Spinner} from "@blueprintjs/core";
import "./Loading.css";
import "./OECNavbar.css";

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LOADING_ITEMS = [
  {img: "/images/loading/loading_1_History.png", txt: [
    "Did you know the OEC has been around since 2011?",
    "Born as a research project at MIT, today the OEC is a professional tool serving data to millions of users every year.",
    "Learn about the history of the OEC in the <b>about section</b>."
  ]},
  {img: "/images/loading/loading_2_ECI.png", txt: [
    "The Economic Complexity Index (ECI) is a measure of economic capacity that is predictive of income, economic growth, income inequality & greehouse gas emissions. Technically, ECI is a principal component of a matrix connecting similar locations.",
    "Learn more about ECI in the <b>OEC Academy</b>."
  ]},
  {img: "/images/loading/loading_3_Predictions.png", txt: [
    "Looking for a forecasting tool?",
    "The <b>OEC prediction section</b> allows you to create custom LSTM models and fit them directly over any of the millions of time series we have available."
  ]},
  {img: "/images/loading/loading_4_Library.png", txt: [
    "Want to keep up with research on Economic Complexity?",
    "The <b>OEC library</b> has a curated list of hundreds of papers organized by topics and geography."
  ]}
];

/**
  This component is displayed when the needs of another component are being
  loaded into the redux store.
*/
class Loading extends Component {
  render() {
    const {isDark, t} = this.props;
    const items = shuffle(LOADING_ITEMS);
    return <div className="app-loading">
      <div className="oec-loader-shell">
        <header>
          <img className="navbar-logo-img" src={`/images/oec-logo${isDark ? "-dark" : ""}.svg`} alt="Observatory of Economic Complexity" draggable="false" />
          <Spinner size={30} />
          <h3 className="heading u-font-xl">{t("Loading.title")}...</h3>
        </header>
        <div className="oec-loader-body">
          <div className="oec-loader-fade-container">
            {items.map(item =>
              <div className="oec-loader-fader" key={item.img}>
                <img src={item.img} />
                {item.txt.map((t, i) => <p key={i} dangerouslySetInnerHTML={{__html: t}} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>;
  }
}

Loading.defaultProps = {
  isDark: false
};

export default withNamespaces()(connect(
  (state, ownProps) => "total" in ownProps ? {
    total: ownProps.total,
    progress: ownProps.progress
  } : {
    total: state.loadingProgress.requests,
    progress: state.loadingProgress.fulfilled
  }
)(Loading));
