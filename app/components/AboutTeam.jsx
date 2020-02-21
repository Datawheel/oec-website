import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTwitter, faGithubAlt, faLinkedin} from "@fortawesome/free-brands-svg-icons";

import "./AboutTeam.css";

class AboutTeam extends Component {
  state = {};
  render() {
    const {data, type} = this.props;

    return (
      <div className="about-team">
        <div className={`team ${type}`}>
          {data.map((d, k) =>
            <div className="card" key={k}>
              <div
                className="member-photo"
                style={{backgroundImage: `url(/images/about/${d.img})`}}
              />
              <div className="member-profile">
                <div className="profile-header">
                  <div className="header-name">{d.name}</div>
                  <div className="header-socials">
                    {d.twitter &&
                        <a href={d.twitter} target="_blank" rel="noopener noreferrer">
                          <FontAwesomeIcon
                            className="fas fa-twitter icon"
                            icon={faTwitter}
                          />
                        </a>
                    }
                    {d.github &&
                        <a href={d.github} target="_blank" rel="noopener noreferrer">
                          <FontAwesomeIcon
                            className="fas fa-github-alt icon"
                            icon={faGithubAlt}
                          />
                        </a>
                    }
                    {d.linkedin &&
                        <a href={d.linkedin} target="_blank" rel="noopener noreferrer">
                          <FontAwesomeIcon
                            className="fas fa-linkedin icon"
                            icon={faLinkedin}
                          />
                        </a>
                    }
                  </div>
                </div>
                <div className="profile-time">{d.time}</div>
                <div className="profile-description">
                  {d.description}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AboutTeam;
