import React from "react";

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
                <div className="member-photo">
                  Aqui va la foto
                  {/* <img src={"/images/about/alexander_simoes.jpg"} alt="profile-photo" className="image" /> */}
                </div>
                <div className="member-profile">
                  <div className="profile-header">
                    Aqui va el nombre y las redes sociales
                  </div>
                  <div className="profile-description">
                    Aqui va la descripción
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
