import React, {Component, Fragment} from "react";
import {hot} from "react-hot-loader/root";
import {Icon} from "@blueprintjs/core";
import "./NavGroup.css";

class NavGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.toggleButton = React.createRef();
  }

  /** when tabbing out of the nav group, collapse it */
  onBlur(e) {
    const currentTarget = e.currentTarget;

    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        this.setState({isOpen: false});
      }
    }, 85); // register the click before closing
  }

  /** when clicking a subtitle, refocus the button to prevent the nav from losing focus and collapsing */
  onFocusButton() {
    setTimeout(() => {
      this.toggleButton.current.focus();
    }, 0);
  }

  /** the link markup is the same whether it's rendered in a nested list or not */
  renderLink(item) {
    return <a href={item.url} className="nav-group-link" onFocus={() => this.setState({isOpen: true})}>
      {item.icon &&
        <img className="nav-group-link-icon" src={`/images/icons/${item.icon}.png`} alt="" />
      }
      {item.title}
    </a>;
  }

  render() {
    const {title, items} = this.props;
    const {isOpen} = this.state;

    return (
      <li className="nav-group" onBlur={e => this.onBlur(e)} onClick={() => this.onFocusButton()} key={`${title}-nav-group`}>
        {/* click the title to toggle the menu */}
        <button
          className={`nav-group-button display ${isOpen ? "is-active" : "is-inactive"}`}
          onClick={() => this.setState({isOpen: !isOpen})}
          ref={this.toggleButton}
        >
          <span className="u-visually-hidden">{isOpen ? "hide" : "show"} </span>
          <span className="nav-group-button-text">{title} </span>
          <Icon icon="caret-down" className="nav-group-button-icon" />
        </button>

        {/* loop through nav links */}
        {items && items.length &&
          <ul className={`nav-group-list ${isOpen ? "is-open" : "is-closed"}`} key={`${title}-nav-group-list`}>
            {items.map(item =>
              <li className="nav-group-item" key={`${item.title}-nav-group-item`}>
                {item.items && item.items.length
                  // nested items array; render them in a nested list
                  ? <Fragment>
                    <p className="nav-group-subtitle display">{item.title}</p>
                    <ul className="nav-group-list nav-group-nested-list">
                      {item.items.map(nestedItem =>
                        <li className="nav-group-item nav-group-nested-item" key={`${item.title}-${nestedItem.title}-nav-group-nested-item`}>
                          {this.renderLink(nestedItem)}
                        </li>
                      )}
                    </ul>
                  </Fragment>

                  // no nested items array; just render the link
                  : this.renderLink(item)
                }
              </li>
            )}
          </ul>
        }
      </li>
    );
  }
}

export default hot(NavGroup);
