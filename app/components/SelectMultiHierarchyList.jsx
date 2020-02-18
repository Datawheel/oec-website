// @ts-check
import {Button, ButtonGroup, Menu} from "@blueprintjs/core";
import React, {Fragment, useRef, useState} from "react";
import List from "react-viewport-list";

/**
 * @typedef OwnProps
 * @property {string[]} levels
 */

/** @type {React.FC<import("@blueprintjs/select").IItemListRendererProps<import("./SelectMultiHierarchy").SelectedItem> & OwnProps>} */
const SMHFullList = ({activeItem, filteredItems, levels, renderItem}) => {
  const viewPortRef = useRef(null);

  const [typeFilter, setTypeFilter] = useState(undefined);
  const toggleTypeFilter = value => () => setTypeFilter(typeFilter === value ? undefined : value);

  const finalList = typeFilter
    ? filteredItems.filter(item => item.type === typeFilter)
    : filteredItems;
  const activeIndex = finalList.indexOf(activeItem);

  return (
    <Fragment>
      <ButtonGroup className="sm-section--level" fill={true} minimal={true}>
        {levels.map(level =>
          <Button
            key={level}
            active={typeFilter === level}
            onClick={toggleTypeFilter(level)}
            text={level}
          />
        )}
      </ButtonGroup>
      <Menu
        className="sm-section--hielist-content sm-section--show-all"
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
                className={`sm-section--list-item sm-section--level-${levels.indexOf(item.type)}`}
                key={item.id}
                ref={innerRef}
                style={style}
              >
                {renderItem(item, index)}
              </li>
            );
          }}
        </List>
      </Menu>
    </Fragment>
  );
};

export default SMHFullList;
