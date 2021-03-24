import React, {Component} from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {hot} from "react-hot-loader/root";
import "./APIKey.css";

import {Icon, Intent} from "@blueprintjs/core";

class APIKey extends Component {

  constructor(props) {
    super(props);
    this.state = {
      apikey: ""
    };
  }

  fetchOrGenerateKey() {
    const {user} = this.props.auth;
    if (user.role >= 2 && !user.apikey) {
      this.generateKey(true);
    }
    else {
      this.setState({apikey: this.props.auth.user.apikey});
    }
  }

  componentDidMount() {
    if (this.props.auth.user) this.fetchOrGenerateKey();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.auth.user && this.props.auth.user) this.fetchOrGenerateKey();
  }

  generateKey(silent) {
    axios.get("/auth/keygen/generate").then(resp => {
      if (!resp.data.error) {
        if (!silent) this.notify("Key Successfully Regenerated!", Intent.SUCCESS);
        this.setState({apikey: resp.data.apikey});
      }
      else {
        this.notify("API Key Generation Failed. Please contact support.", Intent.DANGER);
      }
    });
  }

  notify(message, intent) {
    const toast = this.context.toast.current;
    toast.show({message, intent});
  }

  render() {

    const {apikey} = this.state;

    return (
      <div className="api-key">

        <h3><Icon icon="key" iconSize={16} />Your API Key</h3>

        <input
          type="text"
          name="apikey"
          value={apikey}
          className="bp3-input bp3-fill"
          readOnly
        />

        <button type="button" className="bp3-fill bp3-button" onClick={() => this.generateKey.bind(this)()}>
          Regenerate Key
        </button>

      </div>
    );
  }

}

APIKey.contextTypes = {
  toast: PropTypes.object
};

export default connect(state => ({
  auth: state.auth
}))(hot(APIKey));
