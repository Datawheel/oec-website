import axios from "axios";
import React, {useEffect, useState} from "react";
import SelectMultiSection from "../../components/SelectMultiSection";

const SECTION_DATA_URL =
  "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_baci_a_92&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false";

/** @type {React.FC<import("react-router").RouteComponentProps>} */
const TestArea = () => {
  // selectedItems is an empty array at start
  // it will be filled with objects with this shape:
  // interface SelectedItem {
  //   name: string;
  //   id: number;
  //   type: "Section" | "HS2" | "HS4";
  //   color: string;
  //   icon: string;
  // }
  const [selectedItems, setSelectedItems] = useState([]);

  // here I'm storing the values obtained from the ajax request
  const [sectionData, setSectionData] = useState([]);
  useEffect(() => {
    axios.get(SECTION_DATA_URL).then(resp => {
      setSectionData(resp.data.data);
    });
  }, []);

  return (
    <div className="test-area">
      <SelectMultiSection
        items={sectionData}
        onItemSelect={item => {
          // item: SelectedItem
          const nextItems = selectedItems.concat(item);
          setSelectedItems(nextItems);
        }}
        onItemRemove={(evt, item) => {
          // evt: MouseEvent<HTMLButtonElement>
          // item: SelectedItem
          evt.stopPropagation();
          const nextItems = selectedItems.filter(i => i !== item);
          setSelectedItems(nextItems);
        }}
        onClear={() => {
          setSelectedItems([]);
        }}
        selectedItems={selectedItems}
      />
    </div>
  );
};

export default TestArea;
