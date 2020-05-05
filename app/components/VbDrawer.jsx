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
import moment from "moment";

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
    const {countryMembers, cubeSelected, groupBy, relatedItems, routeParams, t} = this.props;
    const {cube, country, partner, viztype, time} = routeParams;
    const {geoLevels} = cubeSelected;
    const preps = {
      export: "to",
      import: "from",
      uspto: ""
    };
    const titleKey = groupBy ? groupBy[groupBy.length - 1] : drilldowns.find(d => d in relatedItems);
    const key = groupBy ? groupBy[0] : drilldowns.find(d => d in relatedItems);
    const titleId = relatedItems[`${titleKey} ID`];
    const titleName = relatedItems[titleKey];


    const isProductSelected = (
      cubeSelected.productLevels || ["HS6", "HS4", "HS2", "Section"]
    ).some(d => relatedItems[d]) && relatedItems["Trade Value"];

    // Sets time dimension
    const timeId = ["Time ID", "Year"].find(d => Object.keys(relatedItems).includes(d)) || "Year";
    const timeName = relatedItems[timeId];

    const isCountry = new RegExp(/^(?!(all|show)).*$/).test(country) || new RegExp(/(Country)/).test(titleKey);
    const isCountryPermalink = new RegExp(/^(?!(all|show)).*$/).test(country);
    const isGeoGrouping = new RegExp(/show/).test(partner);
    const isPartner = new RegExp(/^(?!(all|show)).*$/).test(partner);
    const isProductPermalink = new RegExp(/^(?!(all|show)).*$/).test(viztype);
    const parentId = groupBy
      ? relatedItems[`${groupBy[0]} ID`]
      : relatedItems["Section ID"] || relatedItems["Continent ID"];
    const parentKey = groupBy[0];

    const isSubnatProfile = groupBy.includes("Subnat Geography");
    const isSubnatCube = cube.includes("subnational");
    const showProfile = !["EGW1"].includes(groupBy[0]);

    const relatedItemsKeys = Object.keys(relatedItems);

    const isGeoSelected = relatedItems["Continent ID"];
    const profileId = isGeoSelected ? titleId.slice(2, 5) : titleId;
    const isCountrySelected = relatedItemsKeys.includes("Country ID");
    let countryIdSelected = isCountrySelected ? relatedItems["Country ID"].slice(2, 5) : undefined;
    const isSubnatIdSelected = [].concat(geoLevels).reverse().find(d => relatedItemsKeys.includes(d));
    const subnatIdSelected = isSubnatIdSelected ? relatedItems[`${isSubnatIdSelected} ID`].toString() : undefined;

    if (!countryIdSelected && isSubnatIdSelected) countryIdSelected = subnatIdSelected;

    const icon = !["Continent", "Country"].includes(titleKey)
      ? backgroundImageV2(key, relatedItems)
      : `/images/icons/country/country_${titleId.slice(2, 5)}.png`;

    const color = findColorV2(key, relatedItems) || colors.Section[parentId] || colors.Continent[parentId];
    const geoLabels = (key, items) => getList(items.reduce((all, d) => {
      if (key.split(".").includes(d.label || d.id)) all.push(d.title || d.name);
      return all;
    }, []));

    const {geoItems} = this.props.cubeSelected;
    const customGeoItems = isSubnatCube ? [...geoItems, ...countryMembers] : geoItems;

    const geoNames = isCountry ? geoLabels(country, customGeoItems) : "";
    const partnerNames = isPartner ? geoLabels(partner, customGeoItems) : "";
    const geoNameSelected = countryIdSelected ?  geoLabels(countryIdSelected, customGeoItems) : "";

    const countries = [];
    if (isCountryPermalink) countries.push({id: country, name: geoNames});
    if (countryIdSelected) {
      countries.push({
        id: countryIdSelected,
        name: geoNameSelected,
        type: isCountrySelected ? "Country" : "Subnational"
      });
    }

    const timeTitle = timeTitleFormat(time);
    const profileType =  isSubnatProfile
      ? cube : isGeoGrouping ? "country" : parentKey === "Section" ? "hs92" : cube;

    const drawerIcon = <div
      className="vb-drawer-icon"
      style={{backgroundColor: isGeoSelected ? "transparent" : color}}
    >
      <img src={icon} />
    </div>;

    const drawerTitle = <div>
      <div>{titleName}</div>
      {showProfile && <div><a style={{color}} href={`/en/profile/${profileType}/${profileId}`}>{t("View profile")}</a></div>}
    </div>;

    return <div>
      <Drawer
        className="vb-drawer"
        icon={drawerIcon}
        onClose={this.handleClose}
        title={drawerTitle}
        {...this.state}
      >
        <div className="bp3-drawer-body">
          <VbDrawerStat
            title={`${titleKey} ID`}
            value={isProductSelected ? hsId(titleId) : titleId}
          />
          <VbDrawerStat
            title={t("Trade Value")}
            value={`${cubeSelected.currency || "$"}${formatAbbreviate(relatedItems["Trade Value"])}`}
          />
          <VbDrawerStat
            title={timeId}
            value={timeId === "Time ID" ? moment(timeName).format("L") : timeName}
          />

          <h3>{t("Related Visualizations")}</h3>

          {["export", "import"].reduce((all, d) => {
            // Checks isPartner in permalink
            if (isPartner) {
              const permalinkPartner = `/${cube}/${d}/${partner}/${country}/show/${time}/`;
              const permalinkWhere = `/${cube}/${d}/${partner}/show/${titleId}/${time}/`;

              if (!isSubnatCube) {
                all.push(<VbRelatedVizTitle
                  permalink={permalinkPartner}
                  router={this.props.router}
                  titleConfig={{country: partnerNames, partner: geoNames, product: titleName, flow: d, time: timeTitle, prep: preps[d]}}
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
            }

            // Checks bilateral permalink
            if (
              countryIdSelected !== country &&
              countryIdSelected &&
              isCountryPermalink
            ) {
              const permalinkBilateralA = `/${cube}/${d}/${countryIdSelected}/${country}/show/${time}/`;
              const permalinkBilateralB = `/${cube}/${d}/${country}/${countryIdSelected}/show/${time}/`;
              if (isCountrySelected && !isSubnatCube) {
                all.push(<VbRelatedVizTitle
                  permalink={permalinkBilateralA}
                  router={this.props.router}
                  titleConfig={{country: geoNameSelected, product: titleName, partner: geoNames, flow: d, time: timeTitle, prep: preps[d]}}
                  titleName="vb_title_what_country_flow_partner"
                  callback={d => this.props.run(d)}
                  t={t}
                />);
              }

              all.push(<VbRelatedVizTitle
                permalink={permalinkBilateralB}
                router={this.props.router}
                titleConfig={{country: geoNames, product: titleName, partner: geoNameSelected, flow: d, time: timeTitle, prep: preps[d]}}
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
                titleConfig={{country: geoNames, product: titleName, flow: d, time: timeTitle, prep: preps[d]}}
                titleName={isSubnatCube ? "vb_title_which_subnat_flow_product" : "vb_title_which_countries_flow_product"}
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
                titleName={isSubnatCube ? "vb_title_which_subnat_flow_product" : "vb_title_which_countries_flow_product"}
                callback={d => this.props.run(d)}
                t={t}
              />);

              if (isCountrySelected && !isSubnatCube) {
                const bilateralPermalink = `/${cube}/${d}/${countryIdSelected}/all/${viztype}/${time}/`;
                all.push(<VbRelatedVizTitle
                  permalink={bilateralPermalink}
                  router={this.props.router}
                  titleConfig={{product: this.props.selectedProducts.map(d => d.name), country: geoNameSelected, flow: d, time: timeTitle, prep: preps[d]}}
                  titleName="vb_title_where_country_flow_product"
                  callback={d => this.props.run(d)}
                  t={t}
                />);
              }
            }

            countries.forEach(h => {
              const permalinkWhat = `/${cube}/${d}/${h.id}/all/show/${time}/`;
              const permalinkWhere = `/${cube}/${d}/${h.id}/show/all/${time}/`;

              let show = true;
              if (h.type && h.type === "Country" && isSubnatCube) show = false;

              if (show) {
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
