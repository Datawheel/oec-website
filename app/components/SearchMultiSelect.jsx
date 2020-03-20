import React from "react";
import {colorContrast} from "d3plus-color";
import {Alignment, Button, Classes, Label, MenuItem, Switch} from "@blueprintjs/core";
import {MultiSelect} from "@blueprintjs/select";
import {Intent, Position, Toaster} from "@blueprintjs/core";

import "@blueprintjs/select/lib/css/blueprint-select.css";

const PredictionToaster = typeof window !== "undefined"
  ? Toaster.create({
    className: "prediction-toaster",
    position: Position.TOP,
    icon: "warning-sign",
    maxToasts: 1,
    intent: Intent.WARNING
  })
  : null;

class SearchMultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      selectedItems: props.initialItems || []
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
        key={`${item.id}-${item.name}`}
        label={item.displayId ? `${item.displayId}`.toUpperCase() : `${item.id}`}
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
    const {isDrilldown} = this.props;
    const {selectedItems, items} = this.state;
    let nextSelectedItems = selectedItems.slice();
    const nextItems = items.slice();

    itemsToSelect.forEach(item => {
      nextSelectedItems = !this.arrayContainsItem(nextSelectedItems, item) ? [...nextSelectedItems, item] : nextSelectedItems;
    });
    if (isDrilldown && nextSelectedItems.length > 5) {
      this.setState({selectedItems});
      PredictionToaster.show({message: "5 is the max numeber of drilldowns allowed."});
      return;
    }
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
    const text = `${item.name} ${item.displayId}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    query = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return text.toLowerCase().indexOf(query) >= 0;
  };

  validateDrilldown = x => {
    const {isDrilldown, toggleDrilldown} = this.props;
    const {selectedItems} = this.state;
    if (!isDrilldown && selectedItems.length > 5) {
      PredictionToaster.show({message: "5 is the max numeber of drilldowns allowed. Please remove selections and try again."});
      return;
    }
    toggleDrilldown(x);
  }

  render() {
    const {disabled, isDrilldown, items, itemType} = this.props;
    return <div className="prediction-control">
      <h3>{itemType}</h3>
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
        resetOnSelect={true}
        resetOnQuery={false}
        tagInputProps={{
          disabled,
          onRemove: this.handleTagRemove,
          rightElement: this.state.selectedItems.length ? <Button disabled={disabled} icon="cross" minimal={true} onClick={this.handleClear} /> : null,
          tagProps: d => {
            const thisItem = items.find(dd => dd.name === d);
            return {
              style: {
                backgroundColor: thisItem.color,
                color: colorContrast(thisItem.color)
              }
            };
          },
          inputProps: {
            onBlur: () => {
              // console.log("this1!!", this);
            }
          }
        }}
        tagRenderer={this.renderTag}
        selectedItems={this.state.selectedItems}
      />
      {isDrilldown === true || isDrilldown === false
        ? <Label className={Classes.INLINE}>
          Aggregate&nbsp;
          <Switch
            alignIndicator={Alignment.LEFT}
            checked={isDrilldown}
            labelElement={"Drilldown"}
            inline={true}
            onChange={this.validateDrilldown} />
        </Label>
        : null}
    </div>;
  }
}

export default SearchMultiSelect;
