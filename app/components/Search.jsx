import React, {Component, Fragment} from "react";
import {hot} from "react-hot-loader/root";
import axios from "axios";
import {event, select} from "d3-selection";
import {Icon} from "@blueprintjs/core";
import {encodeChars} from "@datawheel/canon-core";

import SearchColumn from "./SearchColumn";
import "./Search.css";


class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchActive: false,
      filters: [],
      results: [],
      timeout: 0,
      query: ""
    };
  }

  // get value from input
  onChange(e) {
    const {id, filters, timeout} = this.state;
    const {limit, minQueryLength} = this.props;
    const query = e ? e.target.value : this.state.query;

    if (query.length < minQueryLength) {
      this.setState({searchActive: true, results: [], query});
      clearTimeout(timeout);
    }
    else {
      // handle escape press
      select(document).on(`keydown.${id}`, () => {
        const key = event.keyCode;
        const ESC = 27;

        // ABORT
        if (key === ESC) {
          this.resetSearch();
        }
      });

      // handle the query
      this.setState({
        // set query separately to avoid input lag
        query,
        // make the request on a timeout
        timeout: setTimeout(() => {
          // base query
          let URL = `${this.props.api}/search/?q=${encodeChars(query)}&limit=${limit}`;

          // location filters (by level & location_id)
          const countryFilters = filters.filter(d => d.entity === "location" && d.level === "country");
          if (countryFilters.length) {
            URL += `&project_country_id=${countryFilters.map(l => l.id)}`;
          }
          const subnationalFilters = filters.filter(d => d.entity === "location" && d.level === "subnational");
          if (subnationalFilters.length) {
            URL += `&project_geo_id=${subnationalFilters.map(l => l.id)}`;
          }

          axios.get(URL)
            .then(res => res.data)
            .then(searchResultsData => {
              this.setState({
                searchActive: true,
                results: searchResultsData
              });
            });
        }, 300)
      });
    }
  }

  // click the close button
  resetSearch() {
    this.setState({
      query: "",
      filters: [],
      searchActive: false
    });
  }

  // remove a filter
  removeFilter(filter) {
    const {filters} = this.state;

    // filter out the unwanted filter
    const newFilters = filters.filter(item => item !== filter);
    this.setState({filters: newFilters}); // update state

    // update search results
    this.onChange();
  }

  render() {
    const {filters, query} = this.state;
    const {minQueryLength} = this.props;

    const columnProps = {minQueryLength};

    return (
      <div className="search" role="search">
        {/* accessibility text */}
        <h2 className="u-visually-hidden">search</h2>

        {/* main input */}
        <label className="search-label">
          {/* accessibility text */}
          <span className="u-visually-hidden">
            Search projects, programming languages, locations, and domains
          </span>

          {/* the input; NOTE: className must stay as .search-input for focus management */}
          <input
            className="search-input"
            placeholder="Search profiles..."
            value={query}
            onChange={this.onChange.bind(this) }
            ref={input => this.textInput = input}
          />

          {/* search icon (keep after input so it can be easily styled input hover/focus) */}
          <Icon className="search-icon" icon="search" />

          {/* close button */}
          <button
            className={`search-close-button ${query ? "is-visible" : "is-hidden"}`}
            tabIndex={query ? 0 : -1}
            onClick={this.resetSearch.bind(this)}
          >
            <Icon className="search-close-icon" src="cross" />
            <span className="u-visually-hidden">reset search</span>
          </button>
        </label>

        {/* container for filters & results */}
        <div className="search-inner">

          <div className="search-filter-container">
            <h2 className="u-visually-hidden">Project filters: </h2>
            <ul className={`search-filter-list ${filters.length ? "is-visible" : "is-hidden"}`}>
              {filters.length
                ? filters.map(filter =>
                  <li className="search-filter-item" key={`${filter.id}-filter-tag`}>
                    {/* WARNING: .search-filter-button class used for focus management */}
                    <button className={`search-filter-button ${filter.entity}-entity`} onClick={this.removeFilter.bind(this, filter)}>{filter.name}</button>
                  </li>
                )
                : ""}
            </ul>
          </div>

          <ul className="search-column-list">
            <SearchColumn {...this.state} {...columnProps} entity="location" />
            <SearchColumn {...this.state} {...columnProps} entity="product" />
            <SearchColumn {...this.state} {...columnProps} entity="technology" />
            <SearchColumn {...this.state} {...columnProps} entity="firm" />
          </ul>
        </div>
      </div>
    );
  }
}

Search.defaultProps = {
  limit: 100,
  minQueryLength: 1
};

export default hot(Search);
