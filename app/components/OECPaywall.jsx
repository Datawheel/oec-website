import React from "react";
import {AnchorButton, Classes, Dialog, Intent} from "@blueprintjs/core";

class OECPaywall extends React.Component {
  state = {
    isOpen: false
  };

  handleClose = () => {
    this.setState({isOpen: false});
    this.props.callback(false);
  };

  render() {
    const {isOpen} = this.state;
    const {auth, paywall, redirect} = this.props;
    console.log(this.props);

    const show = !(auth && auth.loading) || paywall;

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
              <AnchorButton href={`/en/login?redirect=${redirect}`}>Login</AnchorButton>
              <AnchorButton intent={Intent.SUCCESS} href="/en/signup">
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
