import React from "react";
import classnames from "classnames";
import {withNamespaces} from "react-i18next";

import countryData from "../../static/members/country.json";

import "./VbTitle.css";
import {getVbTitle} from "../helpers/vbTitle.js";

class VbTitle extends React.Component {

  render() {
    const {
      title,
      params,
      t
    } = this.props;



    return (
      <div className="vb-title">
        <h1 className="title">{t(title, Object.assign(params, {interpolation: {escapeValue: false}}))}</h1>
      </div>
    );
  }
}

VbTitle.defaultProps = {
  routeParams: {}
};

export default withNamespaces()(VbTitle);
