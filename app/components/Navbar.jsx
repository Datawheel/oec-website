import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import {Link} from "react-router";

import NavGroup from "./NavGroup";

import "./Navbar.css";

class Navbar extends Component {
  render() {
    const locale = "en";

    const navItems = [
      // profiles
      {title: "Profiles", items: [
        {title: "Location", items: [
          {title: "Country", url: `/${locale}/profile/country/pry`},
          {title: "Subnational", url: `/${locale}/profile/subnational/`, pro: true},
          {title: "Country to country", url: `/${locale}/profile/country/pry/partner/ury`},
          {title: "Product in country", url: `/${locale}/profile/country/pry/hs92/2120100`}
        ]},
        {title: "Product", items: [
          {title: "Product", url: `/${locale}/profile/hs92/2090121`},
          {title: "Product in country", url: `/${locale}/profile/country/pry/hs92/2120100`}
        ]},
        {title: "Research", items: [
          {title: "Technology", url: `/${locale}/profile/technology`},
          {title: "Firm", url: `/${locale}/profile/firm`}
        ]}
      ]},
      // visualizations
      {title: "Visualizations", items: [
        {title: "Tree map", url: `/${locale}/visualizations/tree-map`, icon: "tree-map"},
        {title: "Stacked area", url: `/${locale}/visualizations/stacked`, icon: "stacked"},
        {title: "Line chart", url: `/${locale}/visualizations/line`, icon: "line"},
        {title: "Network", url: `/${locale}/visualizations/network`, icon: "network"},
        {title: "Ring", url: `/${locale}/visualizations/ring`, icon: "ring"},
        {title: "Scatter plot", url: `/${locale}/visualizations/scatter`, icon: "scatter"},
        {title: "Geo map", url: `/${locale}/visualizations/geo-map`, icon: "geo-map"}
      ]},
      // about
      {title: "About", items: [
        {title: "About OEC", url: `/${locale}/about/`},
        {title: "OEC Pro", url: `/${locale}/about#oec-pro`},
        {title: "FAQ", url: `/${locale}/about#faq`},
        {title: "Publications", url: `/${locale}/about#publications`}
      ]},
      // data
      {title: "Data", items: [
        {title: "The data", url: `/${locale}/data/`},
        {title: "Methodology", url: `/${locale}/data#methodology`},
        {title: "Permissions", url: `/${locale}/data#permissions`},
        {title: "API", url: `/${locale}/data#api`}
      ]},
      // rankings
      {title: "Rankings", items: [
        {title: "Country rankings", url: `/${locale}/rankings/country/eci`},
        {title: "Product rankings", url: `/${locale}/rankings/product/sitc`}
      ]}
    ];

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
        {navItems.map(group =>
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
