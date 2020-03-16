// @ts-check
import {Button, Classes, Tag, Text} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";
import classNames from "classnames";
import {nest} from "d3-collection";
import React, {useCallback, useMemo} from "react";
import "./SelectMultiHierarchy.css";
import SMHFullList from "./SelectMultiHierarchyList";
import SMHNaviList from "./SelectMultiHierarchyNavi";


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
 * @property {string[]} levels
 * A list of strings, composing the hierarchies to be shown from the raw data.
 * @property {any[]} items
 * The list of base data items that will be hierarchified.
 * @property {SelectedItem[]} selectedItems
 * Here we handle the selected items, can be empty at start.
 * @property {(d: any) => string} [getColor]
 * This function must provide a color for each item of the array provided on `items`.
 * @property {(d: any) => string} [getIcon]
 * This function must provide an url to an icon for each item of the array provided on `items`.
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
 * The code is written under the assumption the IDs are available under the `Key ID` format.
 *
 * @type {React.FC<OwnProps>}
 * @example
 * ```jsx
 * <SelectMultiSection
 *   levels={["Section", "HS2", "HS4"]}
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
const SelectMultiHierarchy = ({
  getColor = () => undefined,
  getIcon = () => undefined,
  itemListPredicate,
  itemRenderer,
  items,
  levels,
  onClear,
  onItemRemove,
  onItemSelect,
  selectedItems
}) => {
  const memoLevels = useMemo(() => levels, levels);

  const extendedItems = useMemo(() => {
    const keys = levels.slice();
    const lastKey = keys.pop();

    const extendedItems = [];

    const headerKeys = [];
    const nestedItems = nest()
      .rollup(values => {
        const firstItem = values[0];

        const color = getColor(firstItem) || "#999";
        const icon = getIcon(firstItem);
        const keyIds = keys.map(key => firstItem[`${key} ID`]);
        const keyNames = keys.map(key => firstItem[key]);

        const keyItems = keys.map((key, i) => {
          if (headerKeys[i] !== keyNames[i]) {
            headerKeys[i] = keyNames[i];
            return {
              color,
              icon,
              id: keyIds[i],
              name: keyNames[i],
              type: key,
              searchIndex: keyNames.slice(0, i + 1).concat(keyIds[i]).join("|")
            };
          }
          return false;
        }).filter(Boolean);
        const valueItems = values.map(item => ({
          color,
          icon,
          id: item[`${lastKey} ID`],
          name: item[lastKey],
          type: lastKey,
          searchIndex: keyNames.concat(item[lastKey], item[`${lastKey} ID`]).join("|")
        }));

        extendedItems.push(...keyItems.concat(valueItems));
      });

    keys.forEach(key => {
      nestedItems.key(d => `${d[`${key} ID`]}|${d[key]}`);
    });

    nestedItems.entries(items);
    return extendedItems;
  }, [memoLevels, items]);

  /** @type {import("@blueprintjs/select").ItemListRenderer<SelectedItem>} */
  const itemListRenderer = useCallback(itemListProps => {
    if (itemListProps.filteredItems.length === 0) {
      return (
        <div className="sm--section--no-results">
          <em>No results found</em>
        </div>
      );
    }

    return itemListProps.query
      ? React.createElement(SMHFullList, {...itemListProps, levels})
      : React.createElement(SMHNaviList, {...itemListProps, levels});
  }, [memoLevels]);

  return (
    <Select
      // filterable={true}
      itemListPredicate={itemListPredicate}
      itemListRenderer={itemListRenderer}
      itemRenderer={itemRenderer}
      items={extendedItems}
      // inputProps={{inputRef}}
      onItemSelect={onItemSelect}
      popoverProps={{
        // boundary: "viewport",
        // captureDismiss: true,
        fill: true,
        minimal: true,
        // onInteraction: popoverInteractionHandler,
        popoverClassName: "sm-section--popover"
      }}
    >
      <div className="bp3-input bp3-tag-input bp3-fill">
        <div className="bp3-tag-input-values">
          {selectedItems.map(item =>
            <Tag
              icon={item.icon
                ? <img
                  alt={`[Icon for ${item.type} "${item.name}"]`}
                  className="sm-section--hs-icon"
                  src={item.icon}
                />
                : undefined
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

const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reHasRegExpChar = RegExp(reRegExpChar.source);
const escapeRegExp = value => {
  value = `${value}`.trim();
  return value && reHasRegExpChar.test(value)
    ? value.replace(reRegExpChar, "\\$&")
    : value;
};

SelectMultiHierarchy.defaultProps = {
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
        {item.icon != null && <img
          alt={`[Icon for ${item.type} "${item.name}"]`}
          className="sm-section--hs-icon"
          src={item.icon}
          style={{backgroundColor: item.color}}
        />}
        <Text className={Classes.FILL} ellipsize={true}>
          {item.name}
        </Text>
        <span className={Classes.MENU_ITEM_LABEL}>{item.id}</span>
      </button>
    );
  }
};

export default SelectMultiHierarchy;
