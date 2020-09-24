/* eslint-disable eqeqeq */
// @ts-check
import {Button, Classes, Icon, Tag, Text, Utils} from "@blueprintjs/core";
import {Classes as SelectClasses, Select} from "@blueprintjs/select";
import classNames from "classnames";
import OECPaywall from "components/OECPaywall";
import {nest} from "d3-collection";
import React, {useCallback, useMemo, useState} from "react";
import ReactImageFallback from "react-image-fallback";
import "./SelectMultiHierarchy.css";
import SMHFullList from "./SelectMultiHierarchyList";
import SMHNaviList from "./SelectMultiHierarchyNavi";

/**
 * @template T
 * @extends Select<T>
 */
class PatchedSelect extends Select {

  /**
   * @private
   * @param {T} item
   * @param {React.SyntheticEvent<HTMLElement>} [event]
   */
  handleItemSelect = (item, event) => {
    Utils.safeInvoke(this.props.onItemSelect, item, event);
  };
}

/**
 * @typedef SelectedItem
 * This is the internally-handled standard structure of selected items.
 * Events will send these structures as references to the groups and items selected.
 * @property {string} color
 * @property {string} icon
 * @property {number | string} id
 * @property {number | string} label
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
 * @property {((d: any, lvl: string) => string) | Array<(d: any, lvl: string) => string>} [getColor]
 * This function can provide a color for the background of the icon on each item of the array provided on `items`.
 * If not set, gray will be used.
 * @property {((d: any, lvl: string) => string) | Array<(d: any, lvl: string) => string>} [getIcon]
 * This function can provide an url to an icon for each item of the array provided on `items`.
 * If not set, an icon won't be shown.
 * @property {((d: any, lvl: string) => string) | Array<(d: any, lvl: string) => string>} [getLabel]
 * This function can provide an url to an icon for each item of the array provided on `items`.
 * If not set, the item ID will be used.
 * @property {import("@blueprintjs/core").IconName | import("@blueprintjs/core").MaybeElement} [inputRightIcon]
 * The name of a icon to show on the right side of the input.
 * @property {string} [placeholder]
 * Renders some faded text in the input field if the selection is empty.
 * @property {(event: React.MouseEvent<HTMLButtonElement>) => void} [onClear]
 * This function will be called when the used presses the cross button next to the selected item tags in the target.
 * @property {(item: SelectedItem, event?: React.SyntheticEvent<HTMLElement>) => void} onItemSelect
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
  getColor,
  getIcon,
  getLabel,
  inputRightIcon,
  isPro,
  isProProps,
  itemListPredicate,
  itemRenderer,
  items,
  levels,
  onClear,
  onItemRemove,
  onItemSelect,
  placeholder,
  selectedItems
}) => {
  const [paywall, setPaywall] = useState(false);

  const memoLevels = useMemo(() => levels, levels);

  const extendedItems = useMemo(
    () => extendItems(items, levels, {getColor, getIcon, getLabel}),
    [memoLevels, items]
  );

  /** @type {import("@blueprintjs/select").ItemListRenderer<SelectedItem>} */
  const itemListRenderer = useCallback(
    itemListProps => {
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
    },
    [memoLevels]
  );

  return (
    <PatchedSelect
      // filterable={true}
      itemListPredicate={itemListPredicate}
      itemListRenderer={itemListRenderer}
      itemRenderer={itemRenderer}
      items={extendedItems}
      // inputProps={{inputRef}}
      onItemSelect={onItemSelect}
      popoverProps={{
        // boundary: "viewport",
        captureDismiss: true,
        fill: true,
        minimal: true,
        // onInteraction: popoverInteractionHandler,
        popoverClassName: "selector sh-hie--popover"
      }}
    >
      <div
        className={classNames(
          Classes.INPUT,
          Classes.TAG_INPUT,
          Classes.FILL,
          SelectClasses.MULTISELECT
        )}
      >
        <div className={Classes.TAG_INPUT_VALUES} onClick={() => setPaywall(true)}>
          {selectedItems.length === 0 && placeholder &&
            <span className="sh-hie--placeholder">{placeholder}</span>
          }
          {selectedItems.map(item =>
            <Tag
              icon={item.icon
                ? <img
                  alt={`[Icon for ${item.type} "${item.name}"]`}
                  className="sh-hie--hs-icon"
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
        <Icon icon={inputRightIcon} />
        {onClear && selectedItems.length > 0 &&
          <Button icon="cross" minimal={true} onClick={onClear} />
        }
        {isPro && paywall && <OECPaywall
          {...isProProps}
          paywall={paywall}
          callback={(paywall) => setPaywall(paywall)}
        />}
      </div>
    </PatchedSelect>
  );
};

/** @type {(query: string) => RegExp} */
const forgeQuery = query => {
  if (!query) return /./i;
  const querySource = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "[^|]+");
  return RegExp(querySource, "i");
};

SelectMultiHierarchy.defaultProps = {
  itemListPredicate(query, items) {
    const queryTester = forgeQuery(query);
    const matchIndex = items.reduce((matches, item) =>
      matches +
      (queryTester.test(`${item.id} ${item.name}`)
        ? `^${item.searchIndex}`
        : ""),
    "");
    return items.filter(item => matchIndex.includes(`^${item.searchIndex}`));
  },

  itemRenderer(item, {handleClick, modifiers}) {
    return (
      <a
        className={classNames({
          "sh-hie--option": true,
          [Classes.ACTIVE]: modifiers.active,
          [Classes.DISABLED]: modifiers.disabled,
          [Classes.FILL]: true,
          [Classes.INTENT_PRIMARY]: modifiers.active,
          [Classes.MENU_ITEM]: true
        })}
        key={item.id}
        onClick={handleClick}
      >
        {item.icon != null &&
          <ReactImageFallback
            src={item.icon}
            fallbackImage="/images/transparent.png"
            // initialImage="loader.gif"
            alt={`[Icon for ${item.type} "${item.name}"]`}
            className="sh-hie--hs-icon"
            style={{backgroundColor: item.color}}
          />
        }
        <Text className={Classes.FILL} ellipsize={true}>
          {item.name}
        </Text>
        <span className={Classes.MENU_ITEM_LABEL}>{item.label || item.id}</span>
      </a>
    );
  }
};

const noStr = () => "";

/**
 * This function converts a list of elements of the same level of hierarchy,
 * with parent information, into a list of `SelectedItem`, ready to be used by
 * the SelectMultiHierarchy component.
 * The code is written under the assumption the IDs are available under the
 * `Key ID` format, and the list of `items` is already sorted by these IDs.
 * This sorting is what determines the resulting list of items, so be careful
 * if any modification makes changes to it.
 *
 * @param {any[]} items
 * @param {string[]} levels
 * @param {Pick<OwnProps, "getColor" | "getIcon" | "getLabel">} param2
 * @returns {SelectedItem[]}
 */
export function extendItems(
  items,
  levels,
  {getColor = noStr, getIcon = noStr, getLabel = noStr}
) {
  const keys = levels.slice();
  const lastKey = `${keys.pop()}`;

  const extendedItemKeys = new Set();
  const extendedItems = [];

  const headerKeys = [];
  const nestedItems = nest().rollup(values => {
    const firstItem = values[0];

    /** @type {(item: false | SelectedItem) => item is SelectedItem} */
    const uniqueItemGuard = item => item && !extendedItemKeys.has(item.id);

    const keyIds = keys.map(key => firstItem[`${key} ID`]);
    const keyNames = keys.map(key => firstItem[key]);
    const keyItems = keys
      .map((key, i) => {
        if (headerKeys[i] !== keyNames[i]) {
          headerKeys[i] = keyNames[i];
          const colorGetter = getColor[i] || getColor[getColor.length - 1] || getColor;
          const iconGetter = getIcon[i] || getIcon[getIcon.length - 1] || getIcon;
          const labelGetter = getLabel[i] || getLabel[getLabel.length - 1] || getLabel;

          return {
            color: colorGetter(firstItem, key) || undefined,
            icon: iconGetter(firstItem, key) || undefined,
            id: keyIds[i],
            label: labelGetter(firstItem, key) || keyIds[i],
            name: keyNames[i],
            type: key,
            searchIndex: keyNames.slice(0, i + 1).join("|")
          };
        }
        return false;
      })
      .filter(uniqueItemGuard);

    keyItems.forEach(item => extendedItemKeys.add(item.id));

    const colorGetter = getColor[getColor.length - 1] || getColor;
    const iconGetter = getIcon[getIcon.length - 1] || getIcon;
    const labelGetter = getLabel[getLabel.length - 1] || getLabel;
    const valueItems = values.map(item => ({
      color: colorGetter(item, lastKey) || undefined,
      icon: iconGetter(item, lastKey) || undefined,
      id: item[`${lastKey} ID`],
      label: labelGetter(item, lastKey) || item[`${lastKey} ID`],
      name: item[lastKey],
      type: lastKey,
      searchIndex: keyNames.concat(item[lastKey]).join("|")
    }));

    extendedItems.push(...keyItems.concat(valueItems));
  });

  keys.forEach(key => {
    nestedItems.key(d => `${d[`${key} ID`]}|${d[key]}`);
  });

  nestedItems.entries(items);
  return extendedItems;
}

export default SelectMultiHierarchy;
