import React, {Component} from "react";

export default class Faq extends Component {

  render() {
    return (
      <div className="faq">

        <h1> Frequently Asked Questions </h1>

        <h2> Where does the data come from? </h2>

        <p> The observatory provides access to bilateral trade data for roughly 200 countries, 50 years and 1000 different products of the SITC4 revision 2 classification. For historical SITC classification data, we use data from <a href="http://cid.econ.ucdavis.edu/" className="link" target="_blank" rel="noopener noreferrer">The Center for International Data from Robert Feenstra</a>. For up to data HS classification data, we use data provided by <a href="http://comtrade.un.org/" className="link" target="_blank" rel="noopener noreferrer">UN COMTRADE</a>. </p>

        <h2> Can i download this data? </h2>

        <p> Sure! You can download the latest dump of the entire data (in MySQL format) <a href="/db/" className="link" target="_blank" rel="noopener noreferrer">here</a>. Or if you are looking for data on a particular country or product, you can click the CSV download button on the right-hand side of all explore pages. </p>

        <h2> Some of the translations for this site are incorrect, is there a way i could help? </h2>

        <p> Sure! You can download the latest dump of the entire data (in MySQL format) here. Or if you are looking for data on a particular country or product, you can click the CSV download button on the right-hand side of all explore pages. </p>

        <a href="" className="link">SITC Products</a>

        <a href="" className="link">HS Products</a>

        <a href="" className="link">Site-Wide Translations</a>

        <p> Instructions: these documents are open to the public for view and commenting. If you want to contribute your own translation, right-click on a cell and select &apos;Insert Comment&apos;. </p>

        <h2> I think the data might be incorrect for a given page </h2>

        <p> The data has all been cleaned by third parties, but of course that doesn&apos;t mean that aren&apos;t possible errors. File an <a href="https://github.com/alexandersimoes/oec/issues" className="link" target="_blank" rel="noopener noreferrer">issue here</a> and we&apos;ll try our best to resolve it. </p>

        <h2> I found a bug on the site! What should i do? </h2>

        <p> Wooops! Sorry about that... please <a href="https://github.com/alexandersimoes/oec/issues" className="link" target="_blank" rel="noopener noreferrer">file an issue here</a> with a link and details on how to recreate it and we&apos;ll do our best to resolve it ASAP. </p>

      </div>
    );
  }
}
