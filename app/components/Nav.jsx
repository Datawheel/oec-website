import React from "react";

import "./Nav.css";

class Nav extends React.Component {
  render() {
    return <nav className="navbar">
      <div>x</div>
      <ul className="menu-options">
        <li className="option">Countries</li>
        <li className="option">Products</li>
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

