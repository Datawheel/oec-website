import React, {Component} from "react";
import {connect} from "react-redux";
import {isAuthenticated} from "@datawheel/canon-core";
import "./App.css";

class App extends Component {
  componentWillMount() {
    this.props.isAuthenticated();
  }
  render() {
    return this.props.children;
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
