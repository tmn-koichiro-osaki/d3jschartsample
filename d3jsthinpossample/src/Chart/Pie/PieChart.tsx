import React from "react";
import Top from "../../Top";
import { PieChartCreator } from "./PieChartCreator";

let dataset = [
    { label: 'クレジット', value: 50 },
    { label: '電子マネー', value: 30 },
    { label: 'QRコード', value: 20 },
  ]

let size = {
    width: 600,
    height: 500
}

let colors = ["#6080EA", "#01C89F", "#F28400"];

class PieChart extends React.Component{
    componentDidMount() {
        let creator = new PieChartCreator(dataset,size,"支払い種別構成比",colors,'#canvas')
        creator.DrawChart();
      }
    render() {                          
        return (
            <div >
                <Top/>
                <div id='canvas' />
            </div>
          );
    }
}

export default PieChart;