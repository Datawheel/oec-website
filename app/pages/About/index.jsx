import React from "react";
import {Helmet} from "react-helmet";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import "./About.css";

import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";
import Loading from "components/Loading";

import AboutSite from "components/AboutSite";
import AboutFAQ from "components/AboutFAQ";
import AboutPublications from "components/AboutPublications";

class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _active: "",
      _loading: true,
      _valid: true
    };
  }

  componentDidMount() {
    const hash = this.props.location.hash.split("#")[1];
    let _valid = true;

    if (hash) {
      const validHash = ["site", "oec-pro", "faq", "publications"];
      _valid = validHash.some(d => d === hash);
    }

    this.setState({
      _active: hash || "site",
      _loading: false,
      _valid
    });
  }

  render() {
    const {_active, _loading, _valid} = this.state;
    const {t} = this.props;

    if (_loading) {
      return (
        <div>
          <Helmet>
            <title>{t("Loading")}</title>
          </Helmet>
          <OECNavbar />
          <Loading />
          <Footer />
        </div>
      );
    }

    if (!_valid) {
      return (
        <div>
          ERROR 404
        </div>
      );
    }

    return (
      <div className="about-page">
        <Helmet>
          <title>{t("about_title")}</title>
        </Helmet>
        <OECNavbar />
        <div className="about-content">
          {_active === "site" && <AboutSite />}
          {_active === "faq" && <AboutFAQ />}
          {_active === "publications" && <AboutPublications />}
        </div>
        <Footer />
      </div>
    );
  }
}

export default withNamespaces()(connect()(index));
