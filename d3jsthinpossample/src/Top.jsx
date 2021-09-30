import React from "react";
import { Link } from "react-router-dom";

class Top extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Link to="/">Top</Link>
        </div>
        <div>
          <Link to="/combochart">ComboChart</Link>
        </div>
        <div>
          <Link to="/piechart">PieChart</Link>
        </div>
      </div>
    );
  }
}

export default Top;
