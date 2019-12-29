import React from "react";

import {Button, MenuItem} from "@blueprintjs/core";
import {MultiSelect} from "@blueprintjs/select";

class SearchMultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      selectedItems: []
    };
  }

  // componentDidUpdate() {
  //   console.log("this.props.updateSelection", this.props.updateSelection);
  // }

  renderTag = item => item.name;
  renderItem = (item, {modifiers, handleClick}) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={modifiers.active}
        icon={this.isItemSelected(item) ? "tick" : "blank"}
        key={item.name}
        label={undefined}
        onClick={handleClick}
        text={item.name}
        shouldDismissPopover={false}
      />
    );
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
  arrayContainsItem = itemToFind => this.state.selectedItems.some(item => item.name === itemToFind.name);
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
    this.props.updateSelection(nextSelectedItems);
  }
  deleteItemFromArray = (items, itemToDelete) => items.filter(item => item !== itemToDelete);
  deselectItem(index) {
    const {selectedItems} = this.state;

    // Delete the item if the user manually created it.
    const nextSelectedItems = selectedItems.filter((_item, i) => i !== index);
    this.setState({
      selectedItems: nextSelectedItems
    });
    this.props.updateSelection(nextSelectedItems);
  }
  handleTagRemove = (_tag, index) => {
    this.deselectItem(index);
  };
  handleClear = () => {
    this.setState({selectedItems: []});
    this.props.updateSelection([]);
  };

  areItemsEqual(itemA, itemB) {
    // Compare only the names (ignoring case) just for simplicity.
    return itemA.name.toLowerCase() === itemB.name.toLowerCase();
  }

  filterItems = (query, item) => {
    const text = item.name;
    return text.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  };

  render() {
    return <div className="prediction-control">
      <h3>Select a {this.props.itemType}...</h3>
      <MultiSelect
        fill={true}
        initialContent={undefined}
        itemPredicate={this.filterItems}
        itemRenderer={this.renderItem}
        itemsEqual={this.areItemsEqual}
        items={this.state.items}
        noResults={<MenuItem disabled={true} text="No results." />}
        onItemSelect={this.handleItemSelect}
        popoverProps={{minimal: true}}
        tagRenderer={this.renderTag}
        tagInputProps={{
          onRemove: this.handleTagRemove,
          rightElement: this.state.selectedItems.length ? <Button icon="cross" minimal={true} onClick={this.handleClear} /> : null
        }}
        selectedItems={this.state.selectedItems}
      />
    </div>;
  }
}

export default SearchMultiSelect;
