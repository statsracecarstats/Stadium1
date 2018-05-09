
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
	//set scale for x-axis based on year
	var scaleX = d3.scaleLinear()
		.domain([YeaMin,YeaMax])
		.range([50,700]);
	//set scale for y-axis based on capacity
	var scaleY = d3.scaleLinear()
		.domain([CapMin,CapMax])
		.range([700, 50]);
	//create scatter points using scale. year vs capacity	
	canvas.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function(d) {return scaleX(parseFloat(d['Year.opened']));})
		.attr("cy", function(d) {return scaleY(parseFloat(d.Capacity));})
		.attr("r", 15)
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
			.text("(" + d['Year.opened'] + ", " + d.Capacity + ")");
}

function handleMouseOut(d) {
	d3.select("#TXT0").remove();
}					