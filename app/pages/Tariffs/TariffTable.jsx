import React from "react";
import ReactTable from "react-table";
import {get} from "lodash";
import {format} from "d3-format";

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
      // width: getColumnWidth(data, "Year", "Year")
    }, {
      id: "Reporter Country",
      Header: "Reporter Country",
      accessor: d => d["Reporter Country"]
      // width: getColumnWidth(data, "Reporter Country", "Reporter Country")
    }, {
      id: "Product Depth",
      Header: "Product Depth",
      Cell: props => {
        if (props.original.HS6) return <div>HS6</div>;
        if (props.original.HS4) return <div>HS4</div>;
        if (props.original.HS2) return <div>HS2</div>;
        if (props.original.Section) return <div>Section</div>;
      }
    }, {
      id: "Product ID",
      Header: "Product ID",
      Cell: props => {
        if (props.original.HS6) return <div>{`${props.original["HS6 ID"]}`.length === 7 ? `${props.original["HS6 ID"]}`.slice(1) : `${props.original["HS6 ID"]}`.slice(2)}</div>;
        if (props.original.HS4) return <div>{`${props.original["HS4 ID"]}`.length === 5 ? `${props.original["HS4 ID"]}`.slice(1) : `${props.original["HS4 ID"]}`.slice(2)}</div>;
        if (props.original.HS2) return <div>{`${props.original["HS2 ID"]}`.length === 3 ? `${props.original["HS2 ID"]}`.slice(1) : `${props.original["HS2 ID"]}`.slice(2)}</div>;
        if (props.original.Section) return <div>{props.original["Section ID"]}</div>;
      }
    }, {
      id: "Product",
      Header: "Product",
      Cell: props => {
        if (props.original.HS6) return <div>{props.original.HS6}</div>;
        if (props.original.HS4) return <div>{props.original.HS4}</div>;
        if (props.original.HS2) return <div>{props.original.HS2}</div>;
        if (props.original.Section) return <div>{props.original.Section}</div>;
      }
    }, {
      id: "Tariff",
      Header: "Tariff",
      accessor: d => d.Measure
      // width: getColumnWidth(data, "Measure", "Tariff")
    }, {
      id: "Tariff Value",
      Header: "Tariff Value",
      accessor: "Ad Valorem",
      Cell: props => <div className="number">{format(".2f")(props.value)}</div>
      // width: getColumnWidth(data, "Ad Valorem", "Tariff Value")
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
