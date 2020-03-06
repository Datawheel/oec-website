import React from "react";
import {withNamespaces} from "react-i18next";
import axios from "axios";
import VbChart from "../../components/VbChart";
import {createItems} from "./";
class EmbedVizbuilder extends React.Component {
  state = {
    country: [],
    permalink: []
  }

  componentDidMount = () => {
    window.addEventListener("scroll", this.handleScroll);

    // Gets members of HS products, Countries and Technologies
    axios.all([
      axios.get("https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_baci_a_92&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false"),
      axios.get("/members/country.json"),
      axios.get("https://api.oec.world/tesseract/data.jsonrecords?cube=indicators_i_wdi_a&drilldowns=Indicator&measures=Measure&parents=false&sparse=false")
      // axios.get("/members/technology.json")
    ]).then(axios.spread((resp1, resp2, resp3) => {
      const productData = resp1.data.data;
      const productKeys = createItems(productData, ["Section", "HS2", "HS4"], "/images/icons/hs/hs_");

      const countryData = resp2.data;
      // const technologyData = resp4.data.map(d => ({
      //   ...d, color: colors["CPC Section"][d.parent_id]}));
      const technologyData = [];

      // Sorts alphabetically country names
      countryData.sort((a, b) => a.title > b.title ? 1 : -1);

      const wdi = resp3.data.data
        .map(d => ({value: d["Indicator ID"], title: d.Indicator}))
        .sort((a, b) => a.title > b.title ? 1 : -1);
      const data = [{value: "OEC.ECI", title: "Economic Complexity Index (ECI)", scale: "Linear"}]
        .concat(wdi);

      this.setState({
        country: countryData,
        product: productData,
        productKeys,
        technology: technologyData,
        wdiIndicators: data
      });
    }));

  }

  render() {
    const {routeParams} = this.props;
    const {country, permalink} = this.state;
    return <div className="vb-embed">
      <VbChart
        countryData={country}
        permalink={permalink}
        routeParams={routeParams}
        router={this.props.router}
        selectedProducts={this.state._selectedItemsProductTitle}
        xAxis={this.state._xAxisTitle}
        yAxis={this.state._yAxisTitle}
        xScale={this.state._xAxisScale}
        yScale={this.state._yAxisScale}
        callback={d => {
          const permalink = {permalink: d};
          this.setState(
            permalink,
            () => this.updateFilterSelected(permalink)
          );
        }}
      />
    </div>;
  }
}

export default withNamespaces()(EmbedVizbuilder);
