import React from "react";
import {Button, Intent, MenuItem, Position, Toaster} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";
import moment from "moment";

const PredictionToaster = typeof window !== "undefined"
  ? Toaster.create({
    className: "prediction-toaster",
    position: Position.TOP,
    icon: "warning-sign",
    maxToasts: 1,
    intent: Intent.WARNING
  })
  : null;

class PredictionDateSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: props.timeAvailable[0],
      endTime: props.timeAvailable[props.timeAvailable.length - 1]
    };
    this.startTimeAvailable = props.timeAvailable;
    this.endTimeAvailable = [...props.timeAvailable].reverse();
  }

  isItemSelected = (startOrEndTime, item) => {
    const timeSelection = {startTime: this.props.timeSelection[0], endTime: this.props.timeSelection[1]};
    return item === timeSelection[startOrEndTime];
  };

  renderItem = startOrEndTime => (item, {modifiers, handleClick}) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={modifiers.active}
        icon={this.isItemSelected(startOrEndTime, item) ? "tick" : "blank"}
        key={`${item}`}
        onClick={handleClick}
        text={`${item}`.length > 4 ? moment(`${item}`, "YYYYMM").format("MMM YYYY") : item}
        shouldDismissPopover={false}
      />
    );
  };

  validateSelection = startOrEnd => time => {
    const {timeAvailable, timeSelection, updateTimeSelection} = this.props;
    let [startTime, endTime] = timeSelection;
    if (startOrEnd === "start") {
      startTime = time;
    }
    else if (startOrEnd === "end") {
      endTime = time;
    }
    const startIndex = timeAvailable.indexOf(startTime);
    const endIndex = timeAvailable.indexOf(endTime);
    if (startIndex >= endIndex && startOrEnd === "start") {
      PredictionToaster.show({message: "Cannot set starting date later than ending date."});
      return;
    }
    if (endIndex <= startIndex) {
      PredictionToaster.show({message: "Cannot set ending date earlier than starting date."});
      return;
    }
    updateTimeSelection([startTime, endTime]);
  }

  render() {
    const {timeSelection} = this.props;

    return <div className="prediction-control">
      <h3>Date Range</h3>
      <div className="prediction-date-selections">
        <Select
          items={this.startTimeAvailable}
          filterable={false}
          itemRenderer={this.renderItem("startTime")}
          noResults={<MenuItem disabled={true} text="No results." />}
          onItemSelect={this.validateSelection("start")}
          popoverProps={{minimal: true}}
          value={timeSelection[0]}
        >
          <Button
            rightIcon="caret-down"
            text={`${timeSelection[0]}`.length > 4 ? moment(`${timeSelection[0]}`, "YYYYMM").format("MMM YYYY") : timeSelection[0]}
          />
        </Select>
        <Select
          items={this.endTimeAvailable}
          filterable={false}
          itemRenderer={this.renderItem("endTime")}
          noResults={<MenuItem disabled={true} text="No results." />}
          onItemSelect={this.validateSelection("end")}
          popoverProps={{minimal: true}}
          value={timeSelection[1]}
        >
          <Button
            rightIcon="caret-down"
            text={`${timeSelection[1]}`.length > 4 ? moment(`${timeSelection[1]}`, "YYYYMM").format("MMM YYYY") : timeSelection[1]}
          />
        </Select>
      </div>
    </div>;
  }
}

export default PredictionDateSelect;
