/* eslint-disable quotes */
import React, {Component} from 'react';
import Helmet from "react-helmet";
import {Route} from "react-router"
import axios from 'axios';
import numeral from 'numeral';
import {Icon} from '@blueprintjs/core';
import {AnchorButton, Button, ButtonGroup} from '@blueprintjs/core';

import {range} from 'helpers/utils';

import Loading from 'components/Loading';
import RankingText from 'components/RankingText';
import RankingTable from 'components/RankingTable';

export default class Legacy extends Component {
  state = {
    type: null,
    depth: null,
    rev: null,
    data: null,
    columns: null,
    _loading: true
  }

  componentDidMount = () => {
    const {type, depth, rev} = this.props;
    const path = this.pathCreator(type, depth, rev);
    this.fetchData(path, type, depth, rev);
  }

  componentDidUpdate = (prevProps, prevState) => {
    const {type, depth, rev} = this.props;
    if (type !== prevProps.type || depth !== prevProps.depth || rev !== prevProps.rev) {
      const path = this.pathCreator(type, depth, rev);
      this.fetchData(path, type, depth, rev);
    }
  }

  pathCreator = (type, depth, rev) => {
    let path = null;
    if (type === 'eci') {
      path = `/olap-proxy/data.jsonrecords?cube=legacy_complexity_eci_a&drilldowns=Country,Year&measures=ECI&parents=false&sparse=false`;
    }
    else {
      path = `/olap-proxy/data.jsonrecords?cube=legacy_complexity_pci_a_${rev}_${depth}&drilldowns=Year,${depth.toUpperCase()}&measures=PCI&parents=false&sparse=false`;
    }
    return path;
  }

  fetchData = (path, type, depth, rev) => {
    const data = [];
    this.setState({_loading: true, data: []});
    axios.get(path).then(resp => {
      const pathData = resp.data.data;
      // Country, HS4, HS6
      const measure = type === "eci" ? 'Country' : depth.toUpperCase();
      // Get list of unique countries/products
      const unique = [...new Set(pathData.map(m => m[`${measure} ID`]))];
      const uniqueYears = [...new Set(pathData.map(m => m.Year))];
      const maxYear = Math.max(...uniqueYears);
      const minYear = Math.min(...uniqueYears);

      // eslint-disable-next-line guard-for-in
      for (const index in unique) {
        const rowData = pathData.filter(f => f[`${measure} ID`] === unique[index]);
        const row = {};
        row[measure] = rowData[0][measure];
        row[`${measure} ID`] = unique[index];
        rowData.forEach(d => {
          const values = {};
          values[`${d.Year} ${`${type}`.toUpperCase()}`] = d[`${type}`.toUpperCase()];
          row[`${d.Year}`] = values;
        });
        // Add non values to rows
        range(minYear, maxYear).map(d => {
          if (!row[d]) {
            if (d !== maxYear) {
              const values = {};
              values[`${d} ${`${type}`.toUpperCase()}`] = -1000;
              row[`${d}`] = values;
            }
            else {
              const values = {};
              values[`${d} ${`${type}`.toUpperCase()}`] = -1000;
              row[`${d}`] = values;
            }
          }
        });
        data.push(row);
      }
      data.sort((a, b) => b[maxYear][`${maxYear} ${`${type}`.toUpperCase()}`] - a[maxYear][`${maxYear} ${`${type}`.toUpperCase()}`]);

      const columns = this.createColumns(type, depth, rev, minYear, maxYear);

      this.setState({
        type,
        depth,
        rev,
        data,
        columns,
        _loading: false
      });
    });
  };

  createColumns = (type, depth, rev, initialYear, finalYear) => {
    const columnID = {
      id: 'ranking',
      Header: '',
      className: 'col-id',
      Cell: props => props.index + 1,
      width: 40,
      sortable: false
    };

    let columnNAME = {};

    if (type === "eci") {
      columnNAME = {
        id: 'category',
        accessor: d => d.Country,
        width: 400,
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

  handleOnClick = (change, value, keep) => {
    let path = null;
    if (change === "depth") {
      path = `/en/rankings/legacy_pci/${value.toLowerCase()}/${keep}`;
    } else {
      path = `/en/rankings/legacy_pci/${keep}/${value.toLowerCase()}`;
    }
    return <Route path={path} />;
  }

  render() {
    const {type, depth, rev} = this.props;
    const {data, columns, _loading} = this.state;

    const title = {
      eci: "Economic Complexity Legacy Rankings (ECI)",
      pci: "Product Complexity Legacy Rankings (PCI)"
    }

    const depthOptions = ["HS4", "HS6"];
    const revOptions = ["HS92", "HS96", "HS02", "HS07"];

    return (
      <div className="rankings-page">
        <div className="rankings-content">
          <Helmet title={`${title[type]}`} />

          <RankingText type={'legacy'} title={`${title[type]}`} subtitle={type} />

          {!_loading && type === "pci" && (
            <div className="settings legacy-selector">
              <div className="selector">
                <h4 className="first">Depth: </h4>
                <ButtonGroup fill={true}>
                  {depthOptions.map((d, k) =>
                    <AnchorButton
                      key={k}
                      className={depth.toUpperCase() === d && 'active'}
                      text={d}
                      href={`/en/rankings/legacy_pci/${d.toLowerCase()}/${rev}`}
                    />
                  )}
                </ButtonGroup>
              </div>
              <div className="selector">
                <h4>Rev: </h4>
                <ButtonGroup fill={true}>
                  {revOptions.map((d, k) =>
                    <AnchorButton
                      key={k}
                      className={depth.toUpperCase() === d && 'active'}
                      text={d}
                      href={`/en/rankings/legacy_pci/${depth}/${d.toLowerCase()}`}
                    />
                  )}
                </ButtonGroup>
              </div>
            </div>
          )}

          {_loading ? <Loading /> : data && <RankingTable data={data} columns={columns} country={type === 'eci' ? true : false} />}
        </div>
      </div>
    );
  }
}
