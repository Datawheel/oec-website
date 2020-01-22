import React from "react";
import classnames from "classnames";
import {withNamespaces} from "react-i18next";

import "./VbTitle.css";

class VbTitle extends React.Component {

  render() {
    const {routeParams, t} = this.props;
    const {chart, cube, flow, country, partner, viztype, time} = routeParams;

    console.log(routeParams);

    const isTrade = new RegExp(/(export|import)/).test(flow);
    const isCountry = new RegExp(/^(?!(all|show)).*$/).test(country);
    const isPartner = new RegExp(/^(?!(all|show)).*$/).test(partner);
    const isGeoGrouping = new RegExp(/show/).test(partner);
    const isProduct = new RegExp(/^(?!(all|show)).*$/).test(viztype);

    let title = t("vb_title_what_country_flow", {country, flow});
    if (!isCountry && isProduct) title = t("vb_title_which_countries_flow_product");
    else if (isGeoGrouping) title = t("vb_title_where_country_flow", {country, flow});
    else if (isCountry && isPartner) title = t("vb_title_what_country_flow_partner", {country, flow});
    else if (isCountry && isProduct) title = t("vb_title_where_country_flow_product", {country, flow});

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
