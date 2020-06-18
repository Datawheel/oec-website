import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {isAuthenticated} from "@datawheel/canon-core";
import {fetchData} from "@datawheel/canon-core";
import "./App.css";

class App extends Component {

  render() {
    return <Fragment>
      {/* <script key="stripe" src="https://js.stripe.com/v3/"></script> */}
      <Fragment key="children">{this.props.children}</Fragment>
    </Fragment>;
  }
}

App.need = [
  fetchData("cubesMetadata", "/api/matrix")
];

const mapStateToProps = state => ({
  auth: state.auth,
  cubesMetadata: state.data.cubesMetadata
});

const mapDispatchToProps = dispatch => ({
  isAuthenticated: () => {
    dispatch(isAuthenticated());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
