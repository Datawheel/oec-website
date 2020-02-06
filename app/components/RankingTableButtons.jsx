import React from "react";
import classnames from "classnames";
import {Button, ButtonGroup, Classes} from "@blueprintjs/core";

class RankingTableButtons extends React.Component {
  state = {};
  render() {
    const {t, anchor, type, title, array, active, onclick} = this.props;
    return (
      <div className={classnames("setup", `${type}`)}>
        <div className="title">{t(title)}</div>
        <div className="buttons">
          <ButtonGroup style={{minWidth: 200}}>
            {anchor
              ? array.map((d, k) =>
                <a
                  role="button"
                  className={classnames(`${Classes.BUTTON}`, {
                    "is-active": d.value === active
                  })}
                  key={k}
                  href={d.href}
                  tabIndex="0"
                  data-refresh="true"
                >
                  {d.display}
                </a>
              )
              : array.map((d, k) =>
                <Button
                  key={k}
                  onClick={() => onclick.function(onclick.category, onclick.measure, d)}
                  className={`${d === active ? "is-active" : ""}`}
                >
                  {d}
                </Button>
              )
            }
          </ButtonGroup>
        </div>
      </div>
    );
  }
}

export default RankingTableButtons;
