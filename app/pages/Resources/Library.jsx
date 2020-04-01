import React, { Component } from 'react';
import axios from "axios";

class Library extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      headers: []
     };
  }

  fetchData = () => {
      axios.get("/api/library")
      .then(resp => {
        this.setState({ data: resp.data.data, headers: resp.data.headers})
      });
  };

  componentDidMount() {
    this.fetchData();
  }

  render() {
    const {data, headers} = this.state;
    console.log("DATA:", data);
    console.log("HEADERS:", headers);

    return (
      <div className="library">
        <h1>Library</h1>
      </div>
    );
  }
}

export default Library;
