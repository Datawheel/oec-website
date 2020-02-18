import React from "react";
import Button from "@datawheel/canon-cms/src/components/fields/Button.jsx";

import "./OECButtonGroup.css";

export default class OECButtonGroup extends React.Component {
  render() {
    const {items, selected, title} = this.props;
    console.log(selected, items);
    return <div className="oec-button-group cp-button-group">
      {title && <h6 className="oec-button-group-title">{title}</h6>}
      <div className="oec-button-group-items">{items.map((d, i) => <Button
        key={`oec_button_${i}`}
        className={selected === d ? "cp-button is-active" : "cp-button"}
        minimal={true}
        onClick={() => this.props.callback(d)}
      >{d}</Button>)}</div>
    </div>;
  }
}

OECButtonGroup.defaultProps = {
  items: [],
  title: undefined
};
