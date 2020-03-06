import React from "react";
import classnames from "classnames";
import {withNamespaces} from "react-i18next";
import "./VbTab.css";

class VbTab extends React.Component {

  render() {
    const {activeOption, chart, items, lng} = this.props;

    return (
      <div>
        {items.map((d, i, {length}) => {
          const isSelectedParent = d.nest.some(h => h.regexp ? h.regexp.test(activeOption) : false);
          return <div
            key={`${chart}_${i}_panel`}
            className={classnames("columns", "panel", {"is-margin-bottom": i !== length - 1})}
          >
            <div className="column-1-2">
              <span
                className={classnames("text", {"is-selected": isSelectedParent})}
              >
                {d.name}
              </span>
            </div>
            <div className="column-1-2">
              <ul className="options">
                {d.nest.map((h, k) => {
                  const isSelected = h.regexp ? h.regexp.test(activeOption) : false;
                  const permalink = `/${lng}/visualize/${chart}/${h.permalink || "hs92/export/chl/all/show/2017/"}`;
                  return <a
                    className={classnames("panel-option", {"is-selected": isSelected})}
                    href={permalink}
                    key={`${chart}_${i}_${k}_panel`}
                    onClick={() => this.props.callback({permalink})}
                  >
                    {h.name}
                  </a>;
                })}
              </ul>
            </div>
          </div>;
        })}
      </div>
    );
  }
}

VbTab.defaultProps = {
  items: []
};

export default withNamespaces()(VbTab);
