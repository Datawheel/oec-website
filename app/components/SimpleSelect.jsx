import React from "react";
import {Select} from "@blueprintjs/select";
import {Button, MenuItem} from "@blueprintjs/core";
import classnames from "classnames";

import "./SimpleSelect.css";

export default class SimpleSelect extends React.Component {
  state = {
    isOpen: false
  }

  renderItem = (item, {modifiers, handleClick}) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }

    return <MenuItem
      active={modifiers.active}
      key={`${item.value || item.id}-${item.title || item.name}`}
      label={item.label || ""}
      onClick={handleClick}
      shouldDismissPopover={false}
      text={<div className="menu-item-text">{item.title || item.name}</div>}
    />;

  };
  render() {
    const {disabled, items, isPro, popoverPosition, selectedItem, title} = this.props;
    const {isOpen} = this.state;
    return <div className="selector">
      <h6 className={classnames("title", "is-6", {"is-pro": isPro})}>{title}</h6>
      <Select
        activeItem={selectedItem}
        className={classnames(
          "popover-virtual-selector",
          "filter-selector",
          "oec-selector",
          {"is-disabled": disabled}
        )}
        disabled={disabled}
        filterable={false}
        isOpen={isOpen}
        itemRenderer={this.renderItem}
        items={items}
        minimal={true}
        usePortal={false}
        onItemSelect={d => this.props.callback(this.props.state, d)}
        popoverProps={{minimal: true, position: popoverPosition, popoverClassName: "selector"}}
      >
        <Button
          className="button-virtual-selector"
          text={selectedItem.title || selectedItem.name}
          rightIcon="chevron-down"
        />
      </Select>
    </div>;
  }
}

SimpleSelect.defaultProps = {
  disabled: false,
  isPro: false,
  popoverPosition: "bottom-left"
};
