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
              {d.nest.map(h => <li
                className={classnames(
                  "panel-option",
                  {"is-selected": activeOption === `${chart}_${d.name}_${h.name}`}
                )}
                onClick={() => this.props.callback(`${chart}_${d.name}_${h.name}`)}
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
}

export default withNamespaces()(VbTab);
