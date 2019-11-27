import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import Tile from "./Tile";
import "./SearchColumn.css";

class SearchColumn extends Component {

  formatPlural(str) {
    if (str.slice(str.length - 1) === "y") {
      return `${str.slice(0, -1)}ies`;
    }
    else return `${str}s`;
  }

  render() {
    const {entity, limit, locale, minQueryLength, results, visible, query} = this.props;

    let fullResults, limitedResults;
    let count, fullCount = 0;

    if (results && entity) {
      fullResults = results.filter(r => r.dimension === entity);
      fullCount = fullResults.length;

      limitedResults = fullResults.slice(0, limit);
      count = limitedResults.length;
    }

    return (
      <li className={`search-column ${entity.toLowerCase()}-entity ${!query || count >= 1 ? "is-active" : "is-empty"} ${visible ? "is-visible" : "is-hidden"}`}>
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
        {count && query.length
          ? <ul className="search-column-result-list">
            {limitedResults.map(result =>
              <Tile
                title={result.name}
                link={`${locale}/profile/${result.profile}/${result.slug}`}
                image={result.image ? `api/image?slug=${result.profile}&id=${result.id}&size=thumb` : null}
                key={result.id}
              />
            )}
          </ul> : ""
        }
      </li>
    );
  }
}

SearchColumn.defaultProps = {
  locale: "en",
  limit: 50 // limit for each column
};

export default hot(SearchColumn);
