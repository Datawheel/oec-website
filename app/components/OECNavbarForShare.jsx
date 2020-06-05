import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {hot} from "react-hot-loader/root";
import {Link} from "react-router";
import {Icon} from "@blueprintjs/core";
import {select} from "d3-selection";

import {AnchorLink} from "@datawheel/canon-core";
import {ProfileSearch} from "@datawheel/canon-cms";
import Button from "@datawheel/canon-cms/src/components/fields/Button.jsx";

import {NAV} from "helpers/consts";
import {profileSearchConfig} from "helpers/search";
import NavGroup from "./NavGroup";

import "./OECNavbar.css";

class OECNavbarForShare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navVisible: false,
      searchVisible: false
    };
    this.keyDownBind = this.keyDown.bind(this);
  }

  componentDidMount() {
    select(document).on("keydown.oecnavbar", this.keyDownBind, false);
  }

  componentWillUnmount() {
    select(document).on("keydown.oecnavbar", null);
  }

  keyDown() {

    const activeKeyCode = "S".charCodeAt(0);
    const ESC = 27;
    const key = event.keyCode;
    const tagName = event.target.tagName.toLowerCase();
    const {searchVisible} = this.state;

    if (!searchVisible && key === activeKeyCode && !["input", "textarea"].includes(tagName)) {
      event.preventDefault();
      this.toggleSearch.bind(this)();
    }
    else if (searchVisible && key === ESC) {
      event.preventDefault();
      this.toggleSearch.bind(this)();
    }

  }

  // open/close search
  toggleSearch() {
    const {searchVisible} = this.state;
    this.setState({searchVisible: !searchVisible});

    // focus the search input
    if (!searchVisible) {
      setTimeout(() => {
        document.querySelector(".navbar-search .cp-input").focus();
      }, 300);
    }
  }

  render() {
    const {locale, title, scrolled, shortTitle} = this.props;
    const {navVisible, searchVisible} = this.state;
    const {basename, pathname, search} = this.context.router.location;
    const currentURL = encodeURIComponent(`${basename}${pathname}${search}`.replace("//", "/"));

    return (
      <React.Fragment>
        <div key="navbar" className="navbar">
          {/* logo */}
          <Link className="navbar-logo-link navbar-logo-link-share" to="/">
            <img
              className="navbar-logo-img"
              src="/images/oec-logo.svg"
              alt="Observatory of Economic Complexity"
              draggable="false"
            />
          </Link>

          <div
            className={`navbar-search ${searchVisible ? "is-visible" : "is-hidden"}`}
            aria-hidden={!searchVisible}
            tabIndex={searchVisible ? null : -1}
          >
            {searchVisible && <ProfileSearch
              {...profileSearchConfig}
              display="columns"
              showExamples={true} />}
          </div>
        </div>
        {title &&
          <div key="navbar-title" className={`navbar-top-link-wrapper ${scrolled ? "is-visible" : "is-hidden"} ${shortTitle ? "short" : "long"}`}>
            <AnchorLink className="navbar-top-link heading u-font-lg" to="top" dangerouslySetInnerHTML={{__html: title}} />
          </div>
        }
      </React.Fragment>
    );
  }
}

OECNavbarForShare.contextTypes = {
  router: PropTypes.object
};

export default connect(state => ({
  locale: state.i18n.locale
}))(hot(OECNavbarForShare));
