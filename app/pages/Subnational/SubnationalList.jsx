import React from "react";
import {hot} from "react-hot-loader/root";
import {toTitleCase, normalizeString} from "../../helpers/utils";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";
import {InputGroup} from "@blueprintjs/core";

import "./SubnationalList.css";

class SubnationalList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: ""
    };
    this.filterList = this.filterList.bind(this);
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  filterList(event) {
    // const {options} = this.props;
    // const searchTerm = normalizeString(event.target.value);
    // const filtered = options.filter(item => normalizeString(item.name).search(searchTerm) !== -1);
    // console.log(filtered);
    this.props.filterFN(event);
    this.setState({searchText: event.target.value});
  }

  render() {
    const {locale, slug, name, options} = this.props;

    const {searchText} = this.state;

    return <div className="subnational-list">
      <InputGroup type="text"
        id={`${slug}-${name}-search`}
        fill={true}
        placeholder={`Search ${name}`}
        onChange={this.filterList}
        defaultValue={""}
        value={searchText} />
      <div className="subnational-list-container">
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
      </div>
    </div>;
  }
}


SubnationalList.need = [];

export default hot(withNamespaces()(
  connect(state => ({
    locale: state.i18n.locale
  }))(SubnationalList)
));
