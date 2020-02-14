import React from "react";
import {Helmet} from "react-helmet";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import "./About.css";

import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";
import AboutTeam from "components/AboutTeam";

import {ABOUT} from "helpers/about";

class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {t} = this.props;

    return (
      <div className="about-page">
        <Helmet>
          <title>{t("about_title")}</title>
        </Helmet>
        <OECNavbar />
        <div className="about-content">
          <div className="about-info">
            <div className="info-title">{t(ABOUT[0].info.title)}</div>
            <div className="info-text">
              {ABOUT[0].info.text.map((d, k) =>
                <p
                  className={"text"}
                  key={`${k}`}
                  dangerouslySetInnerHTML={{__html: t(d)}}
                />
              )}
            </div>
          </div>

          <AboutTeam data={ABOUT[0].team} type={"team"} t={t}/>

          <AboutTeam data={ABOUT[0].contributors} type={"contributors"} t={t}/>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withNamespaces()(connect()(index));
