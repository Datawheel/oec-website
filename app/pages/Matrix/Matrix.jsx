import axios from "axios";
import React from "react";

class Matrix extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      matrix: false
    };
  }

  componentDidMount() {
    axios.get("/api/matrix").then(resp => {
      this.setState({matrix: resp.data});
    });
  }

  render() {

    const {matrix} = this.state;

    if (!matrix) return null;

    return (
      <div className="matrix-page">
        <h3>Data Availability Matrix</h3>
        <table>
          <tr>
            <th>CubeName</th>
            <th>Geo Resolution</th>
            <th>Product Resolution</th>
            <th>Time Resolution</th>
            <th>Data Start</th>
            <th>Data End</th>
          </tr>
          {matrix.map(row => 
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>{row.resolutions.geography || "-"}</td>
              <td>{row.resolutions.product || "-"}</td>
              <td>{row.resolutions.time}</td>
              <td>{row.start}</td>
              <td>{row.end}</td>
            </tr>
          )}
        </table>
      </div>
    );
  }
}

export default Matrix;
