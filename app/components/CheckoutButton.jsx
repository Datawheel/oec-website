import React, {Component} from "react";
import {connect} from "react-redux";
import axios from "axios";
import Button from "@datawheel/canon-cms/src/components/fields/Button.jsx";
import "./CheckoutButton.css";

class CheckoutButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      loading: false
    };
  }

  onClick() {
    this.setState({loading: true});
    axios.get("/auth/checkout")
      .then(resp => resp.data)
      .then(session => {
        const {error, id} = session;
        if (error) {
          console.error(error);
          this.setState({error, loading: false});
        }
        else {
          const {STRIPE} = this.props;
          const stripe = new window.Stripe(STRIPE);
          stripe
            .redirectToCheckout({sessionId: id})
            .catch(error => {
              console.error(error);
              this.setState({error, loading: false});
            });
        }
      });
  }

  render() {

    const {error, loading} = this.state;
    const {className, link, onClick, text} = this.props;

    return <Button
      className={`checkout-button ${className}`}
      disabled={loading}
      fill={true}
      fontSize="md"
      rebuilding={loading}
      onClick={link ? undefined : onClick || this.onClick.bind(this)}
    >
      {error ? "Please Retry" : link ? <a href={link}>{text}</a> : text}
    </Button>;
  }
}

CheckoutButton.defaultProps = {
  text: "Subscribe"
};

export default connect(state => ({STRIPE: state.env.STRIPE}))(CheckoutButton);
