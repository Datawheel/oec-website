// @ts-check
import {Button, ButtonGroup, Classes, Menu, Text} from "@blueprintjs/core";
import classNames from "classnames";
import React, {Fragment, useMemo, useRef, useState} from "react";
import List from "react-viewport-list";

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

  const finalList = useMemo(() => {
    if (showAll) return items;
    const level = ["Section", "HS2", "HS4"][stackIndex];
    return stack.reduce(
      (list, token) => list.filter(item => token.startsWith("All") || item.searchIndex.indexOf(token) > -1),
      items.filter(item => item.type === level)
    );
  }, [items, showAll, stackIndex]);

  const headerTokens = stack.map((token, index) =>
    <Text
      className={`sm-section--hielist-htoken level-${index}`}
      ellipsize={true}
      key={`${index}-${token}`}
    >
      {token}
    </Text>
  );

  const activeIndex = finalList.indexOf(activeItem) || 1;

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
        <Button
          active={!showAll && stackIndex === 0}
          onClick={() => {
            showAll && setShowAll(false);
            setStack([]);
          }}
          text="Section"
        />
        <Button
          active={!showAll && stackIndex === 1}
          onClick={() => {
            showAll && setShowAll(false);
            setStack([stack[0] || "All HS2"]);
          }}
          text="HS2"
        />
        <Button
          active={!showAll && stackIndex === 2}
          onClick={() => {
            showAll && setShowAll(false);
            setStack([stack[0] || "All HS2", stack[1] || "All HS4"]);
          }}
          text="HS4"
        />
      </ButtonGroup>
      {stackIndex > 0 &&
        <div className="sm-section--hielist-header">
          <Button icon="arrow-left" onClick={popCategory} minimal={true} />
          <div className="sm-section--hielist-htokens">{headerTokens}</div>
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
                {!showAll && item.type !== "HS4" &&
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
