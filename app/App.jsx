import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {isAuthenticated} from "@datawheel/canon-core";
import "./App.css";

class App extends Component {
  componentWillMount() {
    this.props.isAuthenticated();
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
