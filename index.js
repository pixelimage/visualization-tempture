
/* ----------------------------------------------------------
setting
---------------------------------------------------------- */

var placeList = {
	sapporo:["SAPPORO","札幌",[1900,2017]],
	kumagaya:["KUMAGAYA","熊谷",[1910,2017]],
	tokyo:["TOKYO","東京",[1900,2017]],
	nagoya:["NAGOYA","名古屋",[1910,2017]],
	osaka:["OSAKA","大阪",[1900,2017]],
	naha:["NAHA","那覇",[1957,2017]],
	syowa:["SYOWA","那覇",[1967,2017]]
}
var parma = _.assignIn({spot:"osaka"} ,getQuery());
var place = placeList[parma["spot"]]

var file = "data/"+ place[0].toLowerCase()+".tsv"
// var file = "data/"+ place[0].toLowerCase()+"/1900-2017_temp-av.csv"
// var file2 = "data/"+ place[0].toLowerCase()+"/1900-2017_temp-hi.csv"

var yearParam = {
	start:place[2][0],
	end:place[2][1],
	leng:place[2][1] - place[2][0]
}
var unit = 12*3;
var distance = 450/ unit;
var offset = 0;
var svg = d3.select("svg")


//axis
var scale = d3.scaleLinear().domain([-5, 35]).range([300, 0])
var yAxis = d3.axisLeft( scale ).ticks(10).tickSize(-440).tickFormat("")
var yAxis2 = d3.axisLeft( scale ).ticks(10)

var g = svg.append("g").attr("transform","translate(40,140)")
	g.append("g").attr("class", "axis").call(yAxis)
	g.append("g").attr("class", "axis").call(yAxis2)

//path
var pathH = g.append("path").style("fill", "#f80").style("opacity", "0.2");
var path = g.append("path").style("fill", "url(#Gradient)")
var path1900 = g.append("path").attr("class","stroke1");
var pathYears = g.append("path").attr("class","stroke3");
var pathYears2 = g.append("path").attr("class","stroke4");

//text
svg.append("rect").attr("width","100%").attr("height",35).attr("class","title_bg")
svg.append("text").attr("x",20).attr("y",25).attr("class","t_title").html(place[1]+"の平均気温の推移<tspan>（"+yearParam.start+"年〜"+yearParam.end+"年）</tspan>");
svg.append("text").attr("x",20).attr("y",485).attr("class","t_note").text("※気象庁の統計データを利用しています。")
svg.append("text").attr("x",20).attr("y",130).attr("class","t_note").text("(°C)")
svg.append("text").attr("x",120).attr("y",420).attr("class","t_graf_white").text("― "+yearParam.start+"年平均気温")

var yearText = svg.append("text").attr("transform","translate(20,105)").attr("class","t_year")
	.html("<tspan>" + place[0] + "</tspan>")
var gText = svg.append("g").attr("transform","translate(50,462)")
for (var i = 0; i < 12 ; i++) {
	gText.append("text").attr("x",distance*2.9*i).attr("class","t_month").text((i+1)+"月")
}

var legendVals = ["最高気温","平均気温"] ;
var color = ["#fae8d1","red"];
var gLegend = d3.select("svg").append("g")
		.attr("transform","translate(410,125)");

var legs = gLegend.selectAll('.legends')
		.data(legendVals)
		.enter().append('g')
		.attr("class", "legends")
		.attr("transform", function (d, i) {{return "translate(0," + i * 20 + ")"}});

	legs.append('rect')
		.attr("x", 0).attr("y", 2).attr("width",8).attr("height", 8)
		.style("fill", function (d, i) { return color[i]; })

	legs.append('text')
		.attr("x", 15).attr("y", 10)
		.text(function (d, i) { return d ; })
		.attr("class", "textselected")
		.style("text-anchor", "start")
		.style("font-size", 12)

/* ----------------------------------------------------------
loadData
---------------------------------------------------------- */
// var loadCount = 2;
var data;
// var data2;
d3.tsv(file).then(function(_data) {
	data = _data;
		start();
	// loadCount --
	// loadedData();
});
// d3.csv(file2).then(function(_data) {
// 	data2 = _data;
// 	loadCount --
// 	loadedData();
// });
//
// function loadedData(){
// 	if(loadCount == 0){
// 		start();
// 	}
// }

/* ----------------------------------------------------------
update
---------------------------------------------------------- */
var hh = 300 / 40;
function update(_data,_data2,_off){
	var d3line = d3.area()
	  .x(function(d,i){return (distance * i) ;})
	  .y0(function(d,i) { return 300 - (hh * (Number(d)+5));})
	  .y1(function(d,i) { return 300 ; })
    .curve(d3.curveBasis);
		if(state == "running"){
			yearText.html("<tspan>" + place[0] + "</tspan> " + (_off + yearParam.start))
		}
	path.transition().duration(speed).attr("d", d3line(_data))
	pathH.transition().duration(speed).attr("d", d3line(_data2))

	if(_off == 0){
		var d3line2 = d3.line()
			.x(function(d,i){return (distance * i) ;})
			.y(function(d,i) { return 300 - (hh * (Number(d)+5));})
	    .curve(d3.curveBasis);
		path1900.attr("d", d3line2(_data))
	}

	if(_off >= 0){
		var tarManth = (7-1) * 3;
		var av = (
			Number(_data[tarManth+0]) + Number(_data[tarManth+1]) + Number(_data[tarManth+2]) +
			Number(_data[tarManth+4]) + Number(_data[tarManth+5]) + Number(_data[tarManth+6])
		) / 6 ;
		var hi = (
			Number(_data2[tarManth+0]) + Number(_data2[tarManth+1]) + Number(_data2[tarManth+2])+
			Number(_data2[tarManth+4]) + Number(_data2[tarManth+5]) + Number(_data2[tarManth+6])
		) / 6 ;
		if(_off == 0){
			svg.append("text").attr("x",50).attr("y", 445 - (hh * (av+5)) ).attr("class","t_av_1900").text(yearParam.start+"年")
			svg.append("text").attr("x",50).attr("y", 410 - (hh * (av+5)) ).attr("class","t_av_1900").text("7,8月平均")
			svg.append("text").attr("x",50).attr("y", 425 - (hh * (av+5)) ).attr("class","t_av_1900").text("の推移")
		}
		if(_off == yearParam.leng){
			svg.append("text").attr("x",195).attr("y", 445 - (hh * (av+5)) ).attr("class","t_av_1900").text(yearParam.end+"年")
		}
		stacData.push(av)
		stacData2.push(hi)
		var d3line3 = d3.line()
			.x(function(d,i){return (50 + (100/yearParam.leng)*i) ;})
			.y(function(d,i) { return 300 - (hh * (Number(d)+5));})
	    .curve(d3.curveBasis);
		pathYears.attr("d", d3line3(stacData))
		pathYears2.attr("d", d3line3(stacData2))
	}
}
var stacData =[]
var stacData2 =[]

var speed = 500;
var state = "init";
function start(){
	var dd = []
	var dd2 = []
	for (var i = 0; i < unit ; i++) {
		dd.push(0);
		dd2.push(0);
	}
	update(dd,dd2,-1);
	new serial_([
		function () { }
		,0.3, function () {
			var yy = 0;
			var tID_pre = setInterval(function(){
					yy += (yearParam.start - yy) * 0.4;
					yearText.html("<tspan>" + place[0] + "</tspan> " + Math.round(yy))
					if(Math.round(yy) >= yearParam.start){
						clearInterval(tID_pre);
					}
			},30);
				next()
		}
		,1.5, function () {
			 state = "running";
			speed = 100
			var tID = setInterval(function(){
				if(offset <= yearParam.leng){
					next()
				} else{
					clearInterval(tID);
				}
				offset ++;
			},100);
		}
	]).start();
}

function next(){
	var dd = []
	var dd2 = []
	for (var i = 0; i < unit ; i++) {
		var nn = (offset * unit) + i;
		if(data[nn]){
			if(data[nn].av){
				dd.push(data[nn].av);
			} else{
				dd.push(0);
			}
			if(data[nn].hi){
				dd2.push(data[nn].hi);
			} else{
				dd2.push(0);
			}
		}
	}
	update(dd,dd2,offset);
}

//データ
//https://www.data.jma.go.jp/gmd/risk/obsdl/index.php

