import React from "react";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import AboutTeam from "components/AboutTeam";

import {SITE} from "helpers/about";

class AboutSite extends React.Component {
  state = {};
  render() {
    const {t} = this.props;

    return (
      <div className="about-site">
        <div className="site-info">
          <div className="info-title">{t(SITE[0].info.title)}</div>
          <div className="info-text">
            {SITE[0].info.text.map((d, k) =>
              <p
                className={"text"}
                key={`${k}`}
                dangerouslySetInnerHTML={{__html: t(d)}}
              />
            )}
          </div>
        </div>

        <AboutTeam data={SITE[0].team} type={"team"} t={t} />

        <AboutTeam data={SITE[0].contributors} type={"contributors"} t={t} />
      </div>
    );
  }
}

export default withNamespaces()(connect()(AboutSite));
