import * as d3 from "d3";
import { PieChartData, Size } from "./Types";

export class PieChartCreator {
  dataset: PieChartData[];
  size: Size;
  title: string;
  colors: string[];
  drawing: string;

  constructor(
    dataset: PieChartData[],
    size: Size,
    title: string,
    colors: string[],
    drawing: string
  ) {
    this.dataset = dataset;
    this.size = size;
    this.title = title;
    this.colors = colors;
    this.drawing = drawing;
  }

  DrawChart() {
    var width = this.size.width; // グラフの幅
    var height = this.size.height; // グラフの高さ
    var radius = Math.min(width / 2, height / 2) / 2 - 10;

    // 2. SVG領域の設定
    var svg = d3
      .select(this.drawing)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    //タイトル追加
    svg
      .append("text")
      .attr("x", 180)
      .attr("y", 18)
      .attr("font-size", "16px")
      .style("text-anchor", "start")
      .text(this.title);

    let g = svg
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2.5 + ")");

    // 3. カラーの設定
    var color = d3.scaleOrdinal().range(["#6080EA", "#01C89F", "#F28400"]);

    // 4. pieチャートデータセット用関数の設定
    var pie = d3
      .pie<PieChartData>()
      .value(function (d: PieChartData) {
        return d.value;
      })
      .sort(null);

    // 5. pieチャートSVG要素の設定
    var pieGroup = g
      .selectAll(".pie")
      .data(pie(this.dataset))
      .enter()
      .append("g")
      .attr("class", "pie");

    let arc: any = d3
      .arc()
      .outerRadius(radius)
      .innerRadius(radius / 1.75);
    let colorPallet = this.colors;
    pieGroup
      .append("path")
      .attr("d", arc)
      .attr("fill", function (d, i) {
        let index = i % colorPallet.length;
        return colorPallet[index];
      })
      .attr("opacity", 0.75)
      .attr("stroke", "white")
      .attr("stroke-width", 5);

    // 6. pieチャートテキストSVG要素の設定
    var text = d3
      .arc()
      .outerRadius(radius - 30)
      .innerRadius(radius - 30);

    pieGroup
      .append("text")
      .attr("fill", "black")
      .attr("transform", function (d: any) {
        return "translate(" + text.centroid(d) + ")";
      })
      .attr("dy", "5px")
      .attr("font", "10px")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(function (d) {
        return d.data.value + "%";
      });

    // 凡例名称
    var legendVals = this.dataset.map((item) => item.label);
    // 凡例の色（d3の10色作成）

    //var svgLegned = d3.select(".legend-div").append("svg");  // 描画svg作成

    var legend = svg
      .selectAll(".legends") // 凡例の領域作成
      .data(legendVals)
      .enter()
      .append("g")
      .attr("class", "legends")
      .attr("transform", function (d, i) {
        {
          let x = 180;
          let y = 40;
          if (i % 2 == 1) {
            x = 300;
            y = (i - 1) * 20 + y;
          } else {
            y = (i / 2) * 20 + y;
          }

          return "translate(" + x + "," + y + ")"; // 各凡例をy方向に20px間隔で移動
        }
      });

    legend
      .append("rect") // 凡例の色付け四角
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function (d, i) {
        let index = i % colorPallet.length;
        return colorPallet[index];
      }); // 色付け

    legend
      .append("text") // 凡例の文言
      .attr("x", 20)
      .attr("y", 10)
      .text(function (d, i) {
        return d;
      })
      .attr("class", "textselected")
      .style("text-anchor", "start")
      .style("font-size", 15);
  }
}
