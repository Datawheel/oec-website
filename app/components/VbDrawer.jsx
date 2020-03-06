import React from "react";
import {Link} from "react-router";
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

/** */
function VbRelatedVizTitle(props) {
  const {permalink, t, titleName, titleConfig} = props;
  const link = `/en/visualize/tree_map${permalink}`;
  return <Link className="vb-related-viz" to={link} onClick={() => {
    props.router.push(link);
    props.callback(link);
  }}>
    <img className="icon" src="/images/icons/app/app_tree_map.png" alt=""/>
    {t(titleName, titleConfig)}
  </Link>;
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

  shouldComponentUpdate = (prevProps, prevState) =>
    this.props.isOpen !== prevProps.isOpen ||
    this.props.countryData !== prevProps.countryData ||
    this.state.isOpen !== prevState.isOpen;

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
    const {countryData, relatedItems, routeParams, t} = this.props;
    const {chart, cube, flow, country, partner, viztype, time} = routeParams;
    const preps = {
      export: "to",
      import: "from",
      uspto: ""
    };
    const titleKey = drilldowns.find(d => d in relatedItems);
    const titleName = relatedItems[titleKey];
    const titleId = relatedItems[`${titleKey} ID`];

    const isProductSelected = ["HS6", "HS4", "HS2", "Section"].some(d => relatedItems[d]) && relatedItems["Trade Value"];

    // Sets time dimension
    const timeId = "Year";
    const timeName = relatedItems.Year;

    const isTrade = new RegExp(/(export|import)/).test(flow);
    const isCountryPermalink = new RegExp(/^(?!(all|show)).*$/).test(country);
    const isCountry = new RegExp(/^(?!(all|show)).*$/).test(country) || new RegExp(/(Country)/).test(titleKey);
    const isPartner = new RegExp(/^(?!(all|show)).*$/).test(partner);
    const isGeoGrouping = new RegExp(/show/).test(partner);
    const isProductPermalink = new RegExp(/^(?!(all|show)).*$/).test(viztype);
    const isTradeBalance = flow === "show";
    const parentId = relatedItems["Section ID"] || relatedItems["Continent ID"];
    console.log(isProductPermalink);

    const isGeoSelected = relatedItems["Continent ID"];
    const profileId = isGeoSelected ? titleId.slice(2, 5) : titleId;
    const countryIdSelected = relatedItems["Country ID"] ? relatedItems["Country ID"].slice(2, 5) : undefined;

    const icon = !["Continent", "Country"].includes(titleKey)
      ? `/images/icons/hs/hs_${parentId}.png`
      : `/images/icons/country/country_${titleId.slice(2, 5)}.png`;

    const color = colors.Section[parentId] || colors.Continent[parentId];

    const countryNames = isCountry ? countryData.reduce((all, d) => {
      if (country.split(".").includes(d.label)) all.push(d.title);
      return all;
    }, []).join(", ") : "";

    const countryNameSelected = countryIdSelected ? countryData.reduce((all, d) => {
      if (countryIdSelected === d.label) all.push(d.title);
      return all;
    }, []).join(", ") : "";

    const countries = [];
    if (isCountryPermalink) countries.push({id: country, name: countryNames});
    if (countryIdSelected) countries.push({id: countryIdSelected, name: countryNameSelected});

    return <div>
      <Drawer
        className="vb-drawer"
        icon={<div className="vb-drawer-icon"
          style={{backgroundColor: isGeoSelected ? "transparent" : color}}
        ><img src={icon} /></div>}
        onClose={this.handleClose}
        title={<div>
          <div>{titleName}</div>
          <div><a style={{color}} href={`/en/profile/${isGeoGrouping ? "country" : "hs92"}/${profileId}`}>View profile</a></div>
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
          {["export", "import"].reduce((all, d) => {
            // Checks bilateral permalink
            if (countryIdSelected !== country && countryIdSelected && isCountryPermalink) {
              const permalinkBilateralA = `/hs92/${d}/${countryIdSelected}/${country}/show/${time}/`;
              const permalinkBilateralB = `/hs92/${d}/${country}/${countryIdSelected}/show/${time}/`;

              all.push(<VbRelatedVizTitle
                permalink={permalinkBilateralA}
                router={this.props.router}
                titleConfig={{country: countryNameSelected, product: titleName, partner: countryNames, flow: d, time, prep: preps[d]}}
                titleName="vb_title_what_country_flow_partner"
                callback={d => this.props.run(d)}
                t={t}
              />);
              all.push(<VbRelatedVizTitle
                permalink={permalinkBilateralB}
                router={this.props.router}
                titleConfig={{country: countryNames, product: titleName, partner: countryNameSelected, flow: d, time, prep: preps[d]}}
                titleName="vb_title_what_country_flow_partner"
                callback={d => this.props.run(d)}
                t={t}
              />);
            }
            // Filter by product selected
            if (isProductSelected) {
              const permalink = `/hs92/${d}/show/all/${titleId}/${time}/`;

              all.push(<VbRelatedVizTitle
                permalink={permalink}
                router={this.props.router}
                titleConfig={{country: countryNames, product: titleName, flow: d, time, prep: preps[d]}}
                titleName="vb_title_which_countries_flow_product"
                callback={d => this.props.run(d)}
                t={t}
              />);
            }
            if (isProductPermalink) {
              const permalink = `/hs92/${d}/show/all/${viztype}/${time}/`;

              all.push(<VbRelatedVizTitle
                permalink={permalink}
                router={this.props.router}
                titleConfig={{product: this.props.selectedProducts.map(d => d.name), flow: d, time, prep: preps[d]}}
                titleName="vb_title_which_countries_flow_product"
                callback={d => this.props.run(d)}
                t={t}
              />);

              if (countryIdSelected) {
                const bilateralPermalink = `/hs92/${d}/${countryIdSelected}/all/${viztype}/${time}/`;
                all.push(<VbRelatedVizTitle
                  permalink={bilateralPermalink}
                  router={this.props.router}
                  titleConfig={{product: this.props.selectedProducts.map(d => d.name), country: countryNameSelected, flow: d, time, prep: preps[d]}}
                  titleName="vb_title_where_country_flow_product"
                  callback={d => this.props.run(d)}
                  t={t}
                />);
              }
            }

            countries.forEach(h => {
              const permalinkWhat = `/hs92/${d}/${h.id}/all/show/${time}/`;
              const permalinkWhere = `/hs92/${d}/${h.id}/show/all/${time}/`;

              all.push(<VbRelatedVizTitle
                permalink={permalinkWhat}
                router={this.props.router}
                titleConfig={{country: h.name, flow: d, time, prep: preps[d]}}
                titleName="vb_title_what_country_flow"
                callback={d => this.props.run(d)}
                t={t}
              />);
              all.push(<VbRelatedVizTitle
                permalink={permalinkWhere}
                router={this.props.router}
                titleConfig={{country: h.name, flow: d, time, prep: preps[d]}}
                titleName="vb_title_where_country_flow_product"
                callback={d => this.props.run(d)}
                t={t}
              />);
              if (isProductSelected) {
                const permalinkProduct = `/hs92/${d}/${h.id}/show/${titleId}/${time}/`;
                all.push(<VbRelatedVizTitle
                  permalink={permalinkProduct}
                  router={this.props.router}
                  titleConfig={{country: h.name, flow: d, product: titleName, prep: preps[d]}}
                  titleName="vb_title_where_country_flow_product"
                  callback={d => this.props.run(d)}
                  t={t}
                />);
              }
            });
            return all;
          }, [])}
        </div>
      </Drawer>
    </div>;
  }
}

export default withNamespaces()(VbDrawer);
