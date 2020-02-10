import React from "react";
import {
  Button,
  ButtonGroup,
  Icon,
  InputGroup,
  MenuItem,
  Popover,
  PopoverInteractionKind,
  Position,
  Tag
} from "@blueprintjs/core";
import {colorContrast} from "d3plus-color";

import List from "react-virtualized/dist/commonjs/List";
import classnames from "classnames";

const depthOptions = ["HS2", "HS4", "HS6"];

class OECMultiSelectV2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      selectedItems: props.selectedItems || [],
      prevItems: undefined,
      selectedChildrenItems: undefined,
      depthSelected: "HS2",
      isOpen: true
    };
  }
  // getSelectedItemIndex = item => this.state.selectedItems.indexOf(item);
  getSelectedItemIndex = item => this.state.selectedItems.findIndex(d => d.name === item.name);

  handleSelector = (d, prevItems) => {
    this.setState({prevItems, selectedChildrenItems: d.values});
    // this.props.run(this.props.state, d);
    // this.setState({isOpen: false, search: undefined});
  }
  isItemSelected = item => this.getSelectedItemIndex(item);
  handleItemSelect = item => {
    if (this.isItemSelected(item) === -1) {
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
    // this.props.callback(nextSelectedItems);
  }
  deleteItemFromArray = (items, itemToDelete) => items.filter(item => item !== itemToDelete);
  deselectItem(index) {
    const {selectedItems} = this.state;

    // Delete the item if the user manually created it.
    const nextSelectedItems = selectedItems.filter((_item, i) => i !== index);
    this.setState({
      selectedItems: nextSelectedItems
    });
    // this.props.callback(nextSelectedItems);
  }
  handleTagRemove = (_tag, index) => {
    this.deselectItem(index);
  };
  handleClear = () => {
    this.setState({selectedItems: []});
    this.props.callback([]);
  };

  areItemsEqual(itemA, itemB) {
    // Compare only the names (ignoring case) just for simplicity.
    return itemA.name.toString().toLowerCase() === itemB.name.toString().toLowerCase();
  }

  filterItems = (query, item) => {
    const text = item.name.toString();
    return text.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  };

  handleDepthButton = depthSelected => {
    this.setState({depthSelected});
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.items !== this.props.items) {
      this.setState({items: this.props.items});
    }
  }

  rowRenderer = (
    key,         // Unique key within array of rows
    index,       // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    style        // Style object to be applied to row (to position it)
  ) => {
    const {items, selectedItems, selectedChildrenItems} = this.state;
    // const {search} = this.state;
    // const filteredItems = search ? items.filter(d =>
    //   d.name.toLowerCase().includes(search.toLowerCase()) || d.prevId.includes(search.toLowerCase())
    // ) : items;
    const s = false;
    // selectedItems.length > 0
    const filteredItems = selectedChildrenItems ? selectedChildrenItems : items;
    const item = filteredItems[key.index];

    return (
      <div
        style={key.style}
        className={s ? "is-selected virtual-selector-item" : "virtual-selector-item"}
      >
        <div className="item">
          <Icon icon={this.isItemSelected(item) !== -1 ? "tick" : "blank"} />
          <div
            className="item-name"
            onClick={() => this.handleItemSelect(item)}
          >
            <div className="item-icon-content" style={{backgroundColor: item.color}}>
              <img className="item-icon" src={item.icon} alt=""/>
            </div>
            <div>{item.name}</div>
          </div>
          {item.values && item.values.length > 0 && <Icon
            onClick={() => this.handleSelector(item, filteredItems)}
            icon="chevron-right"
          />}
        </div>
        {s && <Icon icon="small-tick" />}
      </div>
    );
  }

  handleInteraction(nextOpenState) {
    this.setState({isOpen: nextOpenState, search: undefined});
  }

  render() {
    // const {} = this.props;
    const {items, selectedItems, selectedChildrenItems} = this.state;

    const filteredItems = selectedChildrenItems ? selectedChildrenItems : items;

    const len = filteredItems.length;
    const itemHeight = 50;
    const selectedIndex = 0;

    return <Popover
      className="popover-virtual-selector filter-selector"
      content={
        <div>
          <div className="virtual-multi-select-tabs">
            <ButtonGroup minimal={true}>
              {depthOptions.map((d, i) => <Button
                key={`button_depth_${i}`}
                className={classnames("ms-button-depth", {"is-active": this.state.depthSelected === d})}
                onClick={() => this.handleDepthButton(d)}
              >
                {d}
              </Button>)}
            </ButtonGroup>
          </div>
          <div className="virtual-multi-select-search">
            <InputGroup
              leftIcon="search"
              onChange={this.handleInputChange}
              value={""}
              // placeholder={t("Filter")}
              rightElement={<Button className="button-virtual-selector" icon="cross" onClick={() => this.setState({search: undefined})} />}
            />
            <Button
              onClick={() => this.setState({selectedChildrenItems: this.state.prevItems})}
              text="Back"
            />
          </div>
          <div className="ms-tags">
            {this.state.selectedItems.map((d, i) => <Tag
              key={`tag_${d.name}_${i}`}
              style={{backgroundColor: d.color, color: colorContrast(d.color)}}
              rightIcon="cross">{d.name}</Tag>)}

          </div>
          <List
            height={(len > 6 ? 6 : len) * itemHeight}
            width={300}
            rowCount={len}
            // scrollToIndex={selectedIndex > 6 ? selectedIndex + 4 : selectedIndex}
            rowHeight={itemHeight}
            key={Math.random()}
            rowRenderer={this.rowRenderer}
          />
          {len === 0 ? <MenuItem disabled={true} text={("No results.")} /> : ""}
        </div>
      }
      interactionKind={PopoverInteractionKind.CLICK}
      isOpen={this.state.isOpen}
      onInteraction={state => this.handleInteraction(state)}
      position={Position.BOTTOM_LEFT}
    >
      <Button text={"Hello hello"} rightIcon="chevron-down" />
    </Popover>;
  }
}

export default OECMultiSelectV2;
