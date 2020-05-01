// @ts-check
import {Button, ButtonGroup, Classes, Menu, Text} from "@blueprintjs/core";
import classNames from "classnames";
import React, {Fragment, useMemo, useRef, useState} from "react";
import List from "react-viewport-list";

/**
 * @typedef OwnProps
 * @property {string[]} levels
 */

/** @type {React.FC<import("@blueprintjs/select").IItemListRendererProps<import("./SelectMultiHierarchy").SelectedItem> & OwnProps>} */
const SMHNaviList = ({activeItem, items, levels, renderItem}) => {
  const viewPortRef = useRef(null);

  const [showAll, setShowAll] = useState(false);

  const [stack, setStack] = useState([""].slice(1));
  const stackIndex = stack.length;

  const pushCategory = parent => {
    const nextStack = stack.concat(parent);
    showAll && setShowAll(false);
    setStack(nextStack);
  };

  const popCategory = () => {
    const nextStack = stack.slice(0, stackIndex - 1);
    showAll && setShowAll(false);
    setStack(nextStack);
  };

  const currentLevel = levels[stackIndex];
  const finalList = useMemo(() => {
    if (showAll) return items;
    return stack.reduce(
      (list, token) => list.filter(item => !token || item.searchIndex.indexOf(token) > -1),
      items.filter(item => item.type === currentLevel)
    );
  }, [items, showAll, stackIndex]);

  const headerTokens = stack.filter(Boolean);
  if (stack.length > 0 && headerTokens.length === 0) {
    headerTokens.push(`All ${currentLevel}`);
  }

  const activeIndex = finalList.indexOf(activeItem);

  return (
    <Fragment>
      <ButtonGroup className="sh-hie--level" fill={true} minimal={true}>
        <Button
          active={showAll}
          onClick={() => {
            setShowAll(true);
            setStack([]);
          }}
          text="All"
        />
        {levels.map((level, index) =>
          <Button
            active={!showAll && stackIndex === index}
            key={`${index}-${level}`}
            onClick={() => {
              showAll && setShowAll(false);
              const nextStack = [""].slice(1);
              let n = index;
              while (n--) {
                nextStack[n] = stack[n] || "";
              }
              setStack(nextStack);
            }}
            text={level}
          />
        )}
      </ButtonGroup>
      {stackIndex > 0 &&
        <div className="sh-hie--hielist-header">
          <Button icon="arrow-left" onClick={popCategory} minimal={true} />
          <div className="sh-hie--hielist-htokens">
            {headerTokens.map((token, index) =>
              <Text
                className={`sh-hie--hielist-htoken level-${index}`}
                ellipsize={true}
                key={`${index}-${token}`}
              >
                {token}
              </Text>
            )}
          </div>
        </div>
      }
      <Menu
        className={classNames({
          "sh-hie--hielist-content": true,
          "sh-hie--show-all": showAll
        })}
        ulRef={viewPortRef}
      >
        <List
          itemMinHeight={30}
          listLength={finalList.length}
          overscan={200}
          scrollToIndex={activeIndex}
          viewPortRef={viewPortRef}
        >
          {({innerRef, index, style}) => {
            const item = finalList[index];
            return (
              <li
                className={`sh-hie--list-item sh-hie--level-${levels.indexOf(item.type)}`}
                key={item.id}
                ref={innerRef}
                style={style}
              >
                {renderItem(item, index)}
                {!showAll && item.type !== levels[levels.length - 1] &&
                  <button
                    className={classNames(
                      "sh-hie--descendants",
                      Classes.MENU_ITEM,
                      Classes.iconClass("caret-right")
                    )}
                    onClick={() => pushCategory(item.name)}
                    type="button"
                  ></button>
                }
              </li>
            );
          }}
        </List>
      </Menu>
    </Fragment>
  );
};

export default SMHNaviList;
