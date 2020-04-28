import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {isAuthenticated} from "@datawheel/canon-core";
import "./App.css";
import {geoConicConformalSpain} from "d3-composite-projections";

class App extends Component {
  componentWillMount() {
    this.props.isAuthenticated();
    if (typeof window !== "undefined") window.geoConicConformalSpain = geoConicConformalSpain;
  }
  render() {
    return <Fragment>
      <script key="stripe" src="https://js.stripe.com/v3/"></script>
      <Fragment key="children">{this.props.children}</Fragment>
    </Fragment>;
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  isAuthenticated: () => {
    dispatch(isAuthenticated());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
