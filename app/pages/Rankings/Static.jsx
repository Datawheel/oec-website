/* eslint-disable quotes */
import React, {Component} from 'react';
import Helmet from "react-helmet";
import axios from 'axios';
import numeral from 'numeral';
import {Icon} from '@blueprintjs/core';
import {range} from 'helpers/utils';

import Loading from 'components/Loading';
import RankingText from 'components/RankingText';
import RankingTable from 'components/RankingTable';
import SimpleSelect from 'components/SimpleSelect';
import ECIgraphs from 'components/ECIgraphs';

export default class Static extends Component {
  state = {
    data: null,
    columns: null,
    graphData: null,
    graphYears: null,
    graphYear: null,
    gdpData: null,
    _loading: true,
    _graphs: false
  }

  componentDidMount = () => {
    const {type, depth, rev} = this.props;
    const path = this.pathCreator(type, depth, rev);
    this.fetchData(path, type, depth, rev);
  }

  // Checks the changes on the variables: type (eci/pci), depth (hs4, hs6), rev (hs92,...,hs07)
  componentDidUpdate = (prevProps, prevState) => {
    const {type, depth, rev} = this.props;
    if (type !== prevProps.type || depth !== prevProps.depth || rev !== prevProps.rev) {
      const path = this.pathCreator(type, depth, rev);
      this.fetchData(path, type, depth, rev);
    }
  }

  // Creates the path for the data to be loaded
  pathCreator = (type, depth, rev) => {
    let path = null;
    if (type === 'eci') {
      path = `/olap-proxy/data.jsonrecords?cube=complexity_${type}_a_${rev}_${depth}&drilldowns=Country,${type.toUpperCase()}+Rank,Year&measures=${type.toUpperCase()}&parents=true&sparse=false`;
    }
    else {
      path = `/olap-proxy/data.jsonrecords?cube=complexity_${type}_a_${rev}_${depth}&drilldowns=${depth.toUpperCase()},${type.toUpperCase()}+Rank,Year&measures=${type.toUpperCase()}&parents=false&sparse=false`;
    }
    return path;
  }

  fetchData = (path, type, depth, rev) => {
    const data = [];
    const gdpApi = "/api/gdptrade";
    // Reset _loading for the component get's off the display
    this.setState({_loading: true, data: []});
    axios.all([axios.get(path), axios.get(gdpApi)]).then(
      axios.spread((resp1, resp2) => {
        const pathData = resp1.data.data;
        // Country, HS4, HS6
        const measure = type === "eci" ? 'Country' : depth.toUpperCase();
        // Get list of unique countries/products
        const unique = [...new Set(pathData.map(m => m[`${measure} ID`]))];
        // Get list of years on the data and gets first and last year
        const uniqueYears = [...new Set(pathData.map(m => m.Year))];
        const maxYear = Math.max(...uniqueYears);
        const minYear = Math.min(...uniqueYears);

        // Used for setting the rankings fon countries that don't have in max year
        const maxYearDataLength = pathData.filter(f => f.Year === maxYear).length;
        let flag = 1;

        // eslint-disable-next-line guard-for-in
        for (const index in unique) {
          const rowData = pathData.filter(f => f[`${measure} ID`] === unique[index]);
          // Creates first two values of the array with country/product name and id
          const row = {};
          row[measure] = rowData[0][measure];
          row[`${measure} ID`] = unique[index];
          // Aggregates the values for the years that we have on the cube
          rowData.forEach(d => {
            const values = {};
            values[`${d.Year} ${`${type}`.toUpperCase()}`] = d[`${type}`.toUpperCase()];
            values[`${d.Year} Ranking`] = d[`${`${type}`.toUpperCase()} Rank`];
            row[`${d.Year}`] = values;
          });
          // Add to the years that the data don't have values -1000 for a flag to don't show them and add's rankings for the ones that don't have on the final year
          range(minYear, maxYear).forEach(d => {
            if (!row[d]) {
              if (d !== maxYear) {
                const values = {};
                values[`${d} ${`${type}`.toUpperCase()}`] = -1000;
                values[`${d} Ranking`] = null;
                row[`${d}`] = values;
              }
              else {
                const values = {};
                values[`${d} ${`${type}`.toUpperCase()}`] = -1000;
                values[`${d} Ranking`] = maxYearDataLength + flag;
                row[`${d}`] = values;
                flag += 1;
              }
            }
          });
          // Push the data for the country/product to the one with all the countries/products
          data.push(row);
        }

        // Sort for the final year
        data.sort((a, b) => a[maxYear][`${maxYear} Ranking`] - b[maxYear][`${maxYear} Ranking`]);

        // Create columns
        const columns = this.createColumns(type, depth, rev, minYear, maxYear);

        // Create the data for the ECI graphics
        let graphData = null;
        let graphYears = null;
        let graphYear = null;
        let gdpData = null;
        let _graphs = null;
        if (type === "eci") {
          // Data for the geomap
          graphData = resp1.data.data.slice();
          graphData.forEach(d => {
            d["Country ID"] = d["Country ID"].slice(d["Country ID"].length - 3);
          });

          // Years for the geomap data
          graphYears = uniqueYears.slice().sort((a, b) => b - a).map(d => ({title: d, value: d}));
          graphYear = maxYear;

          // Data for the scatter chart
          gdpData = resp1.data.data.slice();

          // Read data from the GDP/TRADE api
          const gdpRaw = resp2.data.data.filter(f => uniqueYears.includes(f.Year));
          gdpData.forEach(m => {
            const row = gdpRaw.filter(f => f["Country ID"].slice(2) === m["Country ID"] && f.Year === m.Year)[0];
            if (row) {
              m["GDP"] = row["GDP"];
              m["Trade Value"] = row["Trade Value"];
            } else {
              m["GDP"] = null;
              m["Trade Value"] = null;
            }
          });
          console.log("GDP Data", gdpData);
          _graphs = true;
        } else {
          graphData = null;
          graphYears = null;
          graphYear = null;
          gdpData = null;
          _graphs = false;
        }

        this.setState({
          type,
          depth,
          rev,
          data,
          columns,
          graphData,
          graphYears,
          graphYear,
          gdpData: gdpData.filter(f => f.GDP !== null),
          _loading: false,
          _graphs
        });
      })
    );
  };

  createColumns = (type, depth, rev, initialYear, finalYear) => {
    // Column ID (1 to .....n)
    const columnID = {
      id: 'ranking',
      Header: '',
      className: 'col-id',
      Cell: props => props.index + 1,
      width: 40,
      sortable: false
    };

    // Set the columns name between Countries and Products
    let columnNAME = {};
    if (type === "eci") {
      columnNAME = {
        id: 'category',
        accessor: d => d.Country,
        width: 240,
        Header: () =>
          <div className="header">
            <span className="year">{'Country'}</span>
            <div className="icons">
              <Icon icon={'caret-up'} iconSize={16} />
              <Icon icon={'caret-down'} iconSize={16} />
            </div>
          </div>,
        style: {whiteSpace: 'unset'},
        Cell: props =>
          <div className="category">
            <img
              src={`/images/icons/country/country_${props.original['Country ID'].substr(
                props.original['Country ID'].length - 3
              )}.png`}
              alt="icon"
              className="icon"
            />
            <a
              href={`/en/profile/country/${props.original['Country ID'].substr(
                props.original['Country ID'].length - 3
              )}`}
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="name">{props.original.Country}</div>
              <Icon icon={'chevron-right'} iconSize={14} />
            </a>
          </div>

      };
    }
    else {
      if (depth !== 'SITC') {
        columnNAME = {
          id: 'category',
          accessor: d => d[`${depth.toUpperCase()}`],
          width: 400,
          Header: () =>
            <div className="header">
              <span className="year">{'Product'}</span>
              <div className="icons">
                <Icon icon={'caret-up'} iconSize={16} />
                <Icon icon={'caret-down'} iconSize={16} />
              </div>
            </div>,
          style: {whiteSpace: 'unset'},
          Cell: props =>
            <div className="category">
              <img
                src={`/images/icons/hs/hs_${props.original[`${depth.toUpperCase()} ID`]
                  .toString()
                  .substr(
                    0,
                    props.original[`${depth.toUpperCase()} ID`].toString().length * 1 -
                    depth.substr(2) * 1
                  )}.svg`}
                alt="icon"
                className="icon"
              />
              {rev.toUpperCase() === 'HS92'
                ? <a
                  href={`/en/profile/${rev}/${props.original[
                    `${depth.toUpperCase()} ID`
                  ]}`}
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="name">{props.original[`${depth.toUpperCase()}`]}</div>
                  <Icon icon={'chevron-right'} iconSize={14} />
                </a>
                : <div className="link">
                  <div className="name">{props.original[`${depth.toUpperCase()}`]}</div>
                </div>
              }
            </div>

        };
      }
    }

    // Set the name for the columns for each year
    const measure = type.toUpperCase();
    const YEARS = range(initialYear, finalYear);
    YEARS.reverse();
    const columnYEARS = YEARS.map((year, index, {length}) => ({
      id: index === 0 ? 'lastyear' : `${year}`,
      Header: () =>
        <div className="header">
          <span className="year">{year}</span>
          <div className="icons">
            <Icon icon={'caret-up'} iconSize={16} />
            <Icon icon={'caret-down'} iconSize={16} />
          </div>
        </div>,
      accessor: d => d[`${year}`][`${year} ${measure}`],
      Cell: props => {
        if (props.original[`${year}`][`${year} ${measure}`] !== -1000) {
          return (
            <div className="value">
              <span>{`${numeral(props.original[`${year}`][`${year} ${measure}`]).format(
                '0.00'
              )} `}</span>
              <span>({numeral(props.original[`${year}`][`${year} Ranking`]).format('0o')})</span>
            </div>
          );
        }
        return <span />;
      },
      className: 'year'
    }));

    const columns = [columnID, columnNAME, ...columnYEARS];

    return columns.filter(f => f !== null);
  };

  handleYearSelect(key, value) {
    this.setState({
      _graphs: false
    })
    this.setState({
      [key]: value,
      _graphs: true
    });
  }

  render() {
    const {type, depth, rev} = this.props;
    const {data, columns, graphData, graphYears, graphYear, gdpData, _loading, _graphs} = this.state;

    const title = {
      eci: "Economic Complexity Rankings (ECI)",
      pci: "Product Complexity Rankings (PCI)"
    }

    const depthDict = {
      hs4: '4 Digits',
      hs6: '6 Digits'
    };

    return (
      <div className="rankings-page">
        <div className="rankings-content">
          <Helmet title={`${title[type]}`} />

          <RankingText
            type={'static'}
            title={`${title[type]}`}
            subtitleRev={rev.toUpperCase()}
            subtitleDepth={depthDict[depth]}
          />

          {_loading
            ? <Loading />
            : (<div>
              {type === "eci" && _graphs && (<div>
                <div className="settings legacy-selector">
                  <div className="selector">
                    <h4 className="first">Visualization Year: </h4>
                    <SimpleSelect
                      items={graphYears}
                      title={undefined}
                      state={"graphYear"}
                      selectedItem={graphYears.find(d => d.value === graphYear) || {}}
                      callback={(key, value) => this.handleYearSelect(key, value.value)}
                    />
                  </div>
                </div>
                <div className="graph-component">
                  <ECIgraphs
                    graphData={graphData.filter(f => f.Year === graphYear)}
                    gdpData={gdpData.filter(f => f.Year === graphYear)}
                    year={graphYear}
                  />
                </div>
              </div>)}
              {data && <RankingTable data={data} columns={columns} country={type === 'eci' ? true : false} />}
            </div>)
          }
        </div>
      </div>
    );
  }
}
