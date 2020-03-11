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
  ]},
  {title: "🇨🇦 Canada Subnational", slug: "subnat-can", items: [
    {title: "Chilean Wine Exports to USA", url: "?"},
    {title: "Car Exports", url: "?"},
    {title: "Brazil Exports", url: "?"},
    {title: "United Kingdom Exports of Jet Engines", url: "?"},
    {title: "USA vs China World Trade", url: "?"}
  ]},
  {title: "🇩🇪 Germany Subnational", slug: "subnat-deu", items: [
    {title: "Chilean Wine Exports to USA", url: "?"},
    {title: "Car Exports", url: "?"},
    {title: "Brazil Exports", url: "?"},
    {title: "United Kingdom Exports of Jet Engines", url: "?"},
    {title: "USA vs China World Trade", url: "?"}
  ]},
  {title: "🇯🇵 Japan Subnational", slug: "subnat-jpn", items: [
    {title: "Chilean Wine Exports to USA", url: "?"},
    {title: "Car Exports", url: "?"},
    {title: "Brazil Exports", url: "?"},
    {title: "United Kingdom Exports of Jet Engines", url: "?"},
    {title: "USA vs China World Trade", url: "?"}
  ]},
  {title: "🇷🇺 Russia Subnational", slug: "subnat-rus", items: [
    {title: "Chilean Wine Exports to USA", url: "?"},
    {title: "Car Exports", url: "?"},
    {title: "Brazil Exports", url: "?"},
    {title: "United Kingdom Exports of Jet Engines", url: "?"},
    {title: "USA vs China World Trade", url: "?"}
  ]},
  {title: "🇪🇸 Spain Subnational", slug: "subnat-esp", items: [
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
            <h1>OEC Trade Predictions</h1>
            <p>
            The predictions shown in this tool use a long short-term memory model or LSTM. The LSTM approach is a form of machine learning which utilizes a recurrent neural network. In the case of the predictions shown on this page we are using a data time series (based on the user selected dataset) as input for the model. The model is then able to learn order dependence and produce a sequence prediction.
            </p>
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
