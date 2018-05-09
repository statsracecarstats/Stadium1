
// set up basic SVG canvase use internet preffered margin set up (i follow the pack)
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 900 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

	
var canvas = d3.select(".SCATTER").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom);
				
				
// set up 				
var GAH=[];							

d3.csv("https://raw.githubusercontent.com/pacunningham821/Stadium1/master/Data_Set2_NBA.csv").then(function(data){
	console.log(data);
	console.log(data["Capacity"]);
	var CapMax = d3.max(parseFloat(data.Capacity));
	console.log(CapMax)
	GAH = data;
});							