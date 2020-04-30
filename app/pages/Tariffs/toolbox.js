import {productDetail} from "./constants";
import queryString from "query-string";

/**
 * @param {string} string
 * @returns {string}
 */
export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * @template T
 * @param {T | T[] | null | undefined} item
 * @returns {item is T}
 */
function isNotNull(item) {
  return item != null; // eslint-disable-line eqeqeq
}

/**
 * @template T
 * @param {T[]} list
 * @returns {T[]}
 */
export function dedupeArray(list) {
  return Array.from(new Set(list));
}

/**
 * @template T
 * @param {T | T[] | null | undefined} item
 * @param {any[]} target
 * @returns {T[]}
 */
function ensureArray(item, target = []) {
  return target.concat(item).filter(isNotNull);
}

/**
 * @param {string | undefined} locationSearch
 * @returns {Partial<TariffState>}
 */
export function parseSearchParams(locationSearch) {
  const params = locationSearch
    ? queryString.parse(locationSearch, {arrayFormat: "comma"})
    : {};

  /** @type {(id: string) => SelectedItem} */
  const idToSelectedItem = id => ({
    color: "#999",
    icon: "",
    id,
    name: id,
    searchIndex: id,
    type: "Loading"
  });

  return {
    partnerCuts: ensureArray(params.partners).map(idToSelectedItem),
    productCuts: ensureArray(params.products).map(idToSelectedItem),
    productLevel: productDetail[`${params.detail}`],
    reporterCuts: ensureArray(params.reporters).map(idToSelectedItem)
  };
}

/**
 * @param {SelectedItem[]} needles
 * @param {SelectedItem[]} tree
 * @returns {SelectedItem[]}
 */
export const findInDataTree = (needles, tree) =>
  needles
    .map(item => {
      const key = item.id;
      return tree.find(leaf => leaf.id == key); // eslint-disable-line eqeqeq
    })
    .filter(isNotNull);

/**
 * @param {import("i18next").TranslationFunction} t
 * @param {TariffState} state
 * @returns {string}
 */
export function titleComposer(t, state) {
  // Must be reimplemented
  return "";
}

/**
 * @param {SelectedItem[]} list
 * @param {SelectedItem} item
 */
export function addSelectedItem(list, item) {
  const nextItems = list.length > 0 && item.type === list[0].type ? list.slice() : [];
  return nextItems.every(obj => obj.id !== item.id) ? nextItems.concat(item) : nextItems;
}

/**
 * @param {SelectedItem[]} list
 * @param {SelectedItem} item
 */
export function removeSelectedItem(list, item) {
  return list.filter(obj => obj.id !== item.id);
}

/**
 * Gets a record object with lists of all values for each member in the dataset.
 * @template T
 * @template {keyof T} K
 * @param {T[]} dataset
 * @param {K[]} keys
 * @param {Record<K, string[]>} target
 * @returns {Record<K, string[]>}
 */
export function getMembers(dataset, keys, target = {}) {
  return keys.reduce((target, key) => {
    let n = dataset.length;
    const memberSet = new Set();
    while (n--) {
      memberSet.add(dataset[n][key]);
    }
    target[key] = Array.from(memberSet).sort();
    return target;
  }, target);
}
