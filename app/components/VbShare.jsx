import React from "react";
import {Link} from "react-router";
import {withNamespaces} from "react-i18next";
import {
  Button,
  Drawer,
  InputGroup,
  Position
} from "@blueprintjs/core";

import {formatAbbreviate} from "d3plus-format";
import colors from "../helpers/colors";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTwitter, faGithubAlt, faLinkedin, faFacebook, faWhatsappSquare, faWhatsapp} from "@fortawesome/free-brands-svg-icons";


import "./VbShare.css";

class VbShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      permalink: "",
      autoFocus: true,
      canEscapeKeyClose: true,
      canOutsideClickClose: true,
      enforceFocus: true,
      hasBackdrop: true,
      isOpen: false,
      isCopiedLink: false,
      isCopiedEmbed: false,
      position: Position.RIGHT,
      size: undefined,
      usePortal: true
    };
  }

  componentDidMount = () => {
    this.setState({permalink: window.location.href});
  }

  shouldComponentUpdate = (prevProps, prevState) => this.state.isOpen !== prevState.isOpen ||
  this.state.permalink !== prevState.permalink || this.state.isCopiedEmbed !== prevState.isCopiedEmbed ||
  this.state.isCopiedLink !== prevState.isCopiedLink;

  handleOpen = () => this.setState({isOpen: true});
  handleClose = () => {
    this.setState({isOpen: false});
    // this.props.callback(false);
  };

  handleCopyClipboard = (key, text) => {
    console.log("Mr blue sky");
    this.setState({[key]: true});
    navigator.clipboard.writeText(text);
  }

  render() {
    const {isCopiedEmbed, isCopiedLink, permalink} = this.state;

    const embed = `<iframe width="560" height="315" src="${permalink}?controls=false" frameborder="0"></iframe>`;

    const facebookMessage = `https://www.facebook.com/sharer/sharer.php?u=${permalink}`;
    const linkedInMessage = `http://www.linkedin.com/shareArticle?mini=true&url=${permalink}`;
    const twitterMessage = `http://twitter.com/share?text=&url=${permalink}&hashtags=OEC,OECworld`;
    const whatsAppMessage = `https://wa.me/?text=${permalink}`;

    return <div>
      <Button className="vb-chart-button-option" icon="share" text="Share" onClick={() => this.handleOpen()} />
      <Drawer
        className={"vb-drawer"}
        icon={"share"}
        onClose={this.handleClose}
        title={"Share"}
        {...this.state}
      >
        <div className="bp3-drawer-body">
          <div className="vb-share-option">
            <h5 className="title">Short URL</h5>
            <InputGroup
              value={permalink}
              rightElement={<Button
                onClick={() => this.handleCopyClipboard("isCopiedLink", permalink)}
                text={isCopiedLink ? "Copied" : "Copy"}
              />}
            />
          </div>

          <div className="vb-share-option">
            <h5 className="title">Embed URL</h5>
            <InputGroup
              value={embed}
              rightElement={<Button
                onClick={() => this.handleCopyClipboard("isCopiedEmbed", embed)}
                text={isCopiedEmbed ? "Copied" : "Copy"}
              />}
            />
          </div>

          <div className="vb-share-option">
            <h5 className="title">Social Media</h5>
            <a href={twitterMessage} className="vb-share-social" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon
                className="fas fa-twitter icon"
                icon={faTwitter}
              />
              Share on Twitter
            </a>
            <a href={facebookMessage} className="vb-share-social" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon
                className="fas fa-twitter icon"
                icon={faFacebook}
              />
              Share on Facebook
            </a>
            <a href={linkedInMessage} className="vb-share-social" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon
                className="fas fa-twitter icon"
                icon={faLinkedin}
              />
              Share on LinkedIn
            </a>
            <a href={whatsAppMessage} className="vb-share-social" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon
                className="fas fa-twitter icon"
                icon={faWhatsapp}
              />
              Share on WhatsApp
            </a>
          </div>

        </div>
      </Drawer>
    </div>;
  }
}

export default withNamespaces()(VbShare);
