import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import {connect} from "react-redux";
import Loading from "components/Loading";
import {Helmet} from "react-helmet";

import axios from "axios";
import {Explorer as TesseractExplorer} from "@datawheel/tesseract-explorer";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "@blueprintjs/table/lib/css/table.css";
import "@datawheel/tesseract-explorer/dist/explorer.css";

import "./Explorer.css";

class Explorer extends Component {

  constructor(props) {
    super(props);
    this.state = {token: false};
  }

  componentDidMount() {
    const {user} = this.props.auth;
    if (user) this.fetchToken.bind(this)();
  }

  componentDidUpdate(prevProps) {
    const {loading, user} = this.props.auth;
    if (prevProps.auth.loading !== loading) {
      const {locale, router} = this.props;
      if (!user) router.push(`/${locale}/login?redirect=/explorer`);
      else if (user.role < 10) router.push("/");
      else this.fetchToken.bind(this)();
    }
  }

  fetchToken() {
    axios.get("/auth/token")
      .then(resp => this.setState({token: resp.data}));
  }

  render() {
    const {token} = this.state;
    return <div className="explorer">
      <Helmet title="Data Explorer" />
      {token ? <TesseractExplorer src={token} title="OEC Explorer" /> : <Loading />}
    </div>;
  }

}

export default connect(state => ({
  auth: state.auth,
  locale: state.i18n.locale
}))(hot(Explorer));
