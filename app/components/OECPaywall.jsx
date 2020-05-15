import React from "react";
import {AnchorButton, Classes, Dialog, Intent} from "@blueprintjs/core";

import "./OECPaywall.css";

class OECPaywall extends React.Component {
  state = {
    isOpen: false
  };

  handleClose = () => {
    this.setState({isOpen: false});
    this.props.callback(false);
  };

  render() {
    const {auth, paywall, redirect} = this.props;

    const show = paywall && !auth.user;

    return (
      <div className="paywall-component">
        <Dialog
          autoFocus={true}
          canOutsideClickClose={false}
          className={"paywall-component-dialog"}
          icon="info-sign"
          isOpen={show}
          onClose={this.handleClose}
          title="Join the OEC Pro"
        >
          <div className={Classes.DIALOG_BODY}>
            <h2>Become a Pro!</h2>
            <p>
            Register for the OEC pro and enjoy powerful features:
            </p>
            <ul>
              <li>Up to date subnational trade data</li>
              <li>Tariff information</li>
              <li>Forecasting tools</li>
            </ul>
            <p>...and more</p>
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <AnchorButton minimal={true} href={`/en/login?redirect=${redirect}`}>Login</AnchorButton>
              <AnchorButton minimal={true} intent={Intent.SUCCESS} href="/en/signup">
                Register
              </AnchorButton>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

OECPaywall.defaultProps = {
  callback: undefined,
  paywall: false,
  redirect: "/en/prediction/trade-annual"
};

export default OECPaywall;
