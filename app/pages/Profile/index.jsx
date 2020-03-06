import React from "react";
import {hot} from "react-hot-loader/root";
import PropTypes from "prop-types";
import {Helmet} from "react-helmet";
import {select} from "d3-selection";

import {fetchData} from "@datawheel/canon-core";
import throttle from "@datawheel/canon-cms/src/utils/throttle";
import stripHTML from "@datawheel/canon-cms/src/utils/formatters/stripHTML";
import stripP from "@datawheel/canon-cms/src/utils/formatters/stripP";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import libs from "@datawheel/canon-cms/src/utils/libs";
import {Profile as CMSProfile} from "@datawheel/canon-cms";
import OECNavbar from "components/OECNavbar";

import Footer from "components/Footer";
import "./Profile.css";

class Profile extends React.Component {
  state = {
    scrolled: false
  };

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
      const title = select(".cp-hero-heading").node();
      this.setState({scrolled: title.getBoundingClientRect().top < 0});
    }, 50);
  };


  render() {
    const {profile} = this.props;
    const {scrolled} = this.state;

    let title = null;
    if (profile.sections.length) {
      title = stripP(profile.sections[0].title)
        .replace(/\<br\>/g, "")
        .replace(/\&nbsp\;/, "")
        .replace(/<a[^>]+>/g, " ")
        .replace(/<\/a>/g, " ")
        .replace(/[\s]{1,}/g, " ");
    }
    console.log("title", title);

    return (
      <div className="profile" id="top">
        <Helmet title={stripHTML(title)} />
        <OECNavbar
          className={scrolled ? "background" : ""}
          title={title}
          scrolled={scrolled}
        />
        <CMSProfile {...this.props} />

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
