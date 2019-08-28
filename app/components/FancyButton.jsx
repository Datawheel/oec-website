import React, {Component} from "react";
import {Icon} from "@blueprintjs/core";
import "./FancyButton.css";

/** renders as either a button or a link, but always looks like a fancy button */
export default class FancyButton extends Component {
  render() {
    const {
      disabled,
      children, // the text
      icon, // blueprint icon name
      onClick, // won't render as a link
      link // won't render as a button
    } = this.props;

    let El = this.props;
    if (El === "link" || El === "a" || link) {
      El = "a"
    }
    else El = "button";

    return (
      <El
        className="fancy-button"
        onClick={El === "button" ? onClick : null}
        href={El === "a" ? href : null}
        className="fancy-button"
        disabled={disabled}
      >
        <span className="fancy-button-text">
          {children || "missing `children` prop in FancyButton.jsx"}
        </span>
        <Icon icon={icon} className="fancy-button-icon" />
      </El>
    )
  }
}

FancyButton.defaultProps = {
  El: "button" // could also be a link
}
