import axios from "axios";
import React, {useEffect, useState} from "react";
import SelectMultiSection from "./SelectMultiSection";

const SECTION_DATA_URL =
  "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_baci_a_92&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false";

/** @type {React.FC<import("react-router").RouteComponentProps>} */
const TestArea = props => {
  console.log("render TestArea", props.routerParams);

  const [sectionData, setSectionData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const saveSelectedItem = item => setSelectedItems(selectedItems.concat(item));

  useEffect(() => {
    axios.get(SECTION_DATA_URL).then(resp => {
      setSectionData(resp.data.data);
    });
  }, []);

  return (
    <div className="test-area">
      <SelectMultiSection
        items={sectionData}
        onItemSelect={saveSelectedItem}
        selectedItems={selectedItems}
      />
    </div>
  );
};

export default TestArea;
