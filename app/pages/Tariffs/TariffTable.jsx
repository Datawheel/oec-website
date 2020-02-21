import React from "react";
import ReactTable from "react-table";
import {get} from "lodash";

const getColumnWidth = (data, accessor, headerText) => {
  const cellLength = Math.max(
    ...data.map(row => {
      let value = "";

      if (typeof accessor === "string") {
        value = get(row, accessor);
      }
      else {
        value = accessor(row);
      }

      if (typeof value === "number") return value.toString().length;
      return (value || "").length;
    }),
    headerText.length
  );

  const magicSpacing = 12;
  return cellLength * magicSpacing;
};

class TariffTable extends React.Component {
  state = {
    changepointPriorScale: 0.05,
    changepointRange: 0.80,
    seasonalityMode: "multiplicative"
  };

  // could also use this to format numbers:
  // new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(props.value)

  render() {
    const {data, loading} = this.props;
    const columns = [{
      id: "drilldown", // Required because our accessor is not a string
      Header: "Year",
      accessor: d => d.Year
    }, {
      id: "Country",
      Header: "Country",
      accessor: d => d.Country
    }, {
      id: "Product Depth",
      Header: "Product",
      Cell: props => {
        if (props.original.HS4) return <div>HS4</div>;
        if (props.original.HS2) return <div>HS2</div>;
        if (props.original.Section) return <div>Section</div>;
      }
    }, {
      id: "Product ID",
      Header: "Product ID",
      Cell: props => {
        if (props.original.HS4) return <div>{props.original["HS4 ID"]}</div>;
        if (props.original.HS2) return <div>{props.original["HS2 ID"]}</div>;
        if (props.original.Section) return <div>{props.original["Section ID"]}</div>;
      }
    }, {
      id: "Product",
      Header: "Product",
      Cell: props => {
        if (props.original.HS4) return <div>{props.original.HS4}</div>;
        if (props.original.HS2) return <div>{props.original.HS2}</div>;
        if (props.original.Section) return <div>{props.original.Section}</div>;
      }
    }, {
      id: "Tariff",
      Header: "Tariff",
      accessor: d => d.Measure
    }, {
      id: "Tariff Value",
      Header: "Tariff Value",
      accessor: "Ad Valorem",
      Cell: props => <div className="number">{props.value}</div>
    }];
    // const columns = [{
    //   id: "drilldown", // Required because our accessor is not a string
    //   Header: "Name",
    //   accessor: d => d.Drilldown.name
    // }, {
    //   Header: "Date",
    //   accessor: "ds",
    //   width: getColumnWidth(data, "ds", "Date")
    // }, {
    //   Header: "Observed Value",
    //   accessor: "y_orig",
    //   Cell: props => <div className="number">{currencyFormat(props.value)}</div>,
    //   width: getColumnWidth(data, "y_orig", "Observed Value")
    // }, {
    //   Header: "Predicted Value",
    //   accessor: "yhat",
    //   Cell: props => <div className="number">{currencyFormat(props.value)}</div>,
    //   width: getColumnWidth(data, "yhat", "Predicted Value")
    // }, {
    //   Header: "Predicted Value (lower)",
    //   accessor: "yhat_lower",
    //   Cell: props => <div className="number">{currencyFormat(props.value)}</div>,
    //   width: getColumnWidth(data, "yhat_lower", "Predicted Value (lower)")
    // }, {
    //   Header: "Predicted Value (upper)",
    //   accessor: "yhat_upper",
    //   Cell: props => <div className="number">{currencyFormat(props.value)}</div>,
    //   width: getColumnWidth(data, "yhat_Upper", "Predicted Value (upper)")
    // }];

    return <div className="prediction-table">
      <ReactTable
        data={data}
        className="-striped -highlight"
        columns={columns}
        loading={loading}
        minRows={0}
      />
    </div>;
  }
}

export default TariffTable;
