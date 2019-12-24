import React from "react";
import throttle from "@datawheel/canon-cms/src/utils/throttle";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";
import Navbar from "components/Navbar";
import Footer from "components/Footer";

import "./Vizbuilder.css";
import VbTabs from "../../components/VbTabs";
import VbChart from "../../components/VbChart";
import VirtualSelector from "../../components/VirtualSelector";

class Vizbuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "tree_map",
      scrolled: false
    };
  }


  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    throttle(() => {
      if (window.scrollY > 220) {
        this.setState({scrolled: true});
      }
      else {
        this.setState({scrolled: false});
      }
    }, 30);
  };

  render() {
    const {activeTab, scrolled} = this.state;

    return <div id="vizbuilder">
      <Navbar
        className={scrolled ? "background" : ""}
        title={"Hello"}
        scrolled={scrolled}
      />

      <div className="vb-profile">
        <div className="vb-columns">
          <div className="vb-column aside">
            <VbTabs
              activeTab={activeTab}
              callback={d => this.setState(d)}
            />
            <VirtualSelector />
            <VirtualSelector />
          </div>
          <div className="vb-column">
            <VbChart />
          </div>
        </div>
      </div>
      <Footer />
    </div>;
  }
}

export default withNamespaces()(connect()(Vizbuilder));
