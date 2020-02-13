// @ts-check
import {Button, ButtonGroup, Classes, Menu, Text} from "@blueprintjs/core";
import classNames from "classnames";
import React, {Fragment, useMemo, useRef, useState} from "react";
import List from "react-viewport-list";

const levels = ["Section", "HS2", "HS4"];

/** @type {React.FC<import("@blueprintjs/select").IItemListRendererProps<import("./SelectMultiSection").SelectedItem>>} */
const HierarchyList = ({activeItem, renderItem, items}) => {
  const viewPortRef = useRef(null);

  const [showAll, setShowAll] = useState(false);

  /** @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]} */
  const [stack, setStack] = useState([]);
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
      (list, token) => list.filter(item =>
        !token || token.startsWith("All") || item.searchIndex.indexOf(token) > -1
      ),
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
      <ButtonGroup className="sm-section--level" fill={true} minimal={true}>
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
              const nextStack = [];
              let n = index;
              while (n--) {
                nextStack[n] = stack[n] || null;
              }
              setStack(nextStack);
            }}
            text={level}
          />
        )}
      </ButtonGroup>
      {stackIndex > 0 &&
        <div className="sm-section--hielist-header">
          <Button icon="arrow-left" onClick={popCategory} minimal={true} />
          <div className="sm-section--hielist-htokens">
            {headerTokens.map((token, index) =>
              <Text
                className={`sm-section--hielist-htoken level-${index}`}
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
          "sm-section--hielist-content": true,
          "sm-section--show-all": showAll
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
                className={`sm-section--list-item sm-section--type-${item.type}`}
                key={item.id}
                ref={innerRef}
                style={style}
              >
                {renderItem(item, index)}
                {!showAll && item.type !== levels[levels.length - 1] &&
                  <button
                    className={classNames(
                      "sm-section--descendants",
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

export default HierarchyList;
