import React from "react";
import ReactTable from "react-table";
import {formatAbbreviate} from "d3plus-format";
import {get} from "lodash";
import moment from "moment";
import GrowthNumber from "components/GrowthNumber";

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

class PredictionTable extends React.Component {
  state = {
    changepointPriorScale: 0.05,
    changepointRange: 0.80,
    seasonalityMode: "multiplicative"
  };

  // could also use this to format numbers:
  // new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(props.value)

  render() {
    const {data, dateDrilldown, currencyFormat} = this.props;

    const columns = [{
      id: "drilldown", // Required because our accessor is not a string
      Header: "Name",
      accessor: d => d.Drilldown.name
    }, {
      Header: () => dateDrilldown === "Year" ? "Year" : "Month",
      accessor: "ds",
      Cell: props => <div>
        {dateDrilldown === "Year"
          ? moment(props.value, "YYYY-MM-DD").format("YYYY")
          : moment(props.value, "YYYY-MM-DD").format("MMMM YYYY")
        }
      </div>
      // width: getColumnWidth(data, "ds", "Date")
    }, {
      Header: "Observed Value",
      accessor: "y_orig",
      Cell: props => props.value ? <div className="number">{currencyFormat(props.value)}</div> : null
      // width: getColumnWidth(data, "y_orig", "Observed Value")
    }, {
      Header: "Predicted Value",
      accessor: "yhat",
      Cell: props => <div className="number">{currencyFormat(props.value)}</div>
      // width: getColumnWidth(data, "yhat", "Predicted Value")
    }, {
      Header: "Predicted Value (change)",
      accessor: "abs_change",
      // Cell: props => props.value ? <div className="number">{currencyFormat(props.value)}</div> : null
      Cell: props => props.value ? <div className="number"><GrowthNumber number={props.value} formatter={currencyFormat} /></div> : null
      // width: getColumnWidth(data, "abs_change", "Difference")
    }, {
      Header: "Predicted Value (% Change)",
      accessor: "pct_change",
      Cell: props => props.value ? <div className="number"><GrowthNumber number={props.value * 100} formatter={n => `${formatAbbreviate(n)}%`} /></div> : null
      // width: getColumnWidth(data, "pct_change", "% Change")
    }, {
      Header: "CAGR",
      accessor: "cagr",
      Cell: props => props.value ? <div className="number"><GrowthNumber number={props.value * 100} formatter={n => `${formatAbbreviate(n)}%`} /></div> : null
      // width: getColumnWidth(data, "pct_change", "% Change")
    }, {
      Header: "Predicted Value (lower)",
      accessor: "yhat_lower",
      Cell: props => <div className="number">{currencyFormat(props.value)}</div>
      // width: getColumnWidth(data, "yhat_lower", "Predicted Value (lower)")
    }, {
      Header: "Predicted Value (upper)",
      accessor: "yhat_upper",
      Cell: props => <div className="number">{currencyFormat(props.value)}</div>
      // width: getColumnWidth(data, "yhat_Upper", "Predicted Value (upper)")
    }];

    return <div className="prediction-table">
      <ReactTable
        data={data}
        className="-striped -highlight"
        columns={columns}
        minRows={1}
      />
    </div>;
  }
}

export default PredictionTable;
