import React from "react";
import {Link} from "react-router";

import "./Nav.css";

class Nav extends React.Component {
  render() {
    return <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src="/images/logo-sm.png" alt=""/>
        </Link>
      </div>
      <ul className="menu-options">
        <li className="option">
          <Link to="/en/profile/country/pry">Countries</Link>
        </li>
        <li className="option">
          <Link to="/en/profile/hs92/2090121">Products</Link>
        </li>
        <li className="option">
          <Link to="/en/profile/country/pry/partner/ury">Bilateral Countries</Link>
        </li>
        <li className="option">
          <Link to="/en/profile/country/pry/hs92/2120100">Bilateral Products</Link>
        </li>
        <li className="option">Visualizations</li>
        <li className="option">Rankings</li>
        <li className="option">Publications</li>
        <li className="option">About</li>
        <li className="option">API</li>
      </ul>
      <div className="search-button">
        <img src="/images/icons/nav/search.png" />
      </div>
    </nav>;
  }
}

export default Nav;
