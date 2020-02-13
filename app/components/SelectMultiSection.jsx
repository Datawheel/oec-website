// @ts-check
import {Button, Classes, Text, Tag} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";
import classNames from "classnames";
import {nest} from "d3-collection";
import React, {useMemo} from "react";
import FilterList from "./SelectMultiSectionFilterList";
import HierarchyList from "./SelectMultiSectionHierarchyList";
import colors from "../helpers/colors";

import "./SelectMultiSection.css";

/**
 * @typedef SectionItem
 * This is the structure of data items to provide to the component.
 * @property {number} Section ID
 * @property {string} Section
 * @property {number} HS2 ID
 * @property {string} HS2
 * @property {number} HS4 ID
 * @property {string} HS4
 */

/**
 * @typedef SelectedItem
 * This is the internally-handled standard structure of selected items.
 * Events will send these structures as references to the groups and items selected.
 * @property {string} color
 * @property {string} icon
 * @property {number} id
 * @property {string} name
 * @property {string} searchIndex
 * @property {string} type
 */

/**
 * @typedef OwnProps
 * @property {SectionItem[]} items
 * The list of base data items that will be hierarchified.
 * @property {SelectedItem[]} selectedItems
 * Here we handle the selected items, can be empty at start.
 * @property {(event?: React.MouseEvent<HTMLButtonElement>) => void} [onClear]
 * This function will be called when the used presses the cross button next to the selected item tags in the target.
 * @property {(item: SelectedItem, event?: React.SyntheticEvent<HTMLElement>) => void} [onItemSelect]
 * This function will be called when the user selects an option in the list. The first parameter is the selected item.
 * @property {(e: React.MouseEvent<HTMLButtonElement>, item: SelectedItem) => void} [onItemRemove]
 * This function will be called when the user presses the cross in the tag of the selected item wanted to remove.
 * Note the first parameter is the MouseClick event; this is because you must call `evt.stopPropagation()`.
 * @property {import("@blueprintjs/select").ItemListPredicate<SelectedItem>} [itemListPredicate]
 * This function calculates the resulting list of items after applying a query filter.
 * It's defined on the component defaultProps, so no need to provide it.
 * @property {import("@blueprintjs/select").ItemListRenderer<SelectedItem>} [itemListRenderer]
 * This function renders the list to display in the popover.
 * It's defined on the component defaultProps, so no need to provide it.
 * @property {import("@blueprintjs/select").ItemRenderer<SelectedItem>} [itemRenderer]
 * This function renders each item in the list.
 * It's defined on the component defaultProps, so no need to provide it.
 */

/**
 * SelectMultiSection Component
 * This component generates a hierarchical, navigable, filterable selection component.
 *
 * @type {React.FC<OwnProps>}
 * @example
 * ```jsx
 * <SelectMultiSection
 *   items={datalist}
 *   selectedItems={selectedItems}
 *   onItemSelect={item => {
 *     // item: SelectedItem
 *     const nextItems = selectedItems.concat(item);
 *     setSelectedItems(nextItems);
 *   }}
 *   onItemRemove={(evt, item) => {
 *     // evt: MouseEvent<HTMLButtonElement>
 *     // item: SelectedItem
 *     evt.stopPropagation();
 *     const nextItems = selectedItems.filter(i => i !== item);
 *     setSelectedItems(nextItems);
 *   }}
 *   onClear={() => {
 *     setSelectedItems([]);
 *   }}
 * />
 * ```
 */
const SelectMultiSection = ({
  itemListPredicate,
  itemListRenderer,
  itemRenderer,
  items,
  onClear,
  onItemRemove,
  onItemSelect,
  selectedItems
}) => {
  const extendedItems = useMemo(() => buildSelectionItemList(items), [items]);

  return (
    <Select
      filterable={true}
      itemListPredicate={itemListPredicate}
      itemListRenderer={itemListRenderer}
      itemRenderer={itemRenderer}
      items={extendedItems}
      onItemSelect={onItemSelect}
      popoverProps={{
        boundary: "viewport",
        captureDismiss: true,
        fill: true,
        minimal: true,
        popoverClassName: "sm-section--popover"
      }}
    >
      <div className="bp3-input bp3-tag-input bp3-fill">
        <div className="bp3-tag-input-values">
          {selectedItems.map(item =>
            <Tag
              icon={
                <img
                  alt={`[Icon for ${item.type} "${item.name}"]`}
                  className="sm-section--hs-icon"
                  src={item.icon}
                />
              }
              key={item.id}
              onRemove={onItemRemove ? evt => onItemRemove(evt, item) : undefined}
            >
              {`${item.type}: ${item.name}`}
            </Tag>
          )}
        </div>
        {onClear && selectedItems.length > 0 &&
          <Button icon="cross" minimal={true} onClick={onClear} />
        }
      </div>
    </Select>
  );
};

const buildSelectionItemList = items => nest()
  .key(d => `${d["Section ID"]}|${d.Section}`)
  .key(d => `${d["HS2 ID"]}|${d.HS2}`)
  .entries(items)
  .reduce((list, {key: sKey, values: sValues}) => {
    const [sId, sName] = sKey.split("|");
    const color = colors.Section[sId];
    const icon = `/images/icons/hs/hs_${sId}.png`;

    const keyItem = {
      color,
      icon,
      id: Number.parseInt(sId, 10),
      name: sName,
      type: "Section",
      searchIndex: sKey
    };
    const valuesItem = sValues.reduce((list, {key, values}) => {
      const [id, name] = key.split("|");

      const keyItem = {
        color,
        icon,
        id: Number.parseInt(id, 10),
        name,
        type: "HS2",
        searchIndex: `${key}|${sName}`
      };
      const valuesItem = values.map(item => ({
        color,
        icon,
        id: item["HS4 ID"],
        name: item.HS4,
        type: "HS4",
        searchIndex: [item["HS4 ID"], item.HS4, item.HS2, item.Section].join("|")
      }));
      return list.concat(keyItem, valuesItem);
    }, []);

    return list.concat(keyItem, valuesItem);
  }, []);

const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reHasRegExpChar = RegExp(reRegExpChar.source);
const escapeRegExp = value => {
  value = `${value}`.trim();
  return value && reHasRegExpChar.test(value)
    ? value.replace(reRegExpChar, "\\$&")
    : value;
};

SelectMultiSection.defaultProps = {
  itemListPredicate(query, items) {
    query = escapeRegExp(query).replace(/\s+/g, "[^|]+");
    const queryTester = RegExp(query || ".", "i");
    return items.filter(item => queryTester.test(item.searchIndex));
  },

  itemRenderer(item, {handleClick, modifiers}) {
    return (
      <button
        className={classNames({
          "sm-section--option": true,
          [Classes.ACTIVE]: modifiers.active,
          [Classes.DISABLED]: modifiers.disabled,
          [Classes.FILL]: true,
          [Classes.INTENT_PRIMARY]: modifiers.active,
          [Classes.MENU_ITEM]: true
        })}
        key={item.id}
        onClick={handleClick}
      >
        <img
          alt={`[Icon for Section "${item.name}"]`}
          className="sm-section--hs-icon"
          src={item.icon}
          style={{backgroundColor: item.color}}
        />
        <Text className={Classes.FILL} ellipsize={true}>
          {item.name}
        </Text>
        <span className={Classes.MENU_ITEM_LABEL}>{item.id}</span>
      </button>
    );
  },

  itemListRenderer(itemListProps) {
    if (itemListProps.filteredItems.length === 0) {
      return (
        <div className="sm--section--no-results">
          <em>No results found</em>
        </div>
      );
    }

    return itemListProps.query
      ? React.createElement(FilterList, itemListProps)
      : React.createElement(HierarchyList, itemListProps);
  }
};

export default SelectMultiSection;
