import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import {Link} from "react-router";
// import {Icon} from "@blueprintjs/core";

import "./SearchColumn.css";

class SearchColumn extends Component {

  formatPlural(str) {
    if (str.slice(str.length - 1) === "y") {
      return `${str.slice(0, -1)}ies`;
    }
    else return `${str}s`;
  }

  render() {
    const {limit, locale, minQueryLength, results, entity, query} = this.props;

    let fullResults, limitedResults;
    let count, fullCount = 0;

    if (results && entity) {
      fullResults = results.filter(r => r.dimension.toLowerCase() === entity);
      fullCount = fullResults.length;

      limitedResults = fullResults.slice(0, limit);
      count = limitedResults.length;
    }

    return (
      <li className={`search-column-item ${entity}-entity ${count >= 1 ? "is-active" : "is-empty"}`}>
        {/* label & count */}
        <h3 className={`search-column-title ${query.length >= minQueryLength && count === 0 ? "is-empty" : ""}`}>
          <span className="search-column-title-count">
            {query.length >= minQueryLength
              ? fullCount > limit ? `${limit}+` : count
              : ""
            }
          </span>
          <span className="search-column-title-label display">
            { " " }{count !== 1 && query.length >= minQueryLength
              ? this.formatPlural(entity)
              : entity
            }
          </span>
        </h3>

        {/* search results */}
        {count
          ? <ul className="search-column-result-list">
            {limitedResults.map(result =>
              <li className="search-column-result-item" key={result.name}>
                <Link to={`${locale}/profile/${result.profile}/${result.id}`} className="search-column-result-link">
                  {result.name}
                </Link>
              </li>
            )}
          </ul> : ""
        }
      </li>
    );
  }
}

SearchColumn.defaultProps = {
  limit: 50, // limit for each column
  locale: "en"
};

export default hot(SearchColumn);
