import React, {Component} from "react";
import Helmet from "react-helmet";

export default class Data extends Component {

  render() {
    return (
      <div className="data">
        <Helmet title="Data" />

        <h1>Data Sources</h1>

        <p>All of the product data shown on the site is classified using either <a href="https://en.wikipedia.org/wiki/Standard_International_Trade_Classification" target="_blank" rel="noopener noreferrer">SITC (Standard International Trade Classification)</a> or <a href="https://en.wikipedia.org/wiki/Harmonized_System" target="_blank" rel="noopener noreferrer">HS (Harmonized System)</a>. </p>

        <p>For historical SITC classification data (1962 - 2000), we use data from <a href="http://cid.econ.ucdavis.edu/" target="_blank" rel="noopener noreferrer">The Center for International Data from Robert Feenstra</a><sup>1</sup>. For more recent data (2001 - 2017), we use data provided by <a href="http://comtrade.un.org/" target="_blank" rel="noopener noreferrer">UN COMTRADE</a>. </p>

        <p>For all of the HS data used throughout the site (1995 - 2017) we use the <a href="http://www.cepii.fr/CEPII/en/bdd_modele/presentation.asp?id=1" target="_blank" rel="noopener noreferrer">BACI International Trade Database</a><sup>2</sup>. The original data comes from the United Nations Statistical Division (COMTRADE), but is cleaned by the BACI team using their own <a href="http://www.cepii.fr/CEPII/fr/publications/wp/abstract.asp?NoDoc=2726" target="_blank" rel="noopener noreferrer">methodology of harmonization</a>. </p>

        <h2>Download the Data</h2>

        <h2>References</h2>

        <div className="reference">
          <span>1.</span>
          <span>Feenstra, R. C., et al. (2005). World Trade Flows, 1962–2000. NBER working paper 11040</span>
        </div>

        <div className="reference">
          <span>2.</span>
          <span>BACI: International Trade Database at the Product-Level. The 1994-2007 Version CEPII Working Paper, N°2010-23, Octobre 2010 Guillaume Gaulier, Soledad Zignago - See more <a href="http://www.cepii.fr/CEPII/en/bdd_modele/papers.asp?id=1#sthash.vF5O0Ruh.dpuf" target="_blank" rel="noopener noreferrer">here</a>.</span>
        </div>

      </div>
    );
  }
}
