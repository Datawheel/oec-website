import React from "react";
import {Button, ButtonGroup, Slider} from "@blueprintjs/core";

class AdvParamPanel extends React.Component {
  state = {
    changepointPriorScale: 0.05,
    changepointRange: 0.80,
    seasonalityMode: "multiplicative"
  };

  changeSeasonalityMode = newSeasonalityMode => _e => {
    this.setState({seasonalityMode: newSeasonalityMode});
    // update props
    this.props.updateAdvParams({
      changepointPriorScale: this.state.changepointPriorScale,
      changepointRange: this.state.changepointRange,
      seasonalityMode: newSeasonalityMode
    });
  };
  changeChangepointPriorScale = newChangepointPriorScale => {
    this.setState({changepointPriorScale: newChangepointPriorScale});
    // update props
    this.props.updateAdvParams({
      changepointPriorScale: newChangepointPriorScale,
      changepointRange: this.state.changepointRange,
      seasonalityMode: this.state.seasonalityMode
    });
  };
  changeChangepointRange = newChangepointRange => {
    this.setState({changepointRange: newChangepointRange});
    // update props
    this.props.updateAdvParams({
      changepointPriorScale: this.state.changepointPriorScale,
      changepointRange: newChangepointRange,
      seasonalityMode: this.state.seasonalityMode
    });
  };

  render() {
    return <div className="prediction-controls advanced-params">

      <div className="prediction-control">
        <h3>Seasonality Mode</h3>
        <ButtonGroup fill={true} style={{marginTop: 5}}>
          <Button active={this.state.seasonalityMode === "additive"} text="Additive" onClick={this.changeSeasonalityMode("additive")} />
          <Button active={this.state.seasonalityMode === "multiplicative"} text="Multiplicative" onClick={this.changeSeasonalityMode("multiplicative")} />
        </ButtonGroup>
      </div>

      <div className="prediction-control slider-control">
        <h3>Changepoint Prior Scale</h3>
        <Slider
          onChange={this.changeChangepointPriorScale}
          className="changepoint-prior-scale"
          leftIconName="bp3-icon-derive-column"
          stepSize={0.001}
          labelStepSize={0.025}
          value={this.state.changepointPriorScale}
          min={0.001}
          max={0.2}
        />
      </div>

      <div className="prediction-control slider-control">
        <h3>Changepoint Range</h3>
        <Slider
          onChange={this.changeChangepointRange}
          className="changepoint-range"
          leftIconName="bp3-icon-derive-column"
          stepSize={0.01}
          labelStepSize={0.1}
          labelRenderer={val => `${Math.round(val * 100)}%`}
          value={this.state.changepointRange}
          min={0.2}
          max={1}
        />
      </div>

    </div>;
  }
}

export default AdvParamPanel;
