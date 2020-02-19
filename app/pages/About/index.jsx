import React from "react";
import {Helmet} from "react-helmet";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import "./About.css";

import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";

import AboutSite from "components/AboutSite";
import AboutFAQ from "components/AboutFAQ";

class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _active: ""
    };
  }

  componentDidMount() {
    this.setState({
      _active: this.props.location.hash.split("#")[1] || "site"
    });
  }

  render() {
    const {_active} = this.state;
    const {t} = this.props;

    return (
      <div className="about-page">
        <Helmet>
          <title>{t("about_title")}</title>
        </Helmet>
        <OECNavbar />
        <div className="about-content">
          {_active === "site" && <AboutSite />}
          {_active === "faq" && <AboutFAQ />}
        </div>
        <Footer />
      </div>
    );
  }
}

export default withNamespaces()(connect()(index));
