import React from "react";
import Button from "@datawheel/canon-cms/src/components/fields/Button.jsx";
import {Spinner} from "@blueprintjs/core";

import "./OECButtonGroup.css";

export default class OECButtonGroup extends React.Component {
  render() {
    const {items, loading, selected, title} = this.props;
    if (loading) return <Spinner size={30} />;
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
  loading: false,
  title: undefined
};
