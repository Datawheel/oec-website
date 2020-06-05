import React from "react";

export default class PaywallChart extends React.Component {
  render() {
    const n = {};
    const {title, type} = this.props;
    const user = n.user || false;
    const link = n.url || (user ? "/en/account" : "/en/signup");
    const button = n.button || (user ? "Click here to verify your e-mail!" : "Click here to register!");
    const image = n.image || false;
    return <div className="profile-paywall" style={{position: "relative", minHeight: 450}}>
      <div className="profile-paywall-image"
        style={{
          backgroundImage: image ? `url('${image}')` : type ? `url('/images/paywall/${type}.svg')` : "none"}}>
      </div>
      <div className="profile-paywall-content">
        <h3>{title}</h3>
        <p>
          <a className="profile-paywall-button" href={`${link}`}>{button}</a>
        </p>
      </div>
    </div>;
  }
}

PaywallChart.defaultProps = {
  title: "This feature is only available for PRO accounts",
  type: "Treemap"
};
