import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import {Link} from "react-router";
import {Icon} from "@blueprintjs/core";

import {NAV} from "helpers/consts";
import NavGroup from "./NavGroup";

import "./Navbar.css";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navVisible: false
    };
  }

  render() {
    const {navVisible} = this.state;

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

        <button
          className={`navbar-nav-toggle-button display u-font-md u-hide-above-md ${navVisible ? "is-active" : "is-inactive"}`}
          onClick={() => this.setState({navVisible: !navVisible})}
        >
          <span className="u-visually-hidden">Menu</span>
          <Icon icon={navVisible ? "cross" : "menu"} className="navbar-nav-toggle-button-icon" />
        </button>

        <nav className={`navbar-nav ${navVisible ? "is-visible" : "is-hidden"}`}>
          <ul className="navbar-nav-list">
            {NAV.map(group =>
              <NavGroup title={group.title} items={group.items} key={group.title} />
            )}
          </ul>
        </nav>

        <button className="navbar-search-button">
          <span className="u-visually-hidden">Search profiles...</span>
          <Icon icon="search" iconSize={20} className="navbar-search-button-icon" />
        </button>
      </div>
    );
  }
}

export default hot(Navbar);
