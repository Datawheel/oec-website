import React from "react";
import {withNamespaces} from "react-i18next";
import "./VbTab.css";

class VbTab extends React.Component {

  render() {
    const {chart, countries, products, t} = this.props;
    const vbKey = {};
    const compare = false;

    return (
      <div>
        <div className="columns panel is-margin-bottom">
          <div className="column-1-2">
            <span
              className={`text ${!vbKey.partner && !vbKey.product && compare ? "is-selected" : ""}`}
            >
              {t("Country")}
            </span>
          </div>
          <div className="column-1-2">
            <ul className="options">
              <li className="panel-option is-selected">Trade Balance</li>
              <li className="panel-option">Trade Balance</li>
            </ul>
          </div>
        </div>
        <div className="columns panel is-margin-bottom">
          <div className="column-1-2">
            <span>{t("Bilateral")}</span>
          </div>
          <div className="column-1-2">
            <ul className="options">
              <li className="panel-option">Trade Balance</li>
              <li className="panel-option">Trade Balance</li>
            </ul>
          </div>
        </div>

      </div>
    );
  }
}

export default withNamespaces()(VbTab);
