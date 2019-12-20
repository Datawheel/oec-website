import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import {Link} from "react-router";
import {Icon} from "@blueprintjs/core";

import {AnchorLink} from "@datawheel/canon-core";

import {NAV} from "helpers/consts";
import NavGroup from "./NavGroup";
import Search from "./Search";

import "./Navbar.css";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navVisible: false,
      searchVisible: false
    };
  }

  // open/close search
  toggleSearch() {
    const {searchVisible} = this.state;
    this.setState({searchVisible: !searchVisible});

    // focus the search input
    if (!searchVisible) {
      document.querySelector(".search-input").focus();
    }
  }

  render() {
    const {title, scrolled} = this.props;
    const {navVisible, searchVisible} = this.state;

    return (
      <div className="navbar">
        {/* logo */}
        <Link className="navbar-logo-link" to="/">
          <img
            className="navbar-logo-img"
            src="/images/oec-logo.png"
            srcSet="/images/oec-logo.svg"
            alt="Observatory of Economic Complexity"
            draggable="false"
          />
        </Link>

        {title &&
          <div className={`navbar-top-link-wrapper ${scrolled ? "is-visible" : "is-hidden"}`}>
            <AnchorLink className="navbar-top-link heading u-font-lg" to="top">
              {title}
            </AnchorLink>
          </div>
        }

        {/* nav */}
        <button
          className={`navbar-toggle-button navbar-nav-toggle-button display u-font-md u-hide-above-md ${navVisible ? "is-active" : "is-inactive"}`}
          onClick={() => this.setState({navVisible: !navVisible})}
        >
          <span className="u-visually-hidden">Menu</span>
          <Icon icon={navVisible ? "cross" : "menu"} className="navbar-toggle-button-icon navbar-nav-toggle-button-icon" />
        </button>

        <nav className={`navbar-nav ${navVisible ? "is-visible" : "is-hidden"}`}>
          <ul className="navbar-nav-list">
            {NAV.map(group =>
              <NavGroup title={group.title} items={group.items} key={group.title} />
            )}
          </ul>
        </nav>

        {/* search */}
        <div className="navbar-search-toggle-button-wrapper">
          <button
            className="navbar-toggle-button navbar-search-toggle-button display u-font-md"
            aria-pressed={searchVisible}
            onClick={() => this.toggleSearch()}
          >
            <span className="u-visually-hidden">Search profiles...</span>
            <Icon icon={searchVisible ? "cross" : "search"} iconSize={20} className="navbar-toggle-button-icon navbar-search-toggle-button-icon" />
          </button>
        </div>

        <div
          className={`navbar-search ${searchVisible ? "is-visible" : "is-hidden"}`}
          aria-hidden={!searchVisible}
          tabIndex={searchVisible ? null : -1}
        >
          <Search />
        </div>
      </div>
    );
  }
}

export default hot(Navbar);
