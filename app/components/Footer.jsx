import React from "react";
import "./Footer.css";

class Footer extends React.Component {
  render() {
    return <div className="footer">
      <div className="container">
        <p className="footer-legal u-font-xxs u-margin-bottom-off">
          The Observatory of Economic Complexity by <a href="http://alexandersimoes.com/">Alexander Simoes</a> is licensed under a <a href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-ShareAlike 3.0 Unported License</a>. Permissions beyond the scope of this license may be available <a href="/permissions/">here</a>.
        </p>
        <p className="footer-license-container u-margin-top-xs">
          <a className="license" rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/">
            <img alt="Creative Commons License" src="//i.creativecommons.org/l/by-sa/3.0/80x15.png" />
          </a>
        </p>
      </div>
    </div>;
  }
}

export default Footer;
