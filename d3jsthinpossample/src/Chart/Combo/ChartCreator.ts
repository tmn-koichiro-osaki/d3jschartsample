import {ComboCahartData,MaxValues,Size,Titele,Colors} from "./Types"
import { SimplePieChartCreator } from "../Pie/SimplePieChartCreator";
import * as d3 from "d3";

export class ChartCreator{
    dataset : ComboCahartData[];
    maxValues :MaxValues;
    size : Size;
    title : Titele;
    colors : Colors;
    drawing : string;

    constructor(dataset : ComboCahartData[],maxValues :MaxValues,size : Size,title : Titele,colors : Colors,drawing : string){
        this.dataset = dataset;
        this.maxValues = maxValues;
        this.size = size;
        this.title = title;
        this.colors = colors;
        this.drawing = drawing;
    }

    private GetRenderSVG() {
        let svgWidth = this.size.width + this.size.marginLeft + this.size.marginRight;
        let svgHeight = this.size.height + this.size.marginTop + this.size.marginBottom;
        let svg = d3.select("#canvas").append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .attr("viewBox", "0 0 " + svgWidth + " " + svgHeight + "")
            .attr("preserveAspectRatio", "xMidYMid");
        return svg;
    }

    //グラフレンダリング取得
    private GetRenderGraphics(svg : any) {
        return svg.append("g")
            .attr("transform", "translate(" + this.size.marginLeft + "," + this.size.marginTop + ")");
    }

    private GetXScale() {
        return d3.scaleBand()
            .rangeRound([0, this.size.width])
            .padding(0.1)
            .domain(this.dataset.map((d) => d.header));
    }

    private GetToolTip() {
        return d3.select("#canvas").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("width", "auto")
            .style("height", "auto")
            .style("background", "white")
            .style("visibility", "hidden")
            .style("opacity", "0.75");
    }

    private DrawXScale(g : any,xScale : any) {
        // axis-x x軸目盛描画
        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.size.height + ")")
            .call(d3.axisBottom(xScale) .ticks(5) .tickSize(-this.size.height)
            );
    
        let transX = -(xScale.bandwidth() / 2) - 5 ;
        d3.selectAll(".axis--x line")
            .attr("transform", "translate(" + transX + ",0)")
            .style("stroke","lightgrey")
            .style("stroke-opacity","0.7")
            .style("stroke-dasharray","4 4")
            ;
    }

    private GetYScale(maxvalue:number) {
        return d3.scaleLinear()
            .rangeRound([this.size.height, 0])
            .domain([0, maxvalue]);
    }

    private DrawYScale(g : any,yScale : any) {
        // axis-y
        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(yScale).
            tickFormat((d,i) =>{
                return '￥' + d;
            })
            .ticks(10)
            .tickSize(-this.size.width)
            );
        d3.selectAll(".axis--y line")
            .style("stroke","lightgrey")
            .style("stroke-opacity","0.7")
            .style("shape-rendering","crispEdges");
    }

    private DrawYScaleRight1(g: any,yScale: any,xposition: number,yposition: number) {
        // axis-y
        g.append("g")
            .attr("class", "axis axis--y")
            .attr('transform',"translate(" + xposition + "," + yposition + ")")
            .call(d3.axisRight(yScale).
            tickFormat((d,i) =>{
                return '￥' + d;
            })
            .ticks(10)
            .tickSize(0)
            );
    }

    private DrawYScaleRight2(g: any,yScale: any,xposition: number,yposition: number) {
        // axis-y
        let drawg = g.append("g")
            .attr("class", "axis axis--y")
            .attr('transform',"translate(" + xposition + "," + yposition + ")")
            .call(d3.axisRight(yScale).ticks(10)
            .tickSize(0)
            );
        drawg.selectAll(".domain")
            .style("color","transparent")
            ;
    }

    private DrawBarChart(bar: any,xScale: any,yScale: any,tooltip: any) {
        let height = this.size.height;

        let mouseoverCallback = (e: any,d: any) => {
            tooltip.style("visibility", "visible").html("<div id='tooltip' />");
            let creator = new SimplePieChartCreator();
            creator.Render('#tooltip');
        }

        bar.append("rect")
            .attr("x", function(d : ComboCahartData) { 
                return xScale(d.header); 
            })
            // アニメーションのために追加
            .attr("height", 0)  // 高さ0
            .attr("y", this.size.height)  // yがの位置
            .on("mouseover", mouseoverCallback)
            .on("mousemove", function(e: any) {
                tooltip
                    .style("top", (e.pageY - 20) + "px")
                    .style("left", (e.pageX + 10) + "px");
    
              })
            .on("mouseout", function(d: any) {
                tooltip
                    .style("visibility", "hidden")
              })
            .transition()  // アニメーションする
            .delay(function(d: any,i : number){
                return i * 100;
            })
            .duration(500)  // 500ミリ秒かけて以下の状態にする
            // 追加ここまで
            .attr("y", (d:ComboCahartData) => yScale(d.totalSum))
            .attr("width", xScale.bandwidth() / 2)
            .attr("transform", "translate(" + xScale.bandwidth() / 4 + "," + 0 + ")")
            .attr("height", (d:ComboCahartData) => height - yScale(d.totalSum))
            .attr("fill", this.colors.data1Color)
            .attr("class", (d:ComboCahartData) => {
                var s = "bar ";
                if (d.totalSum < 400) {
                return s + "bar1";
                } else if (d.totalSum < 800) {
                return s + "bar2";
                } else {
                return s + "bar3";
                }
            })
            ;
    }

    private DrawLineChart(bar: any,xScale: any,yScale: any,color: string,dataIndexs: number) {
        let line = d3.line<(string | number)[]>()
            .x(function(d, i) {
                 return xScale(d[0]) + xScale.bandwidth() / 2; 
                })
            .y(function(d) { 
                return yScale(d[dataIndexs]); 
                });
            //変えれそう
         let datasetForChart = this.dataset.map(d => [d.header,d.totalSum,d.totalUri,d.custumerSum]);

        bar.append("path")
            .attr("fill", "none")
            .attr("stroke", 'transparent')
            .transition()
            .duration(5000)
            .attr("stroke", color)
            .attr("class", "line") // Assign a class for styling
            .attr("d",  line(datasetForChart));
    
        bar.append("circle") // Uses the enter().append() method
            .attr("class", "dot") // Assign a class for styling
            .attr("stroke", "white")
            .data(datasetForChart)
            .attr("fill", color)
            .attr("cx", function(d: any, i: any) { 
                return xScale(d[0]) + xScale.bandwidth() / 2; 
            })
            .attr("cy", this.size.height)
            .transition()
            .delay(function(d: any,i: number){
                return i * 100;
            })
            .duration(1000)
            .attr("cy", function(d:any) {
                 return yScale(d[dataIndexs]); 
            })
            .attr("r", 3);
    }

    private DrawTitle(g:any) {

        let legendG = g.append("g");
    
        legendG.append("text")
            .attr("transform", "translate(" + - this.size.marginLeft / 2 + "," + - this.size.marginTop / 1.3 + ")")
            .attr("font-family", "Noto Sans JP")
            .attr("font-size", "16px")
            .text(this.title.title);
    
        //凡例1
        legendG.append("text")
            .attr("transform", "translate(" + - this.size.marginLeft / 2 + "," + - 25 + ")")
            .attr("font-family", "Noto Sans JP")
            .attr("font-size", "14px")
            .text(this.title.yTitle1);
            
        legendG.append('rect') // 凡例の色付け四角
            .attr("x", 0)
            .attr("y", 0)
            .attr("transform", "translate(" + - this.size.marginLeft / 2 + "," + - 20 + ")")
            .attr("width", 90)
            .attr("height", 10)
            .style("fill", this.colors.data1Color) // 色付け
    
        legendG.append("text")
            .attr("transform", "translate(" + this.size.width + "," + - 25 + ")")
            .attr("font-family", "Noto Sans JP")
            .attr("font-size", "14px")
            .text(this.title.yTitle2);
    
        legendG.append('rect') // 凡例の色付け四角
            .attr("x", 0)
            .attr("y", 0)
            .attr("transform", "translate(" + this.size.width + "," + - 20 + ")")
            .attr("width", 50)
            .attr("height", 10)
            .style("fill", this.colors.data2Color) // 色付け
    
        let margin3 = this.size.width + this.size.margin2_3;
        legendG.append("text")
            .attr("transform", "translate(" + margin3 + "," + - 25 + ")")
            .attr("font-family", "Noto Sans JP")
            .attr("font-size", "14px")
            .text(this.title.yTitle3);
    
        legendG.append('rect') // 凡例の色付け四角
            .attr("x", 0)
            .attr("y", 0)
            .attr("transform", "translate(" + margin3 + "," + - 20 + ")")
            .attr("width", 30)
            .attr("height", 10)
            .style("fill", this.colors.data3Color) // 色付け
    }

    DrawChart(){
        let svg = this.GetRenderSVG();
        //ツールチップ
        let tooltip = this.GetToolTip();
        //描画用g取得
        let g = this.GetRenderGraphics(svg);
        
        //ｘ軸 定義 0番目データ使用
        let xScale = this.GetXScale();
        //axis-x x軸目盛描画
        this.DrawXScale(g,xScale);
        //y軸 定義 1番目データ使用
        let yScale = this.GetYScale(this.maxValues.maxValue1);
        //y軸 描画
        this.DrawYScale(g,yScale);
        //y軸2
        let yScale2 = this.GetYScale(this.maxValues.maxValue2);
        //y軸2描画
        this.DrawYScaleRight1(g,yScale2,this.size.width,0);
        //y軸3
        let yScale3 = this.GetYScale(this.maxValues.maxValue3);
        //y軸3描画
        this.DrawYScaleRight2(g,yScale3,this.size.width + this.size.margin2_3,0);
        //グラフ描画の取得
        let bar = g.selectAll("rect")
            .data(this.dataset)
            .enter().append("g");
        
        //bar chart描画
        this.DrawBarChart(bar,xScale,yScale,tooltip);
        //line chart1描画
        this.DrawLineChart(bar,xScale,yScale2,this.colors.data2Color,2);
        //line chart2描画
        this.DrawLineChart(bar,xScale,yScale3,this.colors.data3Color,3);
        //タイトル
        this.DrawTitle(g);
    }
}