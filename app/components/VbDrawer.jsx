import React from "react";
import {withNamespaces} from "react-i18next";
import {
  Drawer,
  Position
} from "@blueprintjs/core";

import {formatAbbreviate} from "d3plus-format";
import colors from "../helpers/colors";

import "./VbDrawer.css";

/** */
function VbDrawerStat(props) {
  return <div className="vb-drawer-stat">
    <span className="title">{props.title}</span>
    <span className="value">{props.value}</span>
  </div>;
}

class VbDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autoFocus: true,
      canEscapeKeyClose: true,
      canOutsideClickClose: true,
      enforceFocus: true,
      hasBackdrop: true,
      isOpen: false,
      position: Position.RIGHT,
      size: undefined,
      usePortal: true
    };
  }

  shouldComponentUpdate = (prevProps, prevState) => this.props.isOpen !== prevProps.isOpen || this.state.isOpen !== prevState.isOpen;

  componentDidUpdate = () => {
    this.setState({isOpen: this.props.isOpen});
  }

  handleOpen = () => this.setState({isOpen: true});
  handleClose = () => {
    this.setState({isOpen: false});
    this.props.callback(false);
  };

  render() {
    const drilldowns = ["HS6", "HS4", "HS2", "Section", "Country", "Continent"];
    const {relatedItems, routeParams, t} = this.props;
    const {chart, cube, flow, country, partner, viztype, time} = routeParams;

    const titleKey = drilldowns.find(d => d in relatedItems);
    const titleName = relatedItems[titleKey];
    const titleId = relatedItems[`${titleKey} ID`];

    // Sets time dimension
    const timeId = "Year";
    const timeName = relatedItems.Year;

    const isTrade = new RegExp(/(export|import)/).test(flow);
    const isCountry = new RegExp(/^(?!(all|show)).*$/).test(country);
    const isPartner = new RegExp(/^(?!(all|show)).*$/).test(partner);
    const isGeoGrouping = new RegExp(/show/).test(partner);
    const isProduct = new RegExp(/^(?!(all|show)).*$/).test(viztype);
    const isTradeBalance = flow === "show";
    const parentId = relatedItems["Section ID"] || relatedItems["Continent ID"];

    const icon = !["Continent", "Country"].includes(titleKey)
      ? `/images/icons/hs/hs_${parentId}.png`
      : `/images/icons/country/country_${titleId.slice(2, 5)}.png`;

    // Use this logic for doing related visualizations
    // "vb_title_where_country_flow_product"

    // ["export", "import"].map(d => t("vb_title_where_country_flow_product"));

    const color = colors.Section[parentId] || colors.Continent[parentId];


    return <div>
      <Drawer
        className={"vb-drawer"}
        icon={<div className="vb-drawer-icon" style={{backgroundColor: color}}>
          <img src={icon} />
        </div>}
        onClose={this.handleClose}
        title={<div>
          <div>{titleName}</div>
          <div><a style={{color}} href={`/en/profile/hs92/${titleId}`}>View profile</a></div>
        </div>}
        {...this.state}
      >
        <div className="bp3-drawer-body">
          <VbDrawerStat
            title={`${titleKey} ID`}
            value={titleId}
          />
          <VbDrawerStat
            title="Trade Value"
            value={`$${formatAbbreviate(relatedItems["Trade Value"])}`}
          />
          <VbDrawerStat
            title={timeId}
            value={timeName}
          />
          <h3>RELATED VISUALIZATIONS</h3>

          {isCountry && ["export", "import"].map(d => <p>{t("vb_title_what_country_flow", {country, flow: d, time})}</p>)}
          {isCountry && ["export", "import"].map(d => <p>{t("vb_title_where_country_flow_product", {country, flow: d})}</p>)}
          {isCountry && ["export", "import"].map(d => <p>{t("vb_title_where_country_flow_product", {country, flow: d, product: titleName})}</p>)}
        </div>
      </Drawer>
    </div>;
  }
}

export default withNamespaces()(VbDrawer);
