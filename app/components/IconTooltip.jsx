import React from "react";
import classNames from "classnames";
import {Icon, Tooltip} from "@blueprintjs/core";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {string} content
 * @property {import("@blueprintjs/core").IconName} icon
 * @property {number} [size]
 */

/** @type {React.FC<OwnProps>} */
const IconTooltip = props =>
  <Tooltip
    content={props.content}
    targetClassName={classNames("icon-tooltip", props.className)}
  >
    <Icon icon={props.icon} iconSize={props.size || 12} />
  </Tooltip>;

export default IconTooltip;
