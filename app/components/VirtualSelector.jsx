import React from "react";
import {withNamespaces} from "react-i18next";
import {
  Button,
  Icon,
  InputGroup,
  MenuItem,
  Popover,
  PopoverInteractionKind,
  Position
} from "@blueprintjs/core";

import List from "react-virtualized/dist/commonjs/List";

import "./VirtualSelector.css";
import OECButtonGroup from "./OECButtonGroup";

class VirtualSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "Log",
      isOpen: false,
      search: undefined
    };
    this.rowRenderer = this.rowRenderer.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInteraction(nextOpenState) {
    this.setState({isOpen: nextOpenState, search: undefined});
  }

  handleSelector(d) {
    this.props.run(this.props.state, d);
    this.setState({isOpen: false, search: undefined});
  }

  handleInputChange = e => {
    this.setState({search: e.target.value});
  };

  rowRenderer = (
    key,         // Unique key within array of rows
    index,       // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    style        // Style object to be applied to row (to position it)
  ) => {
    const {items, selectedItem} = this.props;
    const {search} = this.state;
    const filteredItems = search ? items.filter(d =>
      d.title.toLowerCase().includes(search.toLowerCase())
    ) : items;

    const d = filteredItems[key.index];

    const selected = selectedItem ? selectedItem : items[0];
    const s = selected.title === d.title;

    return (
      <div
        style={key.style}
        className={s ? "is-selected virtual-selector-item" : "virtual-selector-item"}
        onClick={() => this.handleSelector(d)}
      >
        <div className="item">
          {this.props.icon && <div className="box" style={{backgroundColor: "gray"}}>
            <img src={`/images/icons/hs/hs_${d}.png`} />
          </div>}
          <span className="text">{d.title} <span className="product-id"></span></span>
        </div>
        {s && <Icon icon="small-tick" />}
      </div>
    );
  }


  render() {
    const {items, selectedItem, scale, title, t} = this.props;
    const {search} = this.state;
    const filteredItems = search ? items.filter(d =>
      d.title.toLowerCase().includes(search.toLowerCase())
    ) : items;

    const len = filteredItems.length;
    const itemHeight = 50;

    const selected = selectedItem || items[0];
    const selectedIndex = search ? 0 : items.findIndex(d => d.value === selected.value);

    return <div className="selector">
      <h6 className="title is-6">{title}</h6>
      <Popover
        className="popover-virtual-selector filter-selector"
        content={
          <div>
            <InputGroup
              leftIcon="search"
              onChange={this.handleInputChange}
              value={search || ""}
              placeholder={t("Filter")}
              rightElement={<Button className="button-virtual-selector" icon="cross" onClick={() => this.setState({search: undefined})} />}
            />
            <List
              height={(len > 6 ? 6 : len) * itemHeight}
              width={300}
              rowCount={len}
              scrollToIndex={selectedIndex > 6 ? selectedIndex + 4 : selectedIndex}
              rowHeight={itemHeight}
              rowRenderer={this.rowRenderer}
            />
            {len === 0 ? <MenuItem disabled={true} text={t("No results.")} /> : ""}
          </div>
        }
        interactionKind={PopoverInteractionKind.CLICK}
        isOpen={this.state.isOpen}
        onInteraction={state => this.handleInteraction(state)}
        position={Position.BOTTOM}
      >
        <Button text={<div className="option">
          <div className="product">
            {this.props.icon && <div className="box" style={{backgroundColor: "gray"}}>
              <img src={`/images/icons/hs/hs_${selected}.png`} /></div>}
            <span className="text">{selected && selected.title}</span></div></div>} rightIcon="chevron-down" />
      </Popover>
      {scale && <OECButtonGroup
        items={["Log", "Linear"]}
        selected={this.state.active}
        callback={active => (this.props.callbackButton(`${this.props.state}Scale`, active), this.setState({active}))}
      />}
    </div>;

  }
}

VirtualSelector.defaultProps = {
  icon: undefined,
  items: [],
  selectedItem: undefined,
  title: "Title",
  scale: false
};

export default withNamespaces()(VirtualSelector);
