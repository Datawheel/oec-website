import React from "react";
import {hot} from "react-hot-loader/root";
import PropTypes from "prop-types";
import {Helmet} from "react-helmet";

import {fetchData} from "@datawheel/canon-core";
import throttle from "@datawheel/canon-cms/src/utils/throttle";
import stripHTML from "@datawheel/canon-cms/src/utils/formatters/stripHTML";
import stripP from "@datawheel/canon-cms/src/utils/formatters/stripP";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import libs from "@datawheel/canon-cms/src/utils/libs";
import {Profile as CMSProfile} from "@datawheel/canon-cms";
import OECNavbar from "components/OECNavbar";

import {profileSearchConfig} from "helpers/search";
import Footer from "components/Footer";
import "./Profile.css";

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      scrolled: false
    };
  }

  getChildContext() {
    const {formatters, locale, profile, router} = this.props;
    const {variables} = profile;

    return {
      formatters: formatters.reduce((acc, d) => {
        const f = Function("n", "libs", "formatters", d.logic);
        const fName = d.name.replace(/^\w/g, chr => chr.toLowerCase());
        acc[fName] = n => f(n, libs, acc);
        return acc;
      }, {}),
      router,
      variables,
      locale
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    throttle(() => {
      const navHeight = document.querySelector(".navbar").getBoundingClientRect().height;
      const elem = document.querySelector(".cp-subnav") || document.querySelector(".cp-hero-heading");
      const elemHeight = elem.getBoundingClientRect().top;
      const newScrolled = elemHeight <= navHeight;
      if (newScrolled !== this.state.scrolled) {
        const shortTitle = window.innerWidth > 768 && document.querySelector(".cp-subnav") ? true : false;
        this.setState({scrolled: newScrolled, shortTitle});
      }
    }, 50);
  };


  render() {
    const {profile} = this.props;
    const {scrolled, shortTitle} = this.state;

    let title = null;
    if (profile.sections && profile.sections.length) {
      title = stripP(profile.sections[0].title)
        .replace(/\<br\>/g, "")
        .replace(/\&nbsp\;/, "")
        .replace(/<a[^>]+>/g, " ")
        .replace(/<\/a>/g, " ")
        .replace(/[\s]{1,}/g, " ");
    }

    let placeholder = "Explore Other Reports";
    if (profile.meta) {
      const slug = profile.meta.map(d => d.slug).join("_");
      if (slug === "country") placeholder = "Explore Other Countries";
      else if (slug === "hs92") placeholder = "Explore Other Products";
      else if (slug === "bilateral-country_partner") placeholder = "Explore Other Bilateral Trade Partners";
      else if (slug === "bilateral-product_reporter") placeholder = "Explore Other Product Trade";
      else if (slug.includes("subnational")) placeholder = "Explore Other States/Provinces";
    }

    return (
      <div className="profile" id="top">
        { title && <Helmet title={stripHTML(title)} /> }
        <OECNavbar
          className={scrolled ? "background" : ""}
          title={title}
          scrolled={scrolled}
          shortTitle={shortTitle}
        />
        <CMSProfile searchProps={{...profileSearchConfig, placeholder}} {...this.props} />

        <Footer />
      </div>
    );
  }
}


Profile.need = [
  fetchData("profile", "/api/profile/?slug=<slug>&id=<id>&slug2=<slug2>&id2=<id2>&slug3=<slug3>&id3=<id3>&locale=<i18n.locale>"),
  fetchData("formatters", "/api/formatters")
];

Profile.childContextTypes = {
  formatters: PropTypes.object,
  locale: PropTypes.string,
  router: PropTypes.object,
  variables: PropTypes.object
};


export default hot(withNamespaces()(
  connect(state => ({
    formatters: state.data.formatters,
    locale: state.i18n.locale,
    profile: state.data.profile
  }))(Profile)
));
