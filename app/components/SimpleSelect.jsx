import React from "react";
import {Select} from "@blueprintjs/select";
import {Button, MenuItem} from "@blueprintjs/core";

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
      key={`${item.value}-${item.title}`}
      label={item.label || ""}
      onClick={handleClick}
      shouldDismissPopover={false}
      text={<div className="menu-item-text">{item.title}</div>}
    />;

  };
  render() {
    const {items, popoverPosition, selectedItem, title} = this.props;
    const {isOpen} = this.state;
    return <div className="selector">
      <h6 className="title is-6">{title}</h6>
      <Select
        activeItem={selectedItem}
        className="popover-virtual-selector filter-selector"
        filterable={false}
        isOpen={isOpen}
        itemRenderer={this.renderItem}
        items={items}
        minimal={true}
        onItemSelect={d => this.props.callback(this.props.state, d)}
        popoverProps={{minimal: true, position: popoverPosition}}
      >
        <Button
          className="button-virtual-selector"
          text={selectedItem.title}
          rightIcon="chevron-down"
        />
      </Select>
    </div>;
  }
}

SimpleSelect.defaultProps = {
  popoverPosition: "bottom-left"
};
