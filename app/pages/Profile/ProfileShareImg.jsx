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
import OECNavbarForShare from "components/OECNavbarForShare";

import {profileSearchConfig} from "helpers/search";
// import Footer from "components/Footer";
import "./Profile.css";

class ProfileShareImg extends React.Component {

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
    // console.log("profile", profile);

    let title = null;
    let desc = null;
    let img = null;
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
      if (slug === "country") {
        placeholder = "Explore Other Countries";
        desc = `Find the latest trade statistics and economic complexity data for ${title}.`;
        img = `https://pro.oec.world/api/image?slug=${slug}&id=${profile.variables.id}&type=splash`;
        const iso3 = profile.variables.iso3 || "";
        title = iso3 ? `${title} (${iso3.toUpperCase()}) Exports, Imports, and Trade Partners` : `${title} Exports, Imports, and Trade Partners`;
      }
      else if (slug === "hs92") {
        placeholder = "Explore Other Products";
        img = `https://pro.oec.world/api/image?slug=${slug}&id=${profile.variables.id}&type=splash`;
        if (profile.sections.length && profile.sections[0].subtitles.length) {
          const hscode = stripP(profile.sections[0].subtitles[0].subtitle).split(" ")[0];
          // this is the special case where we're looking at an HS Section profile
          desc = `Find the latest data on new markets for the exports and imports of ${title}.`;
          if (`${profile.variables.id}`.length === 2) {
            title = `${title} (HS Section: ${hscode}) Product Trade, Exporters and Importers`;
          }
          else {
            title = `${title} (HS: ${hscode}) Product Trade, Exporters and Importers`;
          }
        }
      }
      else if (slug === "bilateral-country_partner") {
        placeholder = "Explore Other Bilateral Trade Partners";
        const iso31 = profile.variables.iso31 || "";
        const iso32 = profile.variables.iso32 || "";
        if (iso31 && iso32) {
          title = `${profile.variables.name1} (${iso31.toUpperCase()}) and ${profile.variables.name2} (${iso32.toUpperCase()}) Trade`;
        }
        desc = `Find the latest trade data and tariffs between ${profile.variables.name1} and ${profile.variables.name2}.`;
      }
      else if (slug === "bilateral-product_reporter") {
        placeholder = "Explore Other Product Trade";
        desc = `Find the latest exports, imports and tariffs for ${profile.variables.name1} trade in ${profile.variables.name2}.`;
      }
      else if (slug.includes("subnational")) {
        placeholder = "Explore Other States/Provinces";
        desc = `International trade data for ${stripHTML(title)}.`;
      }
    }

    profile.sections = profile.sections.slice(0, 1);
    profile.neighbors = null;

    return (
      <div className="profile" id="top">
        {title
          ? <Helmet>
            <title>{stripHTML(title)}</title>
            <meta property="og:title" content={stripHTML(title)} />
            {desc && <meta name="description" content={stripHTML(desc)} />}
            {desc && <meta property="og:description" content={stripHTML(desc)} />}
            {img && <meta property="og:image" content={img} />}
          </Helmet>
          : null
        }
        <OECNavbarForShare
          className={""}
          title={title}
          scrolled={false}
          shortTitle={"shortTitle"}
        />
        <CMSProfile searchProps={{...profileSearchConfig, placeholder}} {...this.props} />
      </div>
    );
  }
}


ProfileShareImg.need = [
  fetchData("profile", "/api/profile/?slug=<slug>&id=<id>&slug2=<slug2>&id2=<id2>&slug3=<slug3>&id3=<id3>&locale=<i18n.locale>"),
  fetchData("formatters", "/api/formatters")
];

ProfileShareImg.childContextTypes = {
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
  }))(ProfileShareImg)
));
