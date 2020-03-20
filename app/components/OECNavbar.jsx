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

class OECNavbar extends Component {
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
    const {auth, locale, title, scrolled} = this.props;
    const {navVisible, searchVisible} = this.state;
    const {basename, pathname, search} = this.context.router.location;
    const currentURL = encodeURIComponent(`${basename}${pathname}${search}`.replace("//", "/"));

    return (
      <div className="navbar">
        {/* logo */}
        <Link className="navbar-logo-link" to="/">
          <img
            className="navbar-logo-img"
            src="/images/oec-logo.svg"
            alt="Observatory of Economic Complexity"
            draggable="false"
          />
        </Link>

        {title &&
          <div className={`navbar-top-link-wrapper ${scrolled ? "is-visible" : "is-hidden"}`}>
            <AnchorLink className="navbar-top-link heading u-font-lg" to="top" dangerouslySetInnerHTML={{__html: title}} />
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
              <NavGroup {...group} key={group.title} />
            )}
          </ul>
        </nav>

        {/* search */}
        <div className="navbar-search-toggle-button-wrapper">
          { auth.user
            ? <Button
              className={`navbar-user-login role-${auth.user.role}`}
              icon="user"
              iconPosition="left"
            >
              <Link to={`${locale}/account`}>{auth.user.role === 10 ? "Contributor" : `${auth.user.role === 1 ? "Pro " : ""}Account`}</Link>
            </Button>
            : <React.Fragment>
              <Button className="navbar-user-login" rebuilding={auth.loading} disable={auth.loading}>
                <Link to={`${locale}/login?redirect=${currentURL}`}>Login</Link>
              </Button>
              <Button className="navbar-user-signup" rebuilding={auth.loading} disable={auth.loading}>
                <Link to={`${locale}/signup`}>Sign Up</Link>
              </Button>
            </React.Fragment>
          }
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
          {searchVisible && <ProfileSearch
            {...profileSearchConfig}
            display="columns"
            showExamples={true} />}
        </div>
      </div>
    );
  }
}

OECNavbar.contextTypes = {
  router: PropTypes.object
};

export default connect(state => ({
  auth: state.auth,
  locale: state.i18n.locale
}))(hot(OECNavbar));
