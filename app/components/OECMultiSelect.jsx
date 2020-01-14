import React from "react";
import {MultiSelect} from "@blueprintjs/select";
import {Button, MenuItem, Tag} from "@blueprintjs/core";

class OECMultiSelect extends React.Component {
  handleTagRemove = (tag, index) => {
    const {selectedItems} = this.props;
    selectedItems.splice(index, 1);
    this.props.callback(selectedItems);
  }

  handleTagInsert = d => {
    const {selectedItems} = this.props;
    selectedItems.push(d);
    this.props.callback(selectedItems);
  }

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
        onItemSelect={d => this.handleTagInsert(d)}
        tagInputProps={{onRemove: this.handleTagRemove}}
        tagRenderer={d => d.title}
      />
    </div>;
  }
}

export default OECMultiSelect;
