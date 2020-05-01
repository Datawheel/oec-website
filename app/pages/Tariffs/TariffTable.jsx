import React from "react";
import ImageFallback from "react-image-fallback";
import ReactTable from "react-table";
import {getCountryFlag} from "./constants";

/**
 * @typedef OwnProps
 * @property {TariffState["productLevel"]} productLevel
 * @property {TariffState["tariffDatums"]} tariffDatums
 */

/** @type {React.FC<OwnProps>} */
const TariffTable = props => {
  const {productLevel} = props;

  /** @type {import("react-table").Column[]} */
  const columns = [
    {
      id: "drilldown",
      Header: "Year",
      accessor: "Year",
      minWidth: 50
    },
    {
      id: "repCountry",
      Header: "Reporter Country",
      accessor: "Reporter Country",
      Cell: CountryName
    },
    {
      id: "parCountry",
      Header: "Partner Country",
      accessor: "Partner Country",
      Cell: CountryName
    },
    {
      id: "productDepth",
      Header: "Product Depth",
      accessor: () => productLevel,
      minWidth: 110
    },
    {
      id: "productId",
      Header: "Product ID",
      accessor: d =>
        productLevel === "HS6"
          ? `${d["HS6 ID"]}`.substr(-6)
          : productLevel === "HS4"
            ? `${d["HS4 ID"]}`.substr(-4)
            : productLevel === "HS2"
              ? `${d["HS2 ID"]}`.substr(-2)
              : d["Section ID"],
      minWidth: 80
    },
    {
      id: "productLabel",
      Header: "Product",
      accessor: productLevel,
      minWidth: 200
    },
    {
      id: "tariffAgreement",
      Header: "Agreement",
      accessor: "Agreement"
    },
    {
      id: "tariffValue",
      Header: "Tariff Value",

      accessor: d => `${d.Tariff.toFixed(2)} %`
    }
  ];

  return <ReactTable
    data={props.tariffDatums}
    className="-striped -highlight"
    columns={columns}
    minRows={Math.min(props.tariffDatums.length, 10)}
  />;
};

/** @type {import("react-table").TableCellRenderer} */
const CountryName = props => {
  const codeOrigin = props.column.id === "repCountry"
    ? "Reporter Country ID" : "Partner Country ID";
  return (
    <React.Fragment>
      <ImageFallback
        alt={`[Flag of ${props.value}]`}
        className="tariff-country-flag"
        fallbackImage="/images/transparent.png"
        src={getCountryFlag(props.original[codeOrigin])}
      />
      <span className="tariff-country-name">{props.value}</span>
    </React.Fragment>
  );
};

export default TariffTable;
