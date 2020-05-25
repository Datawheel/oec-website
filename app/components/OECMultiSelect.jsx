import React from "react";

import {Button, MenuItem} from "@blueprintjs/core";
import {MultiSelect} from "@blueprintjs/select";
import {colorContrast} from "d3plus-color";
import style from "../style.yml";

import "@blueprintjs/select/lib/css/blueprint-select.css";
import "./OECMultiSelect.css";

class OECMultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      selectedItems: props.selectedItems
    };
  }

  // componentDidUpdate() {
  //   console.log("this.props.updateSelection", this.props.updateSelection);
  // }

  renderTag = item => item.title;
  renderItem = (item, {modifiers, handleClick}) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }

    let itemIcon = "";
    switch (this.props.itemType) {
      case "country":
        itemIcon = <span><img src={`/images/icons/country/country_${item.label}.png`} /></span>;
        break;
      default:
        break;
    }
    return <MenuItem
      active={modifiers.active}
      icon={this.isItemSelected(item) ? "tick" : "blank"}
      key={`${item.value}-${item.title}`}
      label={item.label || ""}
      onClick={handleClick}
      text={<div className="menu-item-text">{itemIcon}{item.title}</div>}
      shouldDismissPopover={false}
    />;

  };
  getSelectedItemIndex = item => this.state.selectedItems.indexOf(item);
  isItemSelected = item => this.getSelectedItemIndex(item) !== -1;
  handleItemSelect = item => {
    if (!this.isItemSelected(item)) {
      this.selectItem(item);
    }
    else {
      this.deselectItem(this.getSelectedItemIndex(item));
    }
  };
  selectItem(item) {
    this.selectItems([item]);
  }
  arrayContainsItem = itemToFind => this.state.selectedItems.some(item => item.title === itemToFind.title);
  selectItems(itemsToSelect) {
    const {selectedItems, items} = this.state;
    let nextSelectedItems = selectedItems.slice();
    const nextItems = items.slice();

    itemsToSelect.forEach(item => {
      nextSelectedItems = !this.arrayContainsItem(nextSelectedItems, item) ? [...nextSelectedItems, item] : nextSelectedItems;
    });

    this.setState({
      selectedItems: nextSelectedItems,
      items: nextItems
    });
    this.props.callback(nextSelectedItems);
  }
  deleteItemFromArray = (items, itemToDelete) => items.filter(item => item !== itemToDelete);
  deselectItem(index) {
    const {selectedItems} = this.state;

    // Delete the item if the user manually created it.
    const nextSelectedItems = selectedItems.filter((_item, i) => i !== index);
    this.setState({
      selectedItems: nextSelectedItems
    });
    this.props.callback(nextSelectedItems);
  }
  handleTagRemove = (_tag, index) => {
    this.deselectItem(index);
  };
  handleClear = () => {
    this.setState({selectedItems: []});
    this.props.onClear([]);
  };

  areItemsEqual(itemA, itemB) {
    // Compare only the names (ignoring case) just for simplicity.
    return itemA.title.toString().toLowerCase() === itemB.title.toString().toLowerCase();
  }

  filterItems = (query, item) => {
    const text = item.title.toString();
    return text.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  };

  render() {
    const {disabled, icon, items, itemType, placeholder, selectedItems, tabIndex, title} = this.props;
    selectedItems.sort((a, b) => a.title > b.title ? 1 : -1);

    return <div className="selector">
      {title ? <h3 className="title">{title}</h3> : null}
      <MultiSelect
        fill={true}
        // initialContent={undefined}
        itemPredicate={this.filterItems}
        itemRenderer={this.renderItem}
        // itemsEqual={this.areItemsEqual}
        items={this.props.items}
        noResults={<MenuItem disabled={true} text="No results." />}
        onItemSelect={this.handleItemSelect}
        placeholder={placeholder}
        popoverProps={{minimal: true, popoverClassName: "selector"}}
        resetOnSelect={true}
        resetOnQuery={false}
        selectedItems={this.props.selectedItems}
        tagInputProps={{
          disabled,
          inputProps: {
            tabIndex
          },
          leftIcon: icon,
          onRemove: this.handleTagRemove,
          placeholder,
          rightElement: this.props.selectedItems.length ? <Button icon="cross" minimal={true} onClick={this.handleClear} /> : null,
          tagProps: d => {
            const thisItem = items.find(dd => dd.title === d);
            return {
              style: {
                backgroundColor: thisItem ? thisItem.color : style["dark-4"],
                color: thisItem ? colorContrast(thisItem.color) : "white"
              }
            };
          }
        }}
        tagRenderer={this.renderTag}
      />
    </div>;
  }
}

OECMultiSelect.defaultProps = {
  itemType: undefined,
  placeholder: undefined
};

export default OECMultiSelect;
