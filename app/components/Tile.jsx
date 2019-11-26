import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import {Link} from "react-router";

import "./Tile.css";

class Tile extends Component {
  render() {
    const {title, link, image} = this.props;

    return (
      <li className="tile">
        <Link to={link} className="tile-link">
          <span className={`tile-link-title heading ${title.length > 30 || title.match(/\w+/).toString().length > 25
            ? "u-font-sm"
            : "u-font-md"
          }`}>
            {title}
          </span>
        </Link>
        {image &&
          <div className="tile-cover-img" style={{backgroundImage: `url(${image})`}} />
        }
      </li>
    );
  }
}

export default hot(Tile);
