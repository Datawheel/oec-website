import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import {Link} from "react-router";
// import {Icon} from "@blueprintjs/core";

import "./SearchColumn.css";

class SearchColumn extends Component {

  render() {
    const {minQueryLength, results, entity, query} = this.props;
    const resultsList = results[[`${entity}s`]];
    const count = resultsList ? resultsList.length : 0;

    return (
      <li className={`search-column-item ${entity}-entity ${count >= 1 ? "is-active" : "is-empty"}`}>
        {/* label & count */}
        <h3 className={`search-column-title ${query.length >= minQueryLength && count === 0 ? "is-empty" : ""}`}>
          <span className="search-column-title-count">
            {query.length >= minQueryLength ? count : ""}
          </span>
          <span className="search-column-title-label display">
            { " " }{ entity }{ count !== 1 && query.length >= minQueryLength ? "s" : "" }
          </span>
        </h3>

        {/* search results */}
        {count
          ? <ul className="search-column-result-list">
            {query && resultsList.map(result =>
              <li className="search-column-result-item" key={`${result}-result`}>
                <Link to={`/${entity}/${result}`} className="search-column-result-link">
                  {result}
                </Link>
              </li>
            )}
          </ul> : ""
        }
      </li>
    );
  }
}

export default hot(SearchColumn);
