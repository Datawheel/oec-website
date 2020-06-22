import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import {connect} from "react-redux";
import {fetchData} from "@datawheel/canon-core";
import {titleCase} from "d3plus-text";
import "./DataMatrix.css";

class DataMatrix extends Component {

  render() {
    const {matrix} = this.props;

    if (!matrix) return null;

    // annotate subnational cubes to indicate which datasets are available now
    const availableSubnatDatasets = [
      "trade_s_bra_mun_m_hs",
      "trade_s_bra_ncm_m_hs",
      "trade_s_can_m_hs",
      "trade_s_chn_m_hs",
      "trade_s_deu_m_egw",
      "trade_s_jpn_m_hs",
      "trade_s_rus_m_hs",
      "trade_s_zaf_m_hs",
      "trade_s_esp_m_hs",
      "trade_s_gbr_m_hs",
      "trade_s_usa_state_m_hs",
      "trade_s_usa_district_m_hs",
      "trade_s_usa_port_m_hs"
    ];
    matrix.subnational.products = matrix.subnational.products.map(d => ({...d, availableNow: availableSubnatDatasets.includes(d.cubeName)}));

    return (
      <div className="data-matrix">
        {Object.keys(matrix).map(nation =>
          <div key={nation}>
            <h2 className="data-matrix-group-title">{titleCase(nation)} Datasets</h2>
            {Object.keys(matrix[nation]).map(group =>
              <div key={group}>
                <table className="data-matrix-table">
                  <thead>
                    <tr>
                      <th className="data-matrix-table-title" colSpan={4}>{titleCase(group)}</th>
                    </tr>
                    <tr>
                      <th>Dataset</th>
                      <th>Location Resolution</th>
                      <th>Product Classification</th>
                      <th>Time Span</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matrix[nation][group].map(cube =>
                      <tr key={cube.name} className={cube.availableNow === false ? "coming-soon" : "available-now"}>
                        <td>{cube.fullName}</td>
                        <td>{cube.resolutions.geography || "-"}</td>
                        <td>{cube.resolutions.product || "-"}</td>
                        <td>{`${cube.start} - ${cube.end} (${cube.resolutions.time})`}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

DataMatrix.need = [
  fetchData("datamatrix", "/api/matrix")
];

export default connect(state => ({matrix: state.data.datamatrix}))(hot(DataMatrix));
