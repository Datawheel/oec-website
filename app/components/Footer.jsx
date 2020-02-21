import React from "react";
import {Link} from "react-router";
import {hot} from "react-hot-loader/root";
import "./Footer.css";
import {EMAIL, NAV} from "helpers/consts";

class Footer extends React.Component {
  render() {
    return <div className="footer">
      <div className="container">
        {NAV.map((group, i) => {
          const {items, title} = group;
          return <ul key={i}>
            <p className="footer-group display">{title}</p>
            {items.map((item, ii) => {
              const {items, pro, title, url} = item;
              return items
                ? <ul key={ii}>
                  <p className="footer-subgroup display">{title}</p>
                  {items.map((item, ii) => {
                    const {pro, title, url} = item;
                    return <li key={ii}><Link className={`footer-link${pro ? " is-pro" : ""}`} to={url}>{title}</Link></li>;
                  })}
                </ul>
                : <li key={ii}><Link className={`footer-link${pro ? " is-pro" : ""}`} to={url}>{title}</Link></li>;
            })}
          </ul>;
        })}
        <div className="footer-contact">
          <ul key="logos" className="footer-sponsor-list">
            <li className="footer-sponsor-item">
              <a href="https://www.datawheel.us/" className="footer-sponsor-link">
                <img
                  className="footer-sponsor-img"
                  src="/images/logos/datawheel-logo.svg"
                  alt="Datawheel"
                  draggable="false"
                />
              </a>
            </li>
            <li className="footer-sponsor-item">
              <a href="https://www.iadb.org" className="footer-sponsor-link">
                <img
                  className="footer-sponsor-img"
                  src="/images/logos/idb-logo.svg"
                  alt="Inter-American Development Bank"
                  draggable="false"
                />
              </a>
            </li>
          </ul>
          <p>Have questions, comments, or concerns?</p>
          <p>Send us an e-mail: <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
        </div>
      </div>
    </div>;
  }
}

export default hot(Footer);
