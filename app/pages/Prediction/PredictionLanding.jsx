import React from "react";
import {hot} from "react-hot-loader/root";
import {withNamespaces} from "react-i18next";
import OECNavbar from "components/OECNavbar";

const locale = "en";
const predictionTiles = [
  // profiles
  {title: "🌐 World Trade (Annual)", slug: "trade-annual", items: [
    {title: "USA vs China World Trade", url: "?drilldown=origins&origins=nausa,aschn"},
    {title: "Brazil Exports", url: "?drilldown=origins&origins=sabra"},
    {title: "United Kingdom Exports of Jet Engines", url: "?drilldown=products&origins=eugbr&products=168409"},
    {title: "Chilean Wine Exports to USA", url: "?destinations=nausa&drilldown=products&origins=sachl&products=42204"},
    {title: "Car Exports", url: "?drilldown=products&products=178703"}
  ]},
  {title: "🌐 World Trade (Monthly)", slug: "trade-monthly", items: [
    {title: "Japanese Car Exports", url: "?drilldown=products&origins=asjpn&products=178703"},
    {title: "Chilean and Argentinian Exports of Apples", url: "?drilldown=origins&origins=sachl,saarg&products=20808"},
    {title: "Italian and Spanish Exports of Olive Oil", url: "?drilldown=origins&origins=euita,euesp&products=31510"},
    {title: "South African Exports of Aluminum to Thailand and Japan", url: "?destinations=astha,asjpn&drilldown=destinations&origins=afzaf&products=157601"},
    {title: "USA Monthly Trade", url: "?drilldown=origins&origins=nausa"}
  ]},
  {title: "🇨🇦 Canada Subnational", slug: "subnat-can", items: [
    {title: "Ontario vs Quebec", subtitle: "Total Exports", url: "?drilldown=subnats&subnats=24,35&trade_flow=2"},
    {title: "France vs UK", subtitle: "Destinations of Plane Exports from Quebec", url: "?destinations=eufra,eugbr&drilldown=destinations&products=178802&subnats=24&trade_flow=2"},
    {title: "Japan vs Mexico", subtitle: "Export Destinations", url: "?destinations=asjpn,namex&drilldown=destinations&trade_flow=2"},
    {title: "Alberta vs Saskatchewan", subtitle: "Crude Petroleum Exports",  url: "?drilldown=subnats&products=52709&subnats=48,47&trade_flow=2"},
    {title: "USA vs Japan", subtitle: "Car Imports to British Colombia", url: "?destinations=asjpn,nausa&drilldown=destinations&products=178703&subnats=59&trade_flow=1"}
  ]},
  {title: "🇩🇪 Germany Subnational", slug: "subnat-deu", items: [
    {title: "North Rhine-Westphalia vs Baden-Württemberg", subtitle: "Total Exports", url: "?drilldown=subnats&subnats=10,1&trade_flow=2"},
    {title: "USA vs UK vs China", subtitle: "Destinations of Car Exports from Bavaria", url: "?destinations=nausa,eugbr,aschn&drilldown=destinations&products=885&subnats=2&trade_flow=2"},
    {title: "The Netherlands vs China", subtitle: "Export Destinations from North Rhine-Westphalia", url: "?destinations=aschn,eunld&drilldown=destinations&subnats=10&trade_flow=2"},
    {title: "North Rhine-Westphalia vs Schleswig-Holstein", subtitle: "Beer Exports", url: "?drilldown=subnats&products=421&subnats=15,10&trade_flow=2"},
    {title: "China vs Malaysia", subtitle: "Electronic Devices to Bavaria", url: "?destinations=aschn,asmys&drilldown=destinations&products=865&subnats=2&trade_flow=1"}
  ]},
  {title: "🇯🇵 Japan Subnational", slug: "subnat-jpn", items: [
    {title: "Chiba vs Aichi", subtitle: "Total Exports", url: "?drilldown=subnats&subnats=12,23&trade_flow=2"},
    {title: "Germany vs Australia", subtitle: "Destinations of Car Exports from Aichi", url: "?destinations=eudeu,ocaus&drilldown=destinations&products=178802&subnats=23&trade_flow=2"},
    {title: "USA vs China", subtitle: "Export Destinations", url: "?destinations=aschn,nausa&drilldown=destinations&trade_flow=2"},
    {title: "Kanagawa vs Tokyo", subtitle: "Photo Lab Equipment Exports", url: "?drilldown=subnats&products=189010&subnats=14,13&trade_flow=2"},
    {title: "Italy vs Chile", subtitle: "Wine Imports to Tokyo", url: "?destinations=euita,sachl&drilldown=destinations&products=42204&subnats=13&trade_flow=1"}
  ]},
  {title: "🇷🇺 Russia Subnational", slug: "subnat-rus", items: [
    {title: "Moscow (Capital Region) vs St. Petersburg", subtitle: "Total Exports", url: "?drilldown=subnats&subnats=40000,45000&trade_flow=2"},
    {title: "Japan vs S. Korea", subtitle: "Destinations of Petrolem Gas from Sakhalin Region", url: "destinations=asjpn,askor&drilldown=destinations&products=52711&subnats=64000&trade_flow=2"},
    {title: "China vs Netherlands", subtitle: "Export Destinations", url: "?destinations=aschn,eunld&drilldown=destinations&trade_flow=2"},
    {title: "Samara vs Kaluga", subtitle: "Car Exports", url: "?drilldown=subnats&products=178703&subnats=36000,29000&trade_flow=2"},
    {title: "Germany vs Japan", subtitle: "Car Imports to Moscow (Capital Region)",  url: "?destinations=eudeu,asjpn&drilldown=destinations&products=178703&subnats=45000&trade_flow=1"}
  ]},
  {title: "🇪🇸 Spain Subnational", slug: "subnat-esp", items: [
    {title: "Barcelona vs Madrid", subtitle: "Total Exports", url: "?drilldown=subnats&subnats=8,28&trade_flow=2"},
    {title: "USA vs UK", subtitle: "Destinations of Wine from La Rioja", url: "?destinations=nausa,eugbr&drilldown=destinations&products=42204&subnats=26&trade_flow=2"},
    {title: "France vs Germany", subtitle: "Export Destinations", url: "?destinations=eufra,eudeu&drilldown=destinations&trade_flow=2"},
    {title: "Barcelona vs Burgos", subtitle: "Packaged Medicament Exports", url: "?drilldown=subnats&products=63004&subnats=9,8&trade_flow=2"},
    {title: "Cuba vs Ireland", subtitle: "Hard Liquor Imports to Málaga", url: "?destinations=nacub,euirl&drilldown=destinations&products=42208&subnats=29&trade_flow=1"}
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
                      <a href={`/${locale}/prediction/${tileGroup.slug}${tile.url}`}>
                        <span className="prediction-title">{tile.title}</span>
                        {tile.subtitle
                          ? <span className="prediction-subtitle">{tile.subtitle}</span>
                          : <span className="prediction-subtitle"> </span>}
                      </a>
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
