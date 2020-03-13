import React from "react";
import {Alignment, Button, ButtonGroup, Classes, Label, MenuItem, Switch} from "@blueprintjs/core";

class ToggleSelect extends React.Component {
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
    false
    ;
  };
  selectItem(item) {
    this.selectItems([item]);
  }
  arrayContainsItem = itemToFind => this.stoggle - selection.some(item => item.name === itemToFind.name);

  selectItems = itemToSelect => evt => {
    const {selectedItems} = this.state;

    const alreadySelected = selectedItems.findIndex(d => d.id === itemToSelect.id);
    const nextSelectedItems = alreadySelected > -1
      ? selectedItems.filter((_d, i) => i !== alreadySelected)
      : selectedItems.concat([itemToSelect]);

    this.setState({selectedItems: nextSelectedItems});
    this.props.updateSelection(nextSelectedItems);
  }

  render() {
    const {isDrilldown, items, itemType, toggleDrilldown} = this.props;
    const {selectedItems} = this.state;

    return <div className="prediction-control">
      <h3>{itemType}</h3>
      <ButtonGroup minimal={false}>
        {items.map(item =>
          <Button
            active={selectedItems.find(d => d.id === item.id)}
            className="toggle-selection-btn"
            key={item.id}
            text={item.name}
            onClick={this.selectItems(item)} />
        )}
      </ButtonGroup>
      {isDrilldown === true || isDrilldown === false
        ? <Label className={Classes.INLINE}>
          Aggregate&nbsp;
          <Switch
            alignIndicator={Alignment.LEFT}
            checked={isDrilldown}
            labelElement={"Drilldown"}
            inline={true}
            onChange={toggleDrilldown} />
        </Label>
        : null}
    </div>;
  }
}

export default ToggleSelect;
