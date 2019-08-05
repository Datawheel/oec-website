import React from "react";

import "./Footer.css";

const languages = [
  {locale: "de", name: "Deutsch"},
  {locale: "en", name: "English"},
  {locale: "es", name: "Español"},
  {locale: "fr", name: "Français"},
  {locale: "it", name: "Italiano"},
  {locale: "nl", name: "Nederlands"},
  {locale: "pt", name: "Português"},
  {locale: "ru", name: "Pyccĸий"}
];

class Footer extends React.Component {
  render() {
    return <div className="footer">
      <div className="container">
        <ul className="locale-options">
          {languages.map(d => <li><a href={d.locale}>{d.name}</a></li>)}
        </ul>
        <p className="font-xxs">
      The Observatory of Economic Complexity by <a href="http://alexandersimoes.com/">Alexander Simoes</a> is licensed under a <a href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-ShareAlike 3.0 Unported License</a>. Permissions beyond the scope of this license may be available <a href="/permissions/">here</a>.
          <a className="license" rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/">
            <img alt="Creative Commons License" src="//i.creativecommons.org/l/by-sa/3.0/80x15.png" />
          </a>
        </p>
      </div>
    </div>;
  }
}

export default Footer;
