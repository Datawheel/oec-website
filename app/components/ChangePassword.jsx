import React, {Component} from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "./ChangePassword.css";

import {Icon, Intent} from "@blueprintjs/core";

class ChangePassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      password: "",
      password1: "",
      password2: ""
    };
  }

  handleChange(e) {
    const {name, value} = e.target;
    this.setState({[name]: value});
  }

  notify(message, intent) {
    const toast = this.context.toast.current;
    toast.show({message, intent});
  }

  save() {
    const {password, password1, password2} = this.state;

    if (password1 !== password2) {
      this.notify("Passwords must match", Intent.DANGER);
      return;
    }

    const payload = {
      oldPassword: password,
      newPassword: password1
    };

    axios.post("/auth/password/change", payload)
      .then(resp => resp.data)
      .then(resp => {
        if (resp.error) {
          this.notify(resp.error, Intent.DANGER);
        }
        else {
          this.notify(resp.msg, Intent.SUCCESS);
          this.setState({password: "", password1: "", password2: ""});
        }
      })
      .catch(() => {
        this.notify("Error changing password, please try again later.", Intent.WARNING);
      });

  }

  render() {
    const {password, password1, password2} = this.state;

    return (
      <div className="reset-password">

        <h3><Icon icon="lock" iconSize={16} />Change Password</h3>

        <form>
          <input
            placeholder="Current Password"
            autoComplete="off"
            name="password"
            value={password}
            onChange={this.handleChange.bind(this)}
            id="pw-original"
            className="bp3-input bp3-fill"
            type="password"
            dir="auto" />

          <hr />

          <input
            placeholder="New Password"
            autoComplete="off"
            name="password1"
            value={password1}
            onChange={this.handleChange.bind(this)}
            id="pw-new1"
            className="bp3-input bp3-fill"
            type="password"
            dir="auto" />

          <input
            placeholder="Repeat New Password"
            autoComplete="off"
            name="password2"
            value={password2}
            onChange={this.handleChange.bind(this)}
            id="pw-new2"
            className="bp3-input bp3-fill"
            type="password"
            dir="auto" />

        </form>

        <button type="button" className="bp3-fill bp3-button bp3-intent-danger" onClick={this.save.bind(this)}>
          Submit
        </button>

      </div>
    );
  }

}

ChangePassword.contextTypes = {
  toast: PropTypes.object
};

export default ChangePassword;
