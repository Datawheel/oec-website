import React, {Component} from "react";
import axios from "axios";
import {connect} from "react-redux";
import {Link} from "react-router";
import {hot} from "react-hot-loader/root";
import {timeFormat} from "d3-time-format";
const formatDate = timeFormat("%B %d, %Y");
import "./Account.css";
import {Activate} from "@datawheel/canon-core";
import Button from "@datawheel/canon-cms/src/components/fields/Button.jsx";

import {Dialog, Intent, NonIdealState, Spinner, Tag} from "@blueprintjs/core";

import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";
import ChangePassword from "components/ChangePassword";
import FeatureMatrix from "components/FeatureMatrix";

const roleLookup = {
  0: ["Basic", Intent.NONE],
  1: ["Pro", Intent.SUCCESS],
  10: ["Contributor", Intent.SUCCESS],
  past_due: ["Past Due", Intent.WARNING],
  unpaid: ["Unpaid", Intent.WARNING],
  canceled: ["Canceled", Intent.DANGER]
};

class Role extends Component {
  render() {

    const {role, status} = this.props;

    const [title, intent, icon] = roleLookup[status] || roleLookup[role];

    return <Tag intent={intent} icon={icon}>
      {title || "N/A"}
    </Tag>;
  }
}


class Account extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cancel: false,
      loading: false
    };
  }

  componentDidMount() {
    const {user} = this.props.auth;
    if (user) this.fetchStripeData.bind(this)();
  }

  componentDidUpdate(prevProps) {
    const {loading, user} = this.props.auth;
    if (prevProps.auth.loading !== loading) {
      const {locale, router} = this.props;
      if (!user) router.push(`/${locale}/login?redirect=/${locale}/account`);
      else this.fetchStripeData.bind(this)();
    }
  }

  fetchStripeData() {
    axios.get("/auth/stripe/user")
      .then(resp => resp.data)
      .then(stripe => {
        this.setState({stripe});
      })
      .catch(error => {
        console.error(error);
      });
  }

  cancelSubscription() {
    this.setState({loading: true});
    axios.get("/auth/stripe/cancel")
      .then(resp => resp.data)
      .then(resp => {
        if (resp.error) this.setState({loading: false, cancel: false});
        else window.location.reload(true);
      })
      .catch(() => {
        this.setState({loading: false, cancel: false});
      });
  }

  render() {

    const {user} = this.props.auth;
    const {loading, stripe} = this.state;

    return (
      <div className="account">
        <OECNavbar />
        {
          user
            ? <div className={`account-content role-${user.role}`}>
              <div className="account-meta">
                <div className="account-meta-info">
                  <h1>{user.name || user.username}</h1>
                  <Activate location={this.props.router.location} />
                  <table className="account-meta-table">
                    <tbody>
                      <tr>
                        <td>E-mail</td>
                        <td>{user.email}</td>
                      </tr>
                      <tr>
                        <td>Join Date</td>
                        <td>{formatDate(new Date(user.createdAt))}</td>
                      </tr>
                      <tr>
                        <td>Subscription</td>
                        <td><Role {...user} /></td>
                      </tr>
                    </tbody>
                  </table>
                  <Button className="logout-button" fill icon="log-out">
                    <a href="/auth/logout">Click here to log out.</a>
                  </Button>
                </div>
                <ChangePassword />
              </div>
              <div className="account-panel">
                { user.role < 1 ? <div className="account-paywall">
                  <FeatureMatrix />
                </div>
                  : user.role === 2 ? <div>
                    <h2>Recent Invoices</h2>
                    <div className="account-invoices">
                      { stripe
                        ? <table>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Description</th>
                              <th>Invoice #</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            { stripe.invoices.map((invoice, i) => {
                              const {number, status} = invoice;
                              const date = new Date(invoice.period_end * 1000);
                              const {description} = invoice.lines.data[0];
                              return <tr key={i}>
                                <td>{formatDate(date)}</td>
                                <td>{description}</td>
                                <td>{number}</td>
                                <td><Tag intent={Intent[status === "paid" ? "NONE" : "WARNING"]}>{status.toUpperCase()}</Tag></td>
                              </tr>;
                            })}
                          </tbody>
                        </table>
                        : <Spinner />}
                    </div>
                    <Button className="cancel-button" fill icon="delete" onClick={() => this.setState({cancel: true})}>
                      Cancel Subscription
                    </Button>
                  </div>
                    : user.role === 10 ? <div>
                      <Button fill icon="build">
                        <Link  to="/admin">Hello, contributor. Would you like to go to the CMS?</Link>
                      </Button>
                      <Button fill icon="database">
                        <Link  to="/explorer">Or... how about the Data Explorer?</Link>
                      </Button>
                    </div>
                      : null }
              </div>
            </div>
            : <NonIdealState icon={<Spinner />} title="Authenticating" />
        }
        <Dialog
          className="cancel-dialog"
          icon="delete"
          isOpen={this.state.cancel}
          onClose={() => this.setState({cancel: false})}
          title="Cancel Subscription"
        >
          <div className="cancel-text">Are you sure you want to cancel your subscription?</div>
          <div className="cancel-buttons">
            <Button disabled={loading} className="cancel-dialog-button cancel-dialog-cancel" onClick={() => this.setState({cancel: false})}>
            Nevermind
            </Button>
            <Button disabled={loading} className="cancel-dialog-button cancel-dialog-confirm" onClick={this.cancelSubscription.bind(this)}>
            Cancel Subscription
            </Button>
          </div>
        </Dialog>
        <Footer />
      </div>
    );
  }

}

export default connect(state => ({
  auth: state.auth,
  locale: state.i18n.locale
}))(hot(Account));
