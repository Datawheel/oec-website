import React, {Component} from "react";
import Helmet from "react-helmet";

export default class Data extends Component {
  render() {
    const links = [
      {
        section: "SITC4 rev. 2 (1962 - 2017)",
        content: [
          {
            title: "Product Trade by Year and Country",
            href: "year_origin_sitc_rev2.tsv.bz2"
          },
          {
            title:
              "Product Trade between Origin and Destination Country by Year (bilateral)",
            href: "year_origin_destination_sitc_rev2.tsv.bz2"
          }
        ]
      },
      {
        section: "HS6 rev. 1992 (1995 - 2017)",
        content: [
          {
            title: "Product Trade by Year and Country (6 digit depth)",
            href: "year_origin_hs92_6.tsv.bz2"
          },
          {
            title: "Product Trade by Year and Country (4 digit depth)",
            href: "year_origin_hs92_4.tsv.bz2"
          },
          {
            title:
              "Product Trade between Origin and Destination Country by Year (6 digit depth, bilateral)",
            href: "year_origin_destination_hs92_6.tsv.bz2"
          },
          {
            title:
              "Product Trade between Origin and Destination Country by Year (4 digit depth, bilateral)",
            href: "year_origin_destination_hs92_4.tsv.bz2"
          }
        ]
      },
      {
        section: "HS6 rev. 1996 (1998 - 2017)",
        content: [
          {
            title: "Product Trade by Year and Country (6 digit depth)",
            href: "year_origin_hs96_6.tsv.bz2"
          },
          {
            title: "Product Trade by Year and Country (4 digit depth)",
            href: "year_origin_hs96_4.tsv.bz2"
          },
          {
            title:
              "Product Trade between Origin and Destination Country by Year (6 digit depth, bilateral)",
            href: "year_origin_destination_hs96_6.tsv.bz2"
          },
          {
            title:
              "Product Trade between Origin and Destination Country by Year (4 digit depth, bilateral)",
            href: "year_origin_destination_hs96_4.tsv.bz2"
          }
        ]
      },
      {
        section: "HS6 rev. 2002 (2003 - 2017)",
        content: [
          {
            title: "Product Trade by Year and Country (6 digit depth)",
            href: "year_origin_hs02_6.tsv.bz2"
          },
          {
            title: "Product Trade by Year and Country (4 digit depth)",
            href: "year_origin_hs02_4.tsv.bz2"
          },
          {
            title:
              "Product Trade between Origin and Destination Country by Year (6 digit depth, bilateral)",
            href: "year_origin_destination_hs02_6.tsv.bz2"
          },
          {
            title:
              "Product Trade between Origin and Destination Country by Year (4 digit depth, bilateral)",
            href: "year_origin_destination_hs02_4.tsv.bz2"
          }
        ]
      },
      {
        section: "HS6 rev. 2007 (2008 - 2017)",
        content: [
          {
            title: "Product Trade by Year and Country (6 digit depth)",
            href: "year_origin_hs07_6.tsv.bz2"
          },
          {
            title: "Product Trade by Year and Country (4 digit depth)",
            href: "year_origin_hs07_4.tsv.bz2"
          },
          {
            title:
              "Product Trade between Origin and Destination Country by Year (6 digit depth, bilateral)",
            href: "year_origin_destination_hs07_6.tsv.bz2"
          },
          {
            title:
              "Product Trade between Origin and Destination Country by Year (4 digit depth, bilateral)",
            href: "year_origin_destination_hs07_4.tsv.bz2"
          }
        ]
      },
      {
        section: "Attributes",
        content: [
          {title: "Country Names", href: "country_names.tsv.bz2"},
          {title: "SITC revision 2 Product Names", href: "products_sitc_rev2.tsv.bz2"},
          {title: "HS 1992 Product Names", href: "products_hs_92.tsv.bz2"},
          {title: "HS 1996 Product Names", href: "products_hs_96.tsv.bz2"},
          {title: "HS 2002 Product Names", href: "products_hs_02.tsv.bz2"},
          {title: "HS 2007 Product Names", href: "products_hs_07.tsv.bz2"}
        ]
      }
    ];
    return (
      <div className="data">
        <Helmet title="Data" />

        <h1>Data Sources</h1>

        <p>
          All of the product data shown on the site is classified using either{" "}
          <a
            href="https://en.wikipedia.org/wiki/Standard_International_Trade_Classification"
            target="_blank"
            rel="noopener noreferrer"
          >
            SITC (Standard International Trade Classification)
          </a>{" "}
          or{" "}
          <a
            href="https://en.wikipedia.org/wiki/Harmonized_System"
            target="_blank"
            rel="noopener noreferrer"
          >
            HS (Harmonized System)
          </a>.{" "}
        </p>

        <p>
          For historical SITC classification data (1962 - 2000), we use data from{" "}
          <a
            href="http://cid.econ.ucdavis.edu/"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Center for International Data from Robert Feenstra
          </a>
          <sup>1</sup>. For more recent data (2001 - 2017), we use data provided by{" "}
          <a href="http://comtrade.un.org/" target="_blank" rel="noopener noreferrer">
            UN COMTRADE
          </a>.{" "}
        </p>

        <p>
          For all of the HS data used throughout the site (1995 - 2017) we use the{" "}
          <a
            href="http://www.cepii.fr/CEPII/en/bdd_modele/presentation.asp?id=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            BACI International Trade Database
          </a>
          <sup>2</sup>. The original data comes from the United Nations Statistical
          Division (COMTRADE), but is cleaned by the BACI team using their own{" "}
          <a
            href="http://www.cepii.fr/CEPII/fr/publications/wp/abstract.asp?NoDoc=2726"
            target="_blank"
            rel="noopener noreferrer"
          >
            methodology of harmonization
          </a>.{" "}
        </p>

        <h2>Download the Data</h2>

        <p>
          The following files are complete data dumps for the entirety of the data held on
          the site.
        </p>

        {links.map((d, k) =>
          <div className="data-section" key={k}>
            <h3>{d.section}</h3>
            {d.content.map((f, h) =>
              <a href="/db/" target="_blank" rel="noopener noreferrer">{f.title}</a>
            )}
          </div>
        )}

        <h2>References</h2>

        <div className="reference">
          <span>1.</span>
          <span>
            Feenstra, R. C., et al. (2005). World Trade Flows, 1962–2000. NBER working
            paper 11040
          </span>
        </div>

        <div className="reference">
          <span>2.</span>
          <span>
            BACI: International Trade Database at the Product-Level. The 1994-2007 Version
            CEPII Working Paper, N°2010-23, Octobre 2010 Guillaume Gaulier, Soledad
            Zignago - See more{" "}
            <a
              href="http://www.cepii.fr/CEPII/en/bdd_modele/papers.asp?id=1#sthash.vF5O0Ruh.dpuf"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>.
          </span>
        </div>
      </div>
    );
  }
}
