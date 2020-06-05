import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";
import {Intent} from "@blueprintjs/core";
import axios from "axios";
import colors from "helpers/colors";
import {usage} from "helpers/signupInfo";
import {signup} from "actions/auth";

import {SocialButtons} from "@datawheel/canon-core/src/components/SocialButtons";
import {SIGNUP_EXISTS} from "@datawheel/canon-core/src/consts";
import "@datawheel/canon-core/src/components/Forms.css";

import OECMultiSelect from "components/OECMultiSelect";

class SignUpForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      agreedToTerms: false,
      company: "",
      countries: [],
      email: null,
      error: null,
      newsletter: true,
      password: "",
      passwordAgain: "",
      phone: "",
      sectors: [],
      selectedCountries: [],
      selectedSectors: [],
      selectedUsage: [],
      submitted: false
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const val = ["agreedToTerms", "newsletter"].includes(e.target.name) ? e.target.checked : e.target.value;
    this.setState({[e.target.name]: val});
  }

  onSubmit(e) {
    e.preventDefault();
    const {legal, redirect, t} = this.props;
    const {
      agreedToTerms,
      company,
      email,
      newsletter,
      password,
      passwordAgain,
      phone,
      selectedCountries,
      selectedSectors,
      selectedUsage,
      username
    } = this.state;

    /*
     * /^
     *  (?=.*\d)    // should contain at least one digit
     *  (?=.*[a-z]) // should contain at least one lower case
     *  (?=.*[A-Z]) // should contain at least one upper case
     *  .           // anything else here (for special characters)
     *  {8,32}      // should contain at least 8 characters but no more than 32
     * $/
     */
    const re = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/);

    if (password !== passwordAgain) {
      this.setState({error: {icon: "lock", message: t("SignUp.error.PasswordMatch")}});
    }
    else if (!re.test(password)) {
      this.setState({error: {icon: "lock", message: "Password must be at least 8 digits and include a number, upper-case letter and lower-case letter."}});
    }
    else if (!username || !email || !password || !company) {
      this.setState({error: {icon: "id-number", message: t("SignUp.error.IncompleteFields")}});
    }
    else if (!selectedSectors.length) {
      this.setState({error: {icon: "office", message: "Please choose at least 1 industry sector"}});
    }
    else if (!selectedUsage.length) {
      this.setState({error: {icon: "document", message: "Please choose at least 1 use case"}});
    }
    else if (!selectedCountries.length) {
      this.setState({error: {icon: "globe", message: "Please choose at least 1 focus country"}});
    }
    else if ((legal.privacy || legal.terms) && !agreedToTerms) {
      this.setState({error: {icon: "saved", message: t("SignUp.error.TermsAgree")}});
    }
    else {
      this.props.signup({
        name: username,
        email,
        username: email,
        password,
        redirect,
        company,
        newsletter,
        sector: selectedSectors.map(d => d.value).join(","),
        usage: selectedUsage.map(d => d.value).join(","),
        country: selectedCountries.map(d => d.value).join(",")
      });
      this.setState({submitted: true});
    }

  }

  componentDidMount() {

    axios.all([
      axios.get("/members/isic.json"),
      axios.get("/members/country.json")
    ]).then(axios.spread((resp1, resp2) => {

      const sectors = resp1.data
        .filter(d => d.value.length === 1)
        .map(d => ({...d, label: d.value}));

      const countries = resp2.data
        .map(d => ({...d, color: colors.Continent[d.parent_id]}))
        .sort((a, b) => a.title > b.title ? 1 : -1);

      this.setState({countries, sectors});

    }));

  }

  componentDidUpdate() {
    const {auth, t} = this.props;
    const {error, submitted} = this.state;

    if (submitted && !auth.loading) {
      if (auth.error === SIGNUP_EXISTS) {
        this.showToast(t("SignUp.error.Exists"), "blocked-person", Intent.WARNING);
      }
      else if (!auth.error) {
        this.showToast(t("SignUp.success"), "endorsed", Intent.SUCCESS);
      }
      this.setState({submitted: false});
    }
    else if (error) {
      this.showToast(error.message, error.icon, error.intent);
      this.setState({error: false});
    }

  }

  showToast(message, icon = "lock", intent = Intent.DANGER) {
    const Toast = this.context.toast.current;
    Toast.show({icon, intent, message});
  }

  handleItemMultiSelect = (key, d) => {
    this.setState({[key]: d});
  }

  onKeyPress(event) {
    if (event.which === 13 /* Enter */) event.preventDefault();
  }

  render() {
    const {auth, legal, social, t} = this.props;
    const {
      agreedToTerms,
      countries,
      sectors,
      selectedCountries,
      selectedSectors,
      selectedUsage
    } = this.state;

    const email = this.state.email === null ? auth.error && auth.error.email ? auth.error.email : "" : this.state.email;

    return (
      <div>
        <form id="signup" onSubmit={this.onSubmit.bind(this)} className="signup-container" onKeyPress={this.onKeyPress}>
          <div className="signup-flex">
            <div>
              <div className="bp3-input-group">
                <span className="bp3-icon bp3-icon-envelope"></span>
                <input className="bp3-input" placeholder={ t("SignUp.E-mail") } value={email} type="email" name="email" onChange={this.onChange} tabIndex="1" />
              </div>
              <div className="bp3-input-group">
                <span className="bp3-icon bp3-icon-user"></span>
                <input className="bp3-input" placeholder={ t("SignUp.Username") } value={this.state.username} type="text" name="username" onFocus={this.onChange} onChange={this.onChange} tabIndex="2" />
              </div>
              {/* <div className="bp3-input-group">
                <span className="bp3-icon bp3-icon-phone"></span>
                <input className="bp3-input" placeholder="Phone Number" value={this.state.phone} type="text" name="phone" onFocus={this.onChange} onChange={this.onChange} tabIndex="3" />
              </div> */}
              <div className="bp3-input-group">
                <span className="bp3-icon bp3-icon-lock"></span>
                <input className="bp3-input" placeholder={ t("SignUp.Password") } value={this.state.password} type="password" name="password" onFocus={this.onChange} onChange={this.onChange} autoComplete="Off" tabIndex="4" />
              </div>
              <div className="bp3-input-group">
                <span className="bp3-icon bp3-icon-lock"></span>
                <input className="bp3-input" placeholder={ t("SignUp.Confirm Password") } value={this.state.passwordAgain} type="password" name="passwordAgain" onFocus={this.onChange} onChange={this.onChange} autoComplete="Off" tabIndex="5" />
              </div>
            </div>
            <div>
              <div className="bp3-input-group">
                <span className="bp3-icon bp3-icon-office"></span>
                <input className="bp3-input" placeholder="Company Name" value={this.state.company} type="text" name="company" onFocus={this.onChange} onChange={this.onChange} tabIndex="6" />
              </div>
              <OECMultiSelect
                disabled={!sectors.length}
                icon="office"
                items={sectors}
                itemType="sector"
                selectedItems={selectedSectors}
                placeholder="What industry sector do you work in?"
                tabIndex="7"
                callback={d => this.handleItemMultiSelect("selectedSectors", d)}
                onClear={d => this.handleItemMultiSelect("selectedSectors", d)}
              />
              <OECMultiSelect
                disabled={!countries.length}
                icon="globe"
                items={countries}
                itemType="country"
                selectedItems={selectedCountries}
                placeholder="Country"
                tabIndex="8"
                callback={d => this.handleItemMultiSelect("selectedCountries", d)}
                onClear={d => this.handleItemMultiSelect("selectedCountries", d)}
              />
              <OECMultiSelect
                disabled={!usage.length}
                icon="document"
                items={usage}
                itemType="usage"
                selectedItems={selectedUsage}
                placeholder="What do you use the OEC for?"
                tabIndex="9"
                callback={d => this.handleItemMultiSelect("selectedUsage", d)}
                onClear={d => this.handleItemMultiSelect("selectedUsage", d)}
              />
              <label className="bp3-control bp3-checkbox" htmlFor="nlbox">
                <input type="checkbox" id="nlbox" name="newsletter" checked={this.state.newsletter} onChange={this.onChange} tabIndex="10" />
                <span className="bp3-control-indicator"></span>
                <span>Send me e-mail news and updates</span>
              </label>
              { legal.privacy || legal.terms
                ? <label className="bp3-control bp3-checkbox" htmlFor="ppcbox">
                  <input type="checkbox" id="ppcbox" name="agreedToTerms" checked={agreedToTerms} onChange={this.onChange} tabIndex="11" />
                  <span className="bp3-control-indicator"></span>
                  <span dangerouslySetInnerHTML={{__html: legal.privacy && legal.terms ? t("SignUp.PrivacyTermsText", legal) : legal.privacy ? t("SignUp.PrivacyText", legal) : t("SignUp.TermsText", legal)}}></span>
                </label>
                : null }
            </div>
          </div>
          <button type="submit" className="bp3-button bp3-fill" tabIndex="12">{ t("SignUp.Sign Up") }</button>
        </form>
        <SocialButtons social={social} />
      </div>
    );

  }
}

SignUpForm.defaultProps = {
  redirect: "/"
};

SignUpForm.contextTypes = {
  toast: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth,
  legal: state.legal,
  social: state.social
});

const mapDispatchToProps = dispatch => ({
  signup: userData => {
    dispatch(signup(userData));
  }
});

SignUpForm = withNamespaces()(SignUpForm);
SignUpForm = connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
export default SignUpForm;
