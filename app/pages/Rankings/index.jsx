import React from "react";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import "./Rankings.css";

import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";
import RankingTable from "../../components/RankingTable";

class Rankings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      category: null,
      title: null,
      text: [],
      filter: "1968_1972"
    };
  }

  componentDidMount() {
    const category = this.props.params.category;

    const dict = {
      country: {
        title: "Economic Complexity Rankings (ECI)",
        text: [
          "The Economic Complexity Index (ECI) and the Product Complexity Index (PCI) are, respectively, measures of the relative knowledge intensity of an economy or a product. ECI measures the knowledge intensity of an economy by considering the knowledge intensity of the products it exports. PCI measures the knowledge intensity of a product by considering the knowledge intensity of its exporters. This circular argument is mathematically tractable and can be used to construct relative measures of the knowledge intensity of economies and products (see <a href=/en/resources/methodology/ class=link>methodology section</a> for more details).",
          "ECI has been validated as a relevant economic measure by showing its ability to predict future economic growth (see <a href= class=link>Hidalgo and Hausmann 2009</a>), and explain international variations in income inequality (see <a href= class=link>Hartmann et al. 2017</a>).",
          "This page includes rankings using the Economic Complexity Index (ECI)."
        ]
      },
      product: {
        title: "Product Complexity Rankings (PCI)",
        text: [
          "The Economic Complexity Index (ECI) and the Product Complexity Index (PCI) are, respectively, measures of the relative knowledge intensity of an economy or a product. ECI measures the knowledge intensity of an economy by considering the knowledge intensity of the products it exports. PCI measures the knowledge intensity of a product by considering the knowledge intensity of its exporters. This circular argument is mathematically tractable and can be used to construct relative measures of the knowledge intensity of economies and products (see <a href=/en/resources/methodology/ class=link>methodology section</a> for more details).",
          "ECI has been validated as a relevant economic measure by showing its ability to predict future economic growth (see <a href= class=link>Hidalgo and Hausmann 2009</a>), and explain international variations in income inequality (see <a href= class=link>Hartmann et al. 2017</a>).",
          "This page includes rankings using the Economic Complexity Index (ECI)."
        ]
      }
    };

    this.setState({
      category,
      title: dict[category].title,
      text: dict[category].text
    });
  }

  render() {
    const {category, title, text, filter} = this.state;
    const {t} = this.props;

    return (
      <div className="rankings-page">
        <OECNavbar />

        <div className="rankings-content content">
          <h1 className="title">{t(title)}</h1>
          <div className="about">
            {text.map((d, k) =>
              <p
                className={"text"}
                key={`${k}`}
                dangerouslySetInnerHTML={{__html: t(d)}}
              />
            )}
          </div>
          <div className="download">Here it goes the download buttons</div>
          <div className="settings">
            Here it goes the settings for the "Ranking Table"
          </div>
          <div className="ranking">
            {category &&
              <RankingTable filter={filter} category={category} />
            }
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default withNamespaces()(connect()(Rankings));
