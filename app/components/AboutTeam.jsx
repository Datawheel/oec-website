import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTwitter, faGithubAlt, faLinkedin} from "@fortawesome/free-brands-svg-icons";

import "./AboutTeam.css";

class AboutTeam extends React.Component {
  state = {};
  render() {
    const {data, type, t} = this.props;

    return (
      <div className="about-team">
        {type === "team" && 
          <div className="team">
            <div className="title">{t(data.title)}</div>
            {data.members.map((d, k) => 
              <div className="card" key={k}>
                <div
                  className="member-photo"
                  style={{backgroundImage: `url(/images/about/${d.img})`}}
                />
                <div className="member-profile">
                  <div className="profile-header">
                    <div className="header-name">{t(d.name)}</div>
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
                  <div className="profile-time">{t(d.time)}</div>
                  <div className="profile-description">
                    <p
                      className={"text"}
                      dangerouslySetInnerHTML={{__html: t(d.description)}}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        }
        {type === "contributors" && 
          <div className="contributors">
            <div className="title">{t(data.title)}</div>
            {data.members.map(d => console.log(d))}
          </div>
        }
      </div>
    );
  }
}

export default AboutTeam;
