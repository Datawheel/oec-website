import React, {Component} from "react";
import {Link} from "react-router";
import {hot} from "react-hot-loader/root";

import Select from "@datawheel/canon-cms/src/components/fields/Select.jsx";
import ButtonGroup from "@datawheel/canon-cms/src/components/fields/ButtonGroup.jsx";

import FancyButton from "../components/FancyButton";
import "./Welcome.css";

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection1: "unspecified",
      selection2: "unspecified",
      selection2Entity: "product"
    };
  }

  handleSubmit(e) {
    e.preventDefault(); // prevent page refresh on form submit

    const {router} = this.props;
    const {selection1, selection2, selection2Entity} = this.state;
    const locale = "en"; // NOTE: placeholder

    if (selection1 !== "unspecified") {
      // both entities selected
      if (selection2 !== "unspecified") {
        router.push(`/${locale}/profile/country/${selection1}/${selection2Entity}/${selection2}`);
      }
      // first entity selected only
      else router.push(`/${locale}/profile/country/${selection1}`);
    }
  }

  toggleEntity(entity) {
    this.setState({
      selection2: "unspecified",
      selection2Entity: entity
    });
  }

  render() {
    const {selection1, selection2, selection2Entity} = this.state;

    // dummy data
    const countries = [
      {name: "Select a country", id: "unspecified"},
      {name: "United States", id: "us"},
      {name: "Chile", id: "chile"},
      {name: "Afghanistan", id: "af"},
      {name: "Datawheelistan", id: "dw"}
    ];
    const products = [
      {name: "Select a product", id: "unspecified"},
      {name: "Fruit juice", id: "fruit-juice"},
      {name: "Legos", id: "legos"},
      {name: "Data", id: "data"},
      {name: "Wheels", id: "wheels"}
    ];

    const countryIconPath = "/images/icons/country";
    const productIconPath = "/images/icons/product";
    const countryDefaultIcon = `${countryIconPath}/country.svg`;
    const productDefaultIcon = `${productIconPath}/product.svg`;

    return (
      <div className="welcome">
        {/* spinning orb thing */}
        <div className="welcome-bg">
          <img className="welcome-bg-img" src="/images/stars.png" alt="" draggable="false" />
        </div>

        {/* welcome text */}
        <div className="welcome-intro">
          <h1 className="welcome-intro-heading u-font-lg u-margin-top-off" aria-label="Welcome to the Observatory of Economic Complexity, the world's leading data visualization tool for international trade data">
            <span className="welcome-intro-heading-text">Welcome to</span>
            <div className="welcome-intro-heading-logo">
              <img className="welcome-intro-heading-logo-img" src="/images/big_logo.png" alt="" draggable="false" />
            </div>
            <span className="welcome-intro-heading-text">The world’s leading data visualization tool for international trade data.</span>
          </h1>

          {/* logos */}
          <div className="welcome-intro-logo-container">
            <h2 className="u-visually-hidden">Brought to you by: </h2>
            <ul className="welcome-intro-logo-list">
              <li className="welcome-intro-logo-item">
                <a href="https://www.iadb.org" className="welcome-intro-logo-link">
                  <img
                    className="welcome-intro-logo-img"
                    src="/images/logos/idb-logo.svg"
                    alt="Inter-American Development Bank"
                    draggable="false"
                  />
                </a>
              </li>
              <li className="welcome-intro-logo-item">
                <a href="https://www.datawheel.us/" className="welcome-intro-logo-link">
                  <img
                    className="welcome-intro-logo-img"
                    src="/images/logos/datawheel-logo.svg"
                    alt="Datawheel"
                    draggable="false"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* entity selection form */}
        <div className="welcome-form-outer">
          <div className="welcome-form-inner">
            <h2 className="u-visually-hidden">
              Please select a country. You may also select a product, or an additional country.
            </h2>

            {/* the form */}
            <form onSubmit={e => this.handleSubmit(e)} className="welcome-form">
              {/* entity 1 */}
              <div className="welcome-form-select-wrapper">
                <img
                  src={selection1 === "unspecified"
                    ? countryDefaultIcon
                    : `${countryIconPath}/country_${selection1}.png`
                  }
                  className="welcome-form-select-icon"
                  alt=""
                />
                <Select
                  label="country"
                  className="welcome-form-select"
                  fontSize="lg"
                  onChange={e => this.setState({selection1: e.target.value})}
                >
                  {countries.map(country =>
                    <option value={country.id} key={country.id}>
                      {country.name}
                    </option>
                  )}
                </Select>
              </div>

              {/* entity 2 */}
              <div className="welcome-form-select-wrapper" disabled={selection1 === "unspecified"}>
                <ButtonGroup className="welcome-form-toggle"
                  buttons={[
                    {
                      active: selection2Entity === "product",
                      children: "product",
                      type: "button", // prevent form submission
                      onClick: () => this.toggleEntity("product")
                    },
                    {
                      active: selection2Entity === "country",
                      children: "country",
                      type: "button", // prevent form submission
                      onClick: () => this.toggleEntity("country")
                    }
                  ]}
                />
                <img
                  src={selection2Entity === "product"
                    ? selection2 === "unspecified"
                      ? productDefaultIcon : `${productIconPath}/hs_${selection2}.png`
                    : selection2 === "unspecified"
                      ? countryDefaultIcon : `${countryIconPath}/country_${selection2}.png`
                  }
                  className="welcome-form-select-icon"
                  alt=""
                />
                <Select
                  label={selection2Entity}
                  labelHidden
                  className="welcome-form-select"
                  fontSize="lg"
                  onChange={e => this.setState({selection2: e.target.value})}
                >
                  {selection2Entity === "product"
                    ? products.map(product =>
                      <option value={product.id} key={product.id}>
                        {product.name}
                      </option>
                    )
                    : countries.map(country =>
                      <option value={country.id} key={country.id}>
                        {country.name}
                      </option>
                    )
                  }
                </Select>
              </div>

              {/* submit button submits the form */}
              <div className="welcome-form-button-wrapper">
                <FancyButton icon="arrow-right" disabled={selection1 === "unspecified"}>
                  Go to profile
                </FancyButton>
              </div>

            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default hot(Welcome);
