import React from "react";
import {hot} from "react-hot-loader/root";
import {withNamespaces} from "react-i18next";
import OECNavbar from "components/OECNavbar";

const locale = "en";
const predictionTiles = [
  // profiles
  {title: "🌐 World Trade (Annual)", slug: "trade-annual", items: [
    {title: "USA vs China World Trade", url: "?"},
    {title: "Brazil Exports", url: "?"},
    {title: "United Kingdom Exports of Jet Engines", url: "?"},
    {title: "Chilean Wine Exports to USA", url: "?"},
    {title: "Car Exports", url: "?"}
  ]},
  {title: "🌐 World Trade (Monthly)", slug: "trade-monthly", items: [
    {title: "Chilean Wine Exports to USA", url: "?"},
    {title: "Car Exports", url: "?"},
    {title: "Brazil Exports", url: "?"},
    {title: "United Kingdom Exports of Jet Engines", url: "?"},
    {title: "USA vs China World Trade", url: "?"}
  ]}
];

class PredictionLanding extends React.Component {
  render() {

    return <div className="prediction" onScroll={this.handleScroll}>
      <OECNavbar />

      <div className="welcome">
        {/* spinning orb thing */}
        <div className="welcome-bg">
          <img className="welcome-bg-img" src="/images/home/stars.png" alt="" draggable="false" />
        </div>

        {/* entity selection form */}
        <div className="prediction-about-outer">
          <div className="prediction-about-l">
            Predictions
          </div>
          <div className="prediction-about-r">
            {predictionTiles.map(tileGroup =>
              <React.Fragment key={tileGroup.title}>
                <h2><a href={`/${locale}/prediction/${tileGroup.slug}`}>{tileGroup.title}</a></h2>
                <ul>
                  {tileGroup.items.map(tile =>
                    <li key={tile.title}>
                      <div className="prediction-bg"></div>
                      <a href={`/${locale}/prediction/${tileGroup.slug}${tile.url}`}>{tile.title}</a>
                    </li>
                  )}
                </ul>
              </React.Fragment>
            )}
          </div>
        </div>

      </div>
    </div>;
  }
}



export default hot(withNamespaces()(PredictionLanding));
