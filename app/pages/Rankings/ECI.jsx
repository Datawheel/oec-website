import React, {Component} from 'react';
import Helmet from "react-helmet";
import axios from 'axios';

import RankingText from 'components/RankingText';
import RankingTable from 'components/RankingTable';

import {range} from 'helpers/utils';

export default class ECI extends Component {
  state = {
    data: null,
  }

  fetchData = (path, type) => {
    const {depth} = this.props;
    let data = [];
    axios.get(path).then((resp) => {
      const pathData = resp.data.data;
      const measure = type === "eci" ? 'Country' : depth.toUpperCase();
      // Get list of unique countries/products
      const unique = [...new Set(pathData.map((m) => m[measure + ' ID']))];
      const uniqueYears = [...new Set(pathData.map((m) => m.Year))];
      const maxYear = Math.max(...uniqueYears);
      const minYear = Math.min(...uniqueYears);

      // Set ranking for countries that don't have in max year
      const maxYearDataLength = pathData.filter(f => f.Year === maxYear).length;
      let flag = 1;

      for (const index in unique) {
        const rowData = pathData.filter(f => f[measure + ' ID'] === unique[index]);
        let row = {};
        row[measure] = rowData[0][measure];
        row[measure + ' ID'] = unique[index];
        rowData.forEach(d => {
          let values = {};
          values[d.Year + ' ' + `${type}`.toUpperCase()] = d[`${type}`.toUpperCase()];
          values[d.Year + ' Ranking'] = d[`${type}`.toUpperCase() + ' Rank'];
          row[`${d.Year}`] = values;
        });
        // Add non values to rows
        range(minYear, maxYear).map(d => {
          if (!row[d]) {
            if (d !== maxYear) {
              let values = {};
              values[d + ' ' + `${type}`.toUpperCase()] = -1000;
              values[d + ' Ranking'] = null;
              row[`${d}`] = values;
            } else {
              let values = {};
              values[d + ' ' + `${type}`.toUpperCase()] = -1000;
              values[d + ' Ranking'] = maxYearDataLength + flag;
              row[`${d}`] = values;
              flag = flag + 1;
            }
          }
        });
        data.push(row);
      };
      data && data.sort((a,b) => a[maxYear][`${maxYear} Ranking`] - b[maxYear][`${maxYear} Ranking`]);
    });

    this.setState({
      data
    })
  };

  componentDidMount() {
    const {type, depth, rev} = this.props;
    let path = null;
    if (type === 'eci') {
      path = `/olap-proxy/data.jsonrecords?cube=complexity_${type}_a_${rev}_${depth}&drilldowns=Country,${type.toUpperCase()}+Rank,Year&measures=${type.toUpperCase()}&parents=false&sparse=false`;
    } else {
      path = `/olap-proxy/data.jsonrecords?cube=complexity_${type}_a_${rev}_${depth}&drilldowns=${depth.toUpperCase()},${type.toUpperCase()}+Rank,Year&measures=${type.toUpperCase()}&parents=false&sparse=false`;
    }
    this.fetchData(path, type);
  }

  render() {
    const {data} = this.state;
    data && console.log("data", data);
    return (
      <div className="rankings-page">
        <div className="rankings-content">
          <Helmet title="2018 ECI Rankings" />

          <RankingText type={'static'} title={"ECI Ranking"} />


        </div>
      </div>
    );
  }
}
