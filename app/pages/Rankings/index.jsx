import React from "react";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";
import {Button, ButtonGroup} from "@blueprintjs/core";

import "./Rankings.css";

import OECNavbar from "components/OECNavbar";
import Footer from "components/Footer";
import RankingTable from "../../components/RankingTable";

import {PAGE, FILTER_CATEGORY, FILTER_YEARS} from "helpers/rankings.js";

class Rankings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      text: [],
      category: this.props.params.category || "country",
      filter: "2013-2017"
    };
  }

  componentDidMount() {
    const {category} = this.state;

    this.setState({
      title: PAGE[0][category].title,
      text: PAGE[0][category].text
    });
  }

  render() {
    const {title, text, category, filter} = this.state;
    const {t} = this.props;

    console.log(FILTER_YEARS);

    return (
      <div className="rankings-page">
        <OECNavbar />

        <div className="rankings-content">
          <h1 className="title">{t(title)}</h1>
          <div className="about">
            {text.map((d, k) =>
              <p
                className={"text"}
                key={`${k}`}
                dangerouslySetInnerHTML={{__html: t(d)}}
              />
            )}
          </div>
          <div className="download">Here it goes the download buttons</div>
          <div className="settings">
            <div className="setup">
              <div className="title">{t("Showing")}</div>
              <div className="buttons">
                <ButtonGroup style={{minWidth: 200}}>
                  {FILTER_CATEGORY.map((d, k) => <Button key={k}>{`${d[0]}`}</Button>)}
                </ButtonGroup>
              </div>
            </div>
            <div className="setup">
              <div className="title">{t("Year Range")}</div>
              <div className="buttons">
                <ButtonGroup style={{minWidth: 200}}>
                  {FILTER_YEARS.map((d, k) => <Button key={k}>{`${d}`}</Button>)}
                </ButtonGroup>
              </div>
            </div>
          </div>
          <div className="ranking">
            {category && <RankingTable filter={filter} category={category} />}
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default withNamespaces()(connect()(Rankings));
