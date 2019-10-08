import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import {Link} from "react-router";
import {Icon} from "@blueprintjs/core";

import {NAV} from "helpers/consts";
import NavGroup from "./NavGroup";

import "./Navbar.css";

class Navbar extends Component {
  render() {
    return (
      <div className="navbar">
        <Link className="navbar-logo-link" to="/">
          <img
            className="navbar-logo-img"
            src="/images/oec-logo.png"
            srcSet="/images/oec-logo.svg"
            alt="Observatory of Economic Complexity"
            draggable="false"
          />
        </Link>

        <nav className="navbar-nav">
          <ul className="navbar-nav-list">
            {NAV.map(group =>
              <NavGroup title={group.title} items={group.items} key={group.title} />
            )}
          </ul>
        </nav>

        <button className="navbar-search-button">
          <span className="u-visually-hidden">Search profiles...</span>
          <Icon icon="search" className="navbar-search-button-icon" />
        </button>
      </div>
    );
  }
}

export default hot(Navbar);
