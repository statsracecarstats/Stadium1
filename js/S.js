
// set up basic SVG canvase use internet preffered margin set up (i follow the pack)
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 900 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

	
var canvas = d3.select(".SCATTER").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom);
				
//load data set in d3.csv				
d3.csv("https://raw.githubusercontent.com/pacunningham821/Stadium1/master/Data_Set2_NBA.csv").then(function(data){
	
	var CapMax = d3.max(data, function(d) {return parseFloat(d.Capacity);});
	var CapMin = d3.min(data, function(d) {return parseFloat(d.Capacity);});
	var YeaMax = d3.max(data, function(d) {return parseFloat(d['Year.opened']);});
	var YeaMin = d3.min(data, function(d) {return parseFloat(d['Year.opened']);});
	var CosMax = d3.max(data, function(d) {return parseFloat(d.Cost1_inflation);});
	var CosMin = d3.min(data, function(d) {return parseFloat(d.Cost1_inflation);});
	//set scale for x-axis based on year
	var scaleX = d3.scaleLinear()
		.domain([YeaMin,YeaMax])
		.range([50,700]);
	//set scale for y-axis based on cost
	var scaleY = d3.scaleLinear()
		.domain([CosMin,CosMax])
		.range([700, 50]);
	// set scale for radius based on capacity
	var scaleR = d3.scaleLinear()
		.domain([CapMin,CapMax])
		.range([4, 11]);
	//create scatter points using scale. year vs capacity	
	canvas.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function(d) {return scaleX(parseFloat(d['Year.opened']));})
		.attr("cy", function(d) {return scaleY(parseFloat(d.Cost1_inflation));})
		.attr("r", function(d) {return scaleR(parseFloat(d.Capacity));})
		.attr("id", function(d) {return d.Stadium;})
		.on("mouseover", handleMouseOver)
		.on("mouseout", handleMouseOut)
		
	
	
	
	console.log(CapMax);
	console.log(YeaMin);

});		

function handleMouseOver(d) {
		var X = parseInt(d3.select(this).attr("cx"));
		var Y = parseInt(d3.select(this).attr("cy"));
		
		canvas.append("text")
			.attr("x", X + 7)
			.attr("y", Y - 7)
			.attr("id", "TXT0")
			.text("(" + d['Year.opened'] + ", " + d.Cost1_inflation*1000000 + ")");
			
		canvas.append("text")
			.attr("x", X + 7)
			.attr("y", Y - 20)
			.attr("id", "TXT1")
			.text(d.Stadium);
}

function handleMouseOut(d) {
	d3.select("#TXT0").remove();
	d3.select("#TXT1").remove();
}					