import React, {Component} from "react";
import {Link} from "react-router";

import "./NavGroup.css";

export default class NavGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  render() {
    const {title, items} = this.props;
    const {isOpen} = this.state;

    return <li>
      <button>
        <span className="u-visually-hidden">{isOpen ? "hide " : "show "}</span> {title}
      </button>
      {items && items.length &&
        <ul>
          {items.map(item =>
            <li key={item.title}>
              {item.items && item.items.length

                // nested list
                ? <React.Fragment>
                  <p>{item.title}</p>
                  <ul>{item.items.map(nestedItem =>
                    <li key={nestedItem.title}>
                      <a href={nestedItem.url}>
                        {nestedItem.icon &&
                          <img src={nestedItem.icon} alt="" />
                        }
                        {nestedItem.title}
                      </a>
                    </li>
                  )}</ul>
                </React.Fragment>

                // no nested list
                : <a href={item.url}>
                  {item.icon &&
                    <img src={item.icon} alt="" />
                  }
                  {item.title}
                </a>
              }
            </li>
          )}
        </ul>
      }
    </li>;
  }
}
