import React from "react";
import {AnchorButton, Classes, Dialog, Intent} from "@blueprintjs/core";

class OECPaywall extends React.Component {
  state = {
    isOpen: null
  };

  render() {
    const {isOpen} = this.state;
    const {auth} = this.props;

    const show = auth.loading
      ? false
      : isOpen === true || isOpen === false
        ? isOpen
        : !auth.user;

    return (
      <div className="paywall-component">
        <Dialog
          autoFocus={true}
          canOutsideClickClose={false}
          className={"paywall-component-dialog"}
          icon="info-sign"
          isOpen={show}
          onClose={this.handleClose}
          title="Join OEC Pro"
        >
          <div className={Classes.DIALOG_BODY}>
            <h2>Become a Pro!</h2>
            <p>
              Create an account and join OEC Pro to become a premium member and access pages like these. By upgrading your account to premium you&apos;ll enjoy the following benefits:
            </p>
            <ol>
              <li>Subnational trade data from 10+ countries including USA, China, Brazil, France and more</li>
              <li>Access to the latest trade data as soon as it becomes available</li>
              <li>Machine learning analytics including trade predictions</li>
            </ol>
            <p>Join today and unleash the power of the world&apos;s best trade data integration platform!</p>
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <AnchorButton href="/en/login?redirect=/en/prediction/trade-annual">Login</AnchorButton>
              <AnchorButton intent={Intent.SUCCESS} href="/en/signup">
                Sign Up!
              </AnchorButton>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default OECPaywall;
