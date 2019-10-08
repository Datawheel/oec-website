import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import {Link} from "react-router";
import {NAV} from "helpers/consts";

import NavGroup from "./NavGroup";

import "./Navbar.css";

class Navbar extends Component {
  render() {
    return <nav className="navbar">
      <div className="navbar-logo">
        <Link className="navbar-logo-link" to="/">
          <img
            className="navbar-logo-img"
            src="/images/oec-logo.png"
            srcSet="/images/oec-logo.svg"
            alt="Observatory of Economic Complexity"
            draggable="false"
          />
        </Link>
      </div>

      <ul className="menu-options">
        {NAV.map(group =>
          <NavGroup title={group.title} items={group.items} key={group.title} />
        )}
      </ul>

      <button className="search-button">
        <div className="u-visually-hidden">Search profiles...</div>
        <img src="/images/icons/nav/search.png" />
      </button>
    </nav>;
  }
}

export default hot(Navbar);
