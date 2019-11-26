import React, {Component} from "react";
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
      activeFilter: null,
      entities: ["commodity", "exporter", "department"],
      results: null,
      timeout: 0,
      query: ""
    };
  }

  // get value from input
  onChange(e) {
    const {id, activeFilter, timeout} = this.state;
    const {limit, minQueryLength} = this.props;
    const query = e ? e.target.value : this.state.query;

    if (query.length < minQueryLength) {
      this.setState({searchActive: false, results: null, query});
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
          const URL = `/api/search?q=${ query }${ activeFilter ? `&dimension=${activeFilter}` : "" }&limit=${limit}`;

          axios.get(URL)
            .then(res => res.data)
            .then(searchResultsData => {
              this.setState({
                searchActive: true,
                results: searchResultsData.results
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
      activeFilter: null,
      searchActive: false,
      results: []
    });
    setTimeout(() => this.textInput.focus(), 0);
  }

  setFilter(filter) {
    this.setState({activeFilter: filter});
  }

  resetFilter() {
    this.setState({activeFilter: null});
  }

  render() {
    const {activeFilter, entities, query} = this.state;
    const {minQueryLength} = this.props;

    return (
      <div className="search" role="search">
        {/* accessibility text */}
        <h2 className="u-visually-hidden">Search</h2>

        {/* filters */}
        <div className={`search-filter-container ${query ? "is-visible" : "is-hidden"}`}>
          <h3 className="search-filter-heading u-font-xs">Filter by: </h3>
          <div className="search-filter-button-list">
            <button
              className="search-filter-button u-font-xs"
              onClick={() => this.resetFilter()}
              tabIndex={query ? null : -1}
              aria-pressed={!activeFilter}
            >
              none
            </button>
            {entities.map(filter =>
              <button
                className="search-filter-button u-font-xs"
                onClick={() => this.setFilter(filter)}
                tabIndex={query ? null : -1}
                aria-pressed={activeFilter === filter}
                key={`${filter}-filter-button`}
              >
                {filter}
              </button>
            )}
          </div>
        </div>

        {/* main input */}
        <label className="search-label">
          {/* accessibility text */}
          <span className="u-visually-hidden" key="slt">
            Search locations, products, technologies, and firms
          </span>

          {/* the input */}
          <input
            className="search-input u-font-xxl"
            placeholder="Search profiles..."
            value={query}
            onChange={this.onChange.bind(this) }
            ref={input => this.textInput = input}
            key="sli"
          />

          {/* search icon (keep after input so it can be easily styled input hover/focus) */}
          <Icon className="search-icon u-font-xxl" icon="search" key="slii" />

          {/* close button */}
          <button
            className={`search-reset-button ${query ? "is-visible" : "is-hidden"}`}
            tabIndex={query ? 0 : -1}
            onClick={this.resetSearch.bind(this)}
            key="slb"
          >
            <Icon className="search-reset-button-icon" icon="cross" />
            <span className="search-reset-button-text">reset</span>
          </button>
        </label>

        {/* container for results */}
        <ul className="search-column-list">
          {entities.map(entity =>
            <SearchColumn {...this.state} minQueryLength={minQueryLength} entity={entity} key={entity} />
          )}
        </ul>
      </div>
    );
  }
}

Search.defaultProps = {
  // not setting a limit means it defaults to 10, in which the first 10 of only one entity will be returned;
  // return them all and limit each SearchColumn instead
  limit: 99999,
  minQueryLength: 1
};

export default hot(Search);
