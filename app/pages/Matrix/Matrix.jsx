import axios from "axios";
import React from "react";

const cap = s => s && typeof s === "string" ? s.charAt(0).toUpperCase() + s.slice(1) : s;

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
        <h1>Data Availability Matrix</h1>
        {Object.keys(matrix).map(nation => 
          <div key={nation}>
            <h2>{cap(nation)}</h2>
            {Object.keys(matrix[nation]).map(group => 
              <div key={group}>
                <h3>{cap(group)}</h3>
                <table border="1">
                  <tr>
                    <th>Dataset</th>
                    <th>Geo Resolution</th>
                    <th>Product Resolution</th>
                    <th>Time Resolution</th>
                    <th>Data Start</th>
                    <th>Data End</th>
                  </tr>
                  {matrix[nation][group].map(cube => 
                    <tr key={cube.name}>
                      <td>{cube.fullName}</td>
                      <td>{cube.resolutions.geography || "-"}</td>
                      <td>{cube.resolutions.product || "-"}</td>
                      <td>{cube.resolutions.time}</td>
                      <td>{cube.start}</td>
                      <td>{cube.end}</td>
                    </tr>
                  )}
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Matrix;
