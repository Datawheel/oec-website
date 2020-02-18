// @ts-check
import axios from "axios";
import React, {useEffect, useState} from "react";
import SelectMultiHierarchy from "../../components/SelectMultiHierarchy";
import colors from "../../helpers/colors";

const URL_PRODUCTS =
  "https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_baci_a_92&drilldowns=HS4&measures=Trade+Value&parents=true&sparse=false";
const URL_TECHNOLOGY =
  "https://api.oec.world/tesseract/data.jsonrecords?cube=patents_i_uspto_w_cpc&drilldowns=Subclass&measures=Patent+Share&parents=true&sparse=false";

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
  const [selectedProds, setSelectedProds] = useState([]);
  const [selectedTechs, setSelectedTechs] = useState([]);

  // here I'm storing the values obtained from the ajax request
  const [prodsData, setProdsData] = useState([]);
  const [techsData, setTechsData] = useState([]);
  useEffect(() => {
    axios.get(URL_PRODUCTS).then(resp => {
      setProdsData(resp.data.data);
    });
    axios.get(URL_TECHNOLOGY).then(resp => {
      setTechsData(resp.data.data);
    });
  }, []);

  return (
    <div className="test-area">
      <div className="products" style={{margin: "2rem", width: "320px"}}>
        <SelectMultiHierarchy
          levels={["Section", "HS2", "HS4"]}
          items={prodsData}
          selectedItems={selectedProds}
          getColor={d => colors.Section[d["Section ID"]]}
          getIcon={d => `/images/icons/hs/hs_${d["Section ID"]}.png`}
          onItemSelect={item => {
            const nextItems = selectedProds.concat(item);
            setSelectedProds(nextItems);
          }}
          onItemRemove={(evt, item) => {
            evt.stopPropagation();
            const nextItems = selectedProds.filter(i => i !== item);
            setSelectedProds(nextItems);
          }}
          onClear={() => {
            setSelectedProds([]);
          }}
        />
      </div>

      <div className="tech" style={{margin: "2rem", width: "320px"}}>
        <SelectMultiHierarchy
          levels={["Section", "Superclass", "Class", "Subclass"]}
          items={techsData}
          selectedItems={selectedTechs}
          getColor={d => colors["CPC Section"][d["Section ID"]]}
          getIcon={d => `/images/icons/cpc/${d["Section ID"]}.png`}
          onItemSelect={item => {
            const nextItems = selectedTechs.concat(item);
            setSelectedTechs(nextItems);
          }}
          onItemRemove={(evt, item) => {
            evt.stopPropagation();
            const nextItems = selectedTechs.filter(i => i !== item);
            setSelectedTechs(nextItems);
          }}
          onClear={() => {
            setSelectedTechs([]);
          }}
        />
      </div>
    </div>
  );
};

export default TestArea;
