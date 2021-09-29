import React from "react";
import Top from "../../Top";
import {ComboCahartData,MaxValues} from "./Types";
import {ChartCreator} from "./ChartCreator";

let dataset : ComboCahartData[] =
[
    {header : '10～11:00', totalSum : 10000 , totalUri : 10000 , custumerSum : 7},
    {header : '11～12:00', totalSum : 40000 , totalUri : 10000 , custumerSum : 10},
    {header : '12～13:00', totalSum : 120000 , totalUri : 30000 , custumerSum : 18},
    {header : '13～14:00', totalSum : 190000 , totalUri : 90000 , custumerSum : 19},
    {header : '14～15:00', totalSum : 210000 , totalUri : 70000 , custumerSum : 15},
    {header : '15～16:00', totalSum : 230000 , totalUri : 20000 , custumerSum : 13},
    {header : '16～17:00', totalSum : 370000 , totalUri : 140000 , custumerSum : 28},
    {header : '17～18:00', totalSum : 450000 , totalUri : 80000 , custumerSum : 21},
    {header : '18～19:00', totalSum : 550000 , totalUri : 100000 , custumerSum : 19},
    {header : '19～20:00', totalSum : 650000 , totalUri : 100000 , custumerSum : 13},
    {header : '20～21:00', totalSum : 680000 , totalUri : 30000 , custumerSum : 3},
    {header : '21～22:00', totalSum : 700000 , totalUri : 20000 , custumerSum : 3},
    {header : '22～23:00', totalSum : 710000 , totalUri : 10000 , custumerSum : 2}
];

let maxValues :MaxValues = {
    maxValue1 : 800000,
    maxValue2 : 160000,
    maxValue3 : 40
};

//サイズ
let size = {
    width: 1050,
    height: 300,
    marginTop: 100,
    marginRight: 200,
    marginBottom: 50,
    marginLeft: 100,
    //Y軸2-3の間
    margin2_3: 75
};
/* let width = 1050;
let height = 300;
let margin = {top: 100, right: 200, bottom: 50, left: 100};
//2-3のマージン
let margin2_3 = 75; */
//タイトル
let title = {
    title: '時間帯別売上高',
    yTitle1: '純売上（累計）',
    yTitle2: '純売上',
    yTitle3: '客数',
}
/* let title = '時間帯別売上高';
let yTitle1 = '純売上（累計）';
let yTitle2 = '純売上';
let yTitle3 = '客数'; */
//カラー
let color = {
    data1Color: '#2963C1',
    data2Color: '#FBA738',
    data3Color: '#01C89F',
}
/* let data1Color = '#2963C1';
let data2Color = '#FBA738';
let data3Color = '#01C89F'; */



class ComboChart extends React.Component{
    renderchart(){
        let creator = new ChartCreator(dataset,maxValues,size,title,color,'#canvas');
        creator.DrawChart();
    }
    render() {                          
        return (
            <div >
                <Top/>
                <button onClick={this.renderchart}>render chart</button>
                <div id='canvas' onLoad={this.renderchart} />
            </div>
          );
    }
}

export default ComboChart;