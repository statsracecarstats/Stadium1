
// set up basic SVG canvase use internet preffered margin set up (i follow the pack)
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 900 - margin.left - margin.right,
    height = 2200 - margin.top - margin.bottom;

	
var canvas = d3.select(".SCATTER").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom);

// Pixel max and min for range				
var Rmin = 30;
var Rmax = 600;
// where Tline goes
var YTline = 90;
//global variables for us in funcitons
var ID;
var ID2;
				
//load data set in d3.csv				
d3.csv("https://raw.githubusercontent.com/pacunningham821/Stadium1/master/Data_Set2_NBA.csv").then(function(data){
	
	var CapMax = d3.max(data, function(d) {return parseFloat(d.Capacity);});
	var CapMin = d3.min(data, function(d) {return parseFloat(d.Capacity);});
	var YeaMax = d3.max(data, function(d) {return parseFloat(d['Year.opened'])+2;});
	var YeaMin = d3.min(data, function(d) {return parseFloat(d['Year.opened']);});
	var CosMax = d3.max(data, function(d) {return parseFloat(d.Cost1_Inflation);});
	var CosMin = d3.min(data, function(d) {return parseFloat(d.Cost1_Inflation);});
	//set scale for x-axis based on year
	var scaleX = d3.scaleLinear()
		.domain([YeaMin,YeaMax])
		.range([Rmin,Rmax]);
	//set scale for y-axis based on cost
	var scaleY = d3.scaleLinear()
		.domain([CosMin,CosMax])
		.range([Rmax, Rmin]);
	// set scale for radius based on capacity
	var scaleR = d3.scaleLinear()
		.domain([CapMin,CapMax])
		.range([4, 11]);
	// Line fucntion 
	var line = d3.line()
		.x(function(d) {return d.x;})
		.y(function(d) {return d.y;});
	// Time Line Path
	var tline = [{"x": Rmin, "y": YTline}, 
				 {"x": Rmax, "y": YTline},
				 {"x": Rmax, "y": YTline+5},
				 {"x": Rmax+10, "y": YTline},
				 {"x": Rmax, "y": YTline-5},
				 {"x": Rmax, "y": YTline}
				 ];
	// bind data
	var circle = canvas.selectAll("circle")
		.data(data);
		
	// Create Time Line
	canvas.append("path")
		.attr("d", line(tline))
		.attr("Stroke-width", 2.5)
		.attr("stroke", d3.rgb(80,80,80))
		.attr("id", "Tline");
	
	circle.enter().append("circle")
		.attr("cx", function(d) {return scaleX(parseFloat(d['Year.opened']));})
		.attr("cy", function(d) {return YTline-parseInt(d['Height Correct'])*10})
		.attr("id", function(d) {return d.ID+"TT";})
		.attr("r", 7)
		.attr("fill", d3.rgb(93,161,216))
		.on("mouseover", handleMouseOver)
		.on("mouseout", handleMouseOut);
	
	
	//create scatter points using scale. year vs capacity	
	circle.enter().append("circle")
		.attr("cx", function(d) {return scaleX(parseFloat(d['Year.opened']));})
		.attr("cy", function(d) {return scaleY(parseFloat(d.Cost1_Inflation))+YTline+5;})
		.attr("r", function(d) {return scaleR(parseFloat(d.Capacity));})
		.attr("id", function(d) {return d.ID;})
		.attr("fill", d3.rgb(93,161,216))
		.on("mouseover", handleMouseOver)
		.on("mouseout", handleMouseOut)
		
	//build axis
	var Xaxis = d3.axisBottom(scaleX).tickFormat(d3.format("d"));
	var Yaxis = d3.axisLeft(scaleY);
	
	canvas.append("a")
		.attr("class", "axis")
		.attr("transform", "translate(0,"+ (Rmax + YTline + 5) + ")")
		.call(Xaxis);
	
	canvas.append("a")
		.attr("class", "axis")
		.attr("transform", "translate(" + (Rmin) +"," + (YTline + 5) + ")")
		.call(Yaxis);
	
	
});

// create histogram from file
d3.csv("https://raw.githubusercontent.com/pacunningham821/Stadium1/master/NBA_Cost_Hist.csv").then(function(hist){
	
	
});

		

function handleMouseOver(d) {
		ID = d3.select(this).attr("id")
		if (ID.substr(ID.length-2,2)=="TT"){
			ID2 = ID.substr(0,ID.length-2);
		} else {
			ID2 = ID + "TT";
		}
		console.log(ID);
		console.log(ID2);
		
		var X = parseInt(d3.select(this).attr("cx"));
		var Y = parseInt(d3.select(this).attr("cy"));
		
		d3.select("#"+ID).attr("fill", d3.rgb(244,161,66));
		
		d3.select("#" + ID2).attr("fill", d3.rgb(244,161,66));
		
		canvas.append("text")
			.attr("x", X + 7)
			.attr("y", Y - 7)
			.attr("id", "TXT0")
			.text("(" + d['Year.opened'] + ", " + d.Cost1_Inflation*1000000 + ")");
			
		canvas.append("text")
			.attr("x", X + 7)
			.attr("y", Y - 20)
			.attr("id", "TXT1")
			.text(d.Stadium);
}

function handleMouseOut(d) {
	d3.select("#TXT0").remove();
	d3.select("#TXT1").remove();
	d3.select("#"+ID).attr("fill", d3.rgb(93,161,216));
	d3.select("#"+ID2).attr("fill", d3.rgb(93,161,216));
}					