import * as d3 from "d3";

export class SimplePieChartCreator {
  //ドリルダウン想定の実験のため、ただの決め打ち
  Render(selector: string) {
    //仮
    let aValue = Math.floor(Math.random() * (50 + 1 - 10)) + 10;
    let bValue = Math.floor(Math.random() * (50 + 1 - 10)) + 10;
    let cValue = 100 - aValue - bValue;

    // 1. データの準備
    let tooltipDataset: any = [
      { label: "クレジット", value: aValue },
      { label: "電子マネー", value: bValue },
      { label: "QRコード", value: cValue },
    ];

    let width = 200; // グラフの幅
    let height = 200; // グラフの高さ
    let radius = Math.min(width, height) / 2;

    // 2. SVG領域の設定
    let svg = d3
      .select(selector)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    let g = svg
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    /* 
        // 3. カラーの設定
        let color = d3.scaleOrdinal().range(["#6080EA", "#01C89F", "#F28400"]); */

    // 4. pieチャートデータセット用関数の設定
    let pie = d3
      .pie()
      .value(function (d: any) {
        return d.value;
      })
      .sort(null);

    // 5. pieチャートSVG要素の設定
    let pieGroup = g
      .selectAll(".pie")
      .data(pie(tooltipDataset))
      .enter()
      .append("g")
      .attr("class", "pie");

    let arc: any = d3
      .arc()
      .outerRadius(radius)
      .innerRadius(radius / 1.75);
    let colorPallet = ["#6080EA", "#01C89F", "#F28400"];

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
    let text = d3
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
      .attr("font", "8px")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(function (d: any) {
        return d.data.value + "%";
      });
  }
}
