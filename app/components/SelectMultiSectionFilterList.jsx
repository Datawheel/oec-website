// @ts-check
import {Button, ButtonGroup, Menu} from "@blueprintjs/core";
import React, {Fragment, useRef, useState} from "react";
import List from "react-viewport-list";

/** @type {React.FC<import("@blueprintjs/select").IItemListRendererProps<import("./SelectMultiSection").SelectedItem>>} */
const FilterList = ({activeItem, filteredItems, renderItem}) => {
  const viewPortRef = useRef(null);

  const [typeFilter, setTypeFilter] = useState(undefined);
  const toggleTypeFilter = value => () => setTypeFilter(typeFilter === value ? undefined : value);

  const finalList = typeFilter
    ? filteredItems.filter(item => item.type === typeFilter)
    : filteredItems;
  const activeIndex = finalList.indexOf(activeItem) || 1;

  return (
    <Fragment>
      <ButtonGroup className="sm-section--level" fill={true} minimal={true}>
        <Button
          active={typeFilter === "Section"}
          onClick={toggleTypeFilter("Section")}
          text="Section"
        />
        <Button
          active={typeFilter === "HS2"}
          onClick={toggleTypeFilter("HS2")}
          text="HS2"
        />
        <Button
          active={typeFilter === "HS4"}
          onClick={toggleTypeFilter("HS4")}
          text="HS4"
        />
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
                className={`sm-section--list-item sm-section--type-${item.type}`}
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

export default FilterList;
