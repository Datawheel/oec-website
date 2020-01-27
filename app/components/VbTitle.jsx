import React from "react";
import classnames from "classnames";
import {withNamespaces} from "react-i18next";

import countryData from "../../static/members/country.json";

import "./VbTitle.css";

class VbTitle extends React.Component {

  render() {
    const {routeParams, t} = this.props;
    const {chart, cube, flow, country, partner, viztype, time} = routeParams;

    const countryId = countryData.filter(d => country.split(".").includes(d.value.slice(2, 5)));
    const partnerId = !["show", "all"].includes(partner)
      ? countryData.filter(d => partner.split(".").includes(d.value.slice(2, 5)))
      : [];

    const _countryNames = countryId.map(d => d.title).join(", ");
    const _partnerNames = partnerId.map(d => d.title).join(", ");

    const isTrade = new RegExp(/(export|import)/).test(flow);
    const isCountry = new RegExp(/^(?!(all|show)).*$/).test(country);
    const isPartner = new RegExp(/^(?!(all|show)).*$/).test(partner);
    const isGeoGrouping = new RegExp(/show/).test(partner);
    const isProduct = new RegExp(/^(?!(all|show)).*$/).test(viztype);

    const preps = {
      export: "to",
      import: "from",
      uspto: ""
    };

    let title = t("vb_title_what_country_flow", {country: _countryNames, flow, time});
    if (!isCountry && isProduct) {
      title = t(
        "vb_title_which_countries_flow_product",
        {flow, product: viztype, time}
      );
    }
    else if (isGeoGrouping) {
      title = t(
        "vb_title_where_country_flow",
        {country: _countryNames, flow, time, prep: preps[flow]}
      );
    }
    else if (isCountry && isPartner) {
      title = t(
        "vb_title_what_country_flow_partner",
        {country: _countryNames, partner: _partnerNames, flow, time}
      );
    }
    else if (isCountry && isProduct) {
      title = t(
        "vb_title_where_country_flow_product",
        {country: _countryNames, flow, time, prep: preps[flow]}
      );
    }

    return (
      <div className="vb-title">
        <h1 className="title">{title}</h1>
      </div>
    );
  }
}

VbTitle.defaultProps = {
  routeParams: {}
};

export default withNamespaces()(VbTitle);
