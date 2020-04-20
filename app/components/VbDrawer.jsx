import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import {withNamespaces} from "react-i18next";
import {
  Drawer,
  Position
} from "@blueprintjs/core";

import {formatAbbreviate} from "d3plus-format";
import colors from "../helpers/colors";
import {getList} from "../helpers/vbTitle";
import {findColorV2, backgroundImageV2} from "../d3plus.js";

import "./VbDrawer.css";
import {timeTitleFormat, hsId} from "../helpers/formatters";

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
    this.props.countryMembers !== prevProps.countryMembers ||
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
    if (!this.props.isOpen) return null;

    const drilldowns = ["HS6", "HS4", "HS2", "Section", "Country", "Continent"];
    const {countryMembers, groupBy, relatedItems, routeParams, t} = this.props;
    const {cube, country, partner, viztype, time} = routeParams;
    const preps = {
      export: "to",
      import: "from",
      uspto: ""
    };
    const titleKey = groupBy ? groupBy[groupBy.length - 1] : drilldowns.find(d => d in relatedItems);
    const key = groupBy ? groupBy[0] : drilldowns.find(d => d in relatedItems);
    const titleName = relatedItems[titleKey];
    const titleId = relatedItems[`${titleKey} ID`];
    const isProductSelected = ["HS6", "HS4", "HS2", "Section"].some(d => relatedItems[d]) && relatedItems["Trade Value"];

    // Sets time dimension
    const timeId = ["Time ID", "Year"].find(d => Object.keys(relatedItems).includes(d)) || "Year";
    console.log(timeId, relatedItems);
    const timeName = relatedItems[timeId];

    // const isTrade = new RegExp(/(export|import)/).test(flow);
    const isCountry = new RegExp(/^(?!(all|show)).*$/).test(country) || new RegExp(/(Country)/).test(titleKey);
    const isCountryPermalink = new RegExp(/^(?!(all|show)).*$/).test(country);
    const isGeoGrouping = new RegExp(/show/).test(partner);
    const isPartner = new RegExp(/^(?!(all|show)).*$/).test(partner);
    const isProductPermalink = new RegExp(/^(?!(all|show)).*$/).test(viztype);
    // const isTradeBalance = flow === "show";
    const parentId = relatedItems["Section ID"] || relatedItems["Continent ID"];

    const isGeoSelected = relatedItems["Continent ID"];
    const profileId = isGeoSelected ? titleId.slice(2, 5) : titleId;
    const countryIdSelected = relatedItems["Country ID"] ? relatedItems["Country ID"].slice(2, 5) : undefined;

    const icon = !["Continent", "Country"].includes(titleKey)
      ? backgroundImageV2(key, relatedItems)
      : `/images/icons/country/country_${titleId.slice(2, 5)}.png`;

    const color = findColorV2(key, relatedItems) || colors.Section[parentId] || colors.Continent[parentId];
    const geoLabels = (key, items) => getList(items.reduce((all, d) => {
      if (key.split(".").includes(d.label || d.id)) all.push(d.title || d.name);
      return all;
    }, []));

    const {geoItems} = this.props.cubeSelected;
    const countryNames = isCountry ? geoLabels(country, geoItems) : "";

    const partnerNames = isPartner ? geoLabels(partner, geoItems) : "";

    const countryNameSelected = countryIdSelected ? countryMembers.reduce((all, d) => {
      if (countryIdSelected === d.label) all.push(d.title);
      return all;
    }, []).join(", ") : "";

    const countries = [];
    if (isCountryPermalink) countries.push({id: country, name: countryNames});
    if (countryIdSelected) countries.push({id: countryIdSelected, name: countryNameSelected});

    const timeTitle = timeTitleFormat(time);

    return <div>
      <Drawer
        className="vb-drawer"
        icon={<div
          className="vb-drawer-icon"
          style={{backgroundColor: isGeoSelected ? "transparent" : color}}
        >
          <img src={icon} />
        </div>}
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
            value={isProductSelected ? hsId(titleId) : titleId}
          />
          <VbDrawerStat
            title="Trade Value"
            value={`$${formatAbbreviate(relatedItems["Trade Value"])}`}
          />
          <VbDrawerStat
            title={timeId}
            value={timeName}
          />
          <h3>{t("RELATED VISUALIZATIONS")}</h3>
          {["export", "import"].reduce((all, d) => {

            // Checks isPartner in permalink
            if (isPartner) {
              const permalinkPartner = `/${cube}/${d}/${partner}/${country}/show/${time}/`;
              const permalinkWhere = `/${cube}/${d}/${partner}/show/${titleId}/${time}/`;

              all.push(<VbRelatedVizTitle
                permalink={permalinkPartner}
                router={this.props.router}
                titleConfig={{country: partnerNames, partner: countryNames, product: titleName, flow: d, time: timeTitle, prep: preps[d]}}
                titleName="vb_title_what_country_flow_partner"
                callback={d => this.props.run(d)}
                t={t}
              />);

              all.push(<VbRelatedVizTitle
                permalink={permalinkWhere}
                router={this.props.router}
                titleConfig={{country: partnerNames, product: titleName, flow: d, time: timeTitle, prep: preps[d]}}
                titleName="vb_title_where_country_flow_product"
                callback={d => this.props.run(d)}
                t={t}
              />);

              const permalinkWhat = `/${cube}/${d}/${partner}/all/show/${time}/`;

              all.push(<VbRelatedVizTitle
                permalink={permalinkWhat}
                router={this.props.router}
                titleConfig={{country: partnerNames, flow: d, time: timeTitle, prep: preps[d]}}
                titleName="vb_title_what_country_flow"
                callback={d => this.props.run(d)}
                t={t}
              />);
            }

            // Checks bilateral permalink
            if (countryIdSelected !== country && countryIdSelected && isCountryPermalink) {
              const permalinkBilateralA = `/${cube}/${d}/${countryIdSelected}/${country}/show/${time}/`;
              const permalinkBilateralB = `/${cube}/${d}/${country}/${countryIdSelected}/show/${time}/`;

              all.push(<VbRelatedVizTitle
                permalink={permalinkBilateralA}
                router={this.props.router}
                titleConfig={{country: countryNameSelected, product: titleName, partner: countryNames, flow: d, time: timeTitle, prep: preps[d]}}
                titleName="vb_title_what_country_flow_partner"
                callback={d => this.props.run(d)}
                t={t}
              />);
              all.push(<VbRelatedVizTitle
                permalink={permalinkBilateralB}
                router={this.props.router}
                titleConfig={{country: countryNames, product: titleName, partner: countryNameSelected, flow: d, time: timeTitle, prep: preps[d]}}
                titleName="vb_title_what_country_flow_partner"
                callback={d => this.props.run(d)}
                t={t}
              />);
            }
            // Filter by product selected
            if (isProductSelected) {
              const permalink = `/${cube}/${d}/show/all/${titleId}/${time}/`;

              all.push(<VbRelatedVizTitle
                permalink={permalink}
                router={this.props.router}
                titleConfig={{country: countryNames, product: titleName, flow: d, time: timeTitle, prep: preps[d]}}
                titleName="vb_title_which_countries_flow_product"
                callback={d => this.props.run(d)}
                t={t}
              />);
            }
            if (isProductPermalink) {
              const permalink = `/${cube}/${d}/show/all/${viztype}/${time}/`;

              all.push(<VbRelatedVizTitle
                permalink={permalink}
                router={this.props.router}
                titleConfig={{product: this.props.selectedProducts.map(d => d.name), flow: d, time: timeTitle, prep: preps[d]}}
                titleName="vb_title_which_countries_flow_product"
                callback={d => this.props.run(d)}
                t={t}
              />);

              if (countryIdSelected) {
                const bilateralPermalink = `/${cube}/${d}/${countryIdSelected}/all/${viztype}/${time}/`;
                all.push(<VbRelatedVizTitle
                  permalink={bilateralPermalink}
                  router={this.props.router}
                  titleConfig={{product: this.props.selectedProducts.map(d => d.name), country: countryNameSelected, flow: d, time: timeTitle, prep: preps[d]}}
                  titleName="vb_title_where_country_flow_product"
                  callback={d => this.props.run(d)}
                  t={t}
                />);
              }
            }

            countries.forEach(h => {
              const permalinkWhat = `/${cube}/${d}/${h.id}/all/show/${time}/`;
              const permalinkWhere = `/${cube}/${d}/${h.id}/show/all/${time}/`;

              all.push(<VbRelatedVizTitle
                permalink={permalinkWhat}
                router={this.props.router}
                titleConfig={{country: h.name, flow: d, time: timeTitle, prep: preps[d]}}
                titleName="vb_title_what_country_flow"
                callback={d => this.props.run(d)}
                t={t}
              />);
              all.push(<VbRelatedVizTitle
                permalink={permalinkWhere}
                router={this.props.router}
                titleConfig={{country: h.name, flow: d, time: timeTitle, prep: preps[d]}}
                titleName="vb_title_where_country_flow_product"
                callback={d => this.props.run(d)}
                t={t}
              />);
              if (isProductSelected) {
                const permalinkProduct = `/${cube}/${d}/${h.id}/show/${titleId}/${time}/`;
                all.push(<VbRelatedVizTitle
                  permalink={permalinkProduct}
                  router={this.props.router}
                  titleConfig={{country: h.name, flow: d, product: titleName, time: timeTitle, prep: preps[d]}}
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

/** */
function mapStateToProps(state) {
  const {countryMembers, cubeSelected} = state.vizbuilder;

  return {
    countryMembers,
    cubeSelected
  };
}

export default withNamespaces()(connect(mapStateToProps)(VbDrawer));
