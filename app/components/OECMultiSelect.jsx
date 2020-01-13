import React from "react";
import {MultiSelect} from "@blueprintjs/select";
import {MenuItem} from "@blueprintjs/core";

class OECMultiSelect extends React.Component {
  render() {
    const {items, selectedItems, title} = this.props;

    return <div className="multi-select-wrapper">
      <h6 className="title">{title}</h6>
      <MultiSelect
        items={items}
        itemRenderer={(d, {modifiers, handleClick}) => <MenuItem
          active={modifiers.active}
          icon={"blank"}
          key={d.value}
          label={"Hello"}
          onClick={handleClick}
          text={d.title}
          shouldDismissPopover={false}
        />}
        selectedItems={selectedItems}
        onItemSelect={d => this.props.callback(d)}
        tagRenderer={d => d.title}
      />
    </div>;
  }
}

export default OECMultiSelect;
