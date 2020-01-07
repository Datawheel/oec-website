import React from "react";
import {hot} from "react-hot-loader/root";

import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import "./SubnationalMap.css";

class SubnationalMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      country: props.country
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleScroll = () => {

  };

  render() {
    const {country, subnationalLandingData} = this.props;
    console.log(subnationalLandingData);
    return <div className="subnational-map">
      <h2>{country.name}</h2>
    </div>;
  }
}


SubnationalMap.need = [];

export default hot(withNamespaces()(
  connect(state => ({
    subnationalLandingData: state.data.subnationalLandingData,
    locale: state.i18n.locale
  }))(SubnationalMap)
));
