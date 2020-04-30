import React, {Component} from "react";
import Helmet from "react-helmet";

export default class About extends Component {

  render() {
    return (
      <div className="about">
        <Helmet title="About the Site" />

        <h1>ABOUT THE OEC</h1>

        <p>The Observatory of Economic Complexity (OEC) is an online data visualization and distribution platform focused on the geography and dynamics of economic activities. The OEC integrates and distributes data from a variety of sources to empower analysts in the private sector, public sector, and academia.</p>

        <p>The OEC is currently designed and developed by Datawheel, but it began as a research project at MIT’s Collective Learning group (former Macro Connections Group). The OEC was the <a href="https://dspace.mit.edu/handle/1721.1/76532" target="_blank" rel="noopener noreferrer">Master Thesis</a> of Alex Simoes (2012), directed by Professor Cesar A. Hidalgo.</p>

        <p>In 2012 the OEC was spun out of MIT as an open source project. The OEC was refined throughout the years, expanding its technical and analytical capacities.</p>

        <h2>OEC 1.0 (2011-2013)</h2>

        <p>The first version of the OEC focused primarily on creating single visualizations of trade data. A primitive version of what you find today under the tool/visualizations menu. At that time, it was a pioneering effort in data visualization and distribution.</p>

        <img src="/images/about/OEC_1.0_1.png" alt="as" />

        <h2>OEC 2.0 (2013-2015)</h2>

        <p>The second version of the OEC introduced the idea of profiles. These profiles were designed primarily for search engine optimization, but quickly grew into the most popular section of the site. The visualization builder (Explore in OEC 2.0) was still the main feature.</p>

        <img className="middle" src="/images/about/OEC_2.0_1.png" alt="" />
        <img src="/images/about/OEC_2.0_2.png" alt="" />

        <h2>OEC 3.0 (2015-2020)</h2>

        <p>The 3.0 version of the OEC was designed around the idea of profiles. The visualization builder became a secondary feature, given the tool a more narrative flavor.</p>

        <img className="middle" src="/images/about/OEC_3.0_1.png" alt="" />

        <iframe src="https://player.vimeo.com/video/351708375" width="680" height="385" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>

        <h2>OEC 4.0 (2020-Today)</h2>

        <p>The 4.0 version of the OEC is the largest and most ambitious version of the OEC ever created. It includes subnational level data for dozens of countries, sourced directly from their public customs records. This makes the OEC much more recent, relevant, and higher resolution.</p>

        <p>The 4.0 version of the OEC also includes several new features, such as a tunable prediction tool, the tariff explorer, and the ability to dynamically calculate economic complexity rankings.</p>

        <p>OEC 4.0 was built from scratch on a completely new code base created solely by Datawheel.</p>

        <p>If you would like to cite the OEC, you can cite the original 2011 computer science paper describing its creation:</p>

        <p><i>AJG Simoes, CA Hidalgo. The Economic Complexity Observatory: An Analytical Tool for Understanding the Dynamics of Economic Development. Workshops at the Twenty-Fifth AAAI Conference on Artificial Intelligence. (2011)</i></p>

      </div>
    );
  }
}
