import React from "react";
import {hot} from "react-hot-loader/root";
import {toTitleCase} from "../../helpers/utils";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import "./SubnationalList.css";

class SubnationalList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const {options, locale, slug} = this.props;

    return <div className="subnational-list">
      {options &&
        <ul>
          {options.length === 0 &&
            <li>No results.<br/> Try another search.</li>
          }
          {options.sort((a, b) => a.name > b.name ? 1 : -1).map(profile =>
            <li key={profile.slug}>
              <a href={`/${locale}/profile/${slug}/${profile.slug}`}>
                {toTitleCase(profile.name)}
              </a>
            </li>
          )}
        </ul>
      }
    </div>;
  }
}


SubnationalList.need = [];

export default hot(withNamespaces()(
  connect(state => ({
    locale: state.i18n.locale
  }))(SubnationalList)
));
