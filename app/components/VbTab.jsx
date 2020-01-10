import React from "react";
import classnames from "classnames";
import {withNamespaces} from "react-i18next";
import "./VbTab.css";

class VbTab extends React.Component {

  render() {
    const {activeOption, chart, countries, items, products, t} = this.props;
    const vbKey = {};
    const compare = false;

    return (
      <div>
        {items.map((d, i, {length}) => <div
          key={`${chart}_${i}_panel`}
          className={classnames("columns", "panel", {"is-margin-bottom": i !== length - 1})}
        >
          <div className="column-1-2">
            <span
              className={classnames("text", {"is-selected": activeOption.includes(`${chart}_${d.name}`)})}
            >
              {d.name}
            </span>
          </div>
          <div className="column-1-2">
            <ul className="options">
              {d.nest.map((h, k) => <li
                key={`${chart}_${i}_${k}_panel`}
                className={classnames(
                  "panel-option",
                  {"is-selected": activeOption === `${chart}_${d.name}_${h.name}`}
                )}
                onClick={() => this.props.callback({
                  activeOption: `${chart}_${d.name}_${h.name}`,
                  permalink: `/en/visualize/${chart}/${h.permalink || "hs92/export/chl/all/show/2017/"}`
                })}
              >
                {h.name}
              </li>)}
            </ul>
          </div>
        </div>)}


      </div>
    );
  }
}

VbTab.defaultProps = {
  items: []
};

export default withNamespaces()(VbTab);
