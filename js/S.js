// set up basic SVG canvase use internet preffered margin set up (i follow the pack)
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;


var canvas = d3.select(".SCATTER").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom);

// Pixel max and min for range
var Rmin = 50;
var Rmax = 620;
// Y offset - artifact of old design
var YTline = 30;
// where hist goes
var histOffset = 30;
//global variables for us in funcitons
var ID;
var ID2;
var ymin;
var ymax;

//load data set in d3.csv
d3.csv("https://raw.githubusercontent.com/pacunningham821/Stadium1/master/Data_Set2_NBA.csv").then(function(data){

	var CapMax = d3.max(data, function(d) {return parseFloat(d.Capacity);});
	var CapMin = d3.min(data, function(d) {return parseFloat(d.Capacity);});
	var YeaMax = d3.max(data, function(d) {return parseFloat(d['Year.opened'])+2;});
	var YeaMin = d3.min(data, function(d) {return parseFloat(d['Year.opened'])-2;});
	var CosMax = d3.max(data, function(d) {return parseFloat(d.Cost1_Inflation);});
	var CosMin = d3.min(data, function(d) {return parseFloat(d.Cost1_Inflation);});
	//set scale for x-axis based on year
	var scaleX = d3.scaleLinear()
		.domain([YeaMin,YeaMax])
		.range([Rmin,Rmax]);
	//set scale for y-axis based on cost
	var scaleY = d3.scaleLinear()
		.domain([0,Math.round(CosMax/100)*100])
		.range([Rmax, Rmin]);
	console.log(scaleY(0) - scaleY(100));
	// set scale for radius based on capacity
	var scaleR = d3.scaleLinear()
		.domain([CapMin,CapMax])
		.range([4, 11]);
	// Line fucntion
	var line = d3.line()
		.x(function(d) {return d.x;})
		.y(function(d) {return d.y;});
	//create scatter points using scale. year vs capacity
	var circle = canvas.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function(d) {return scaleX(parseFloat(d['Year.opened']));})
		.attr("cy", function(d) {return scaleY(parseFloat(d.Cost1_Inflation))+YTline+5;})
		.attr("r", function(d) {return scaleR(parseFloat(d.Capacity));})
		.attr("id", function(d) {return d.ID;})
		.attr("fill", d3.rgb(93,161,216))
		.attr("strok-width", 0.25)
		.attr("stroke", d3.rgb(80,80,80))
		.attr("fill-opacity", 0.60)
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

	var CountMax = d3.max(hist, function(d) {return parseFloat(d.Count);});
	var CountMin = d3.min(hist, function(d) {return parseFloat(d.Count);});
	var BinMax = d3.max(hist, function(d) {return parseFloat(d.Bin);});
	var BinMin = d3.min(hist, function(d) {return parseFloat(d.Bin);});
	// set scale for histogram, x is the freq access
	var scaleHX = d3.scaleLinear()
		.domain([CountMin,CountMax])
		.range([Rmin,Rmax-300]);
	//set scale for y-axis based on bin
	var scaleHY = d3.scaleLinear()
		.domain([BinMin,BinMax])
		.range([Rmax - (Rmax-Rmin)/(BinMax + 1), Rmin]);
	console.log(scaleHY(0) - scaleHY(1));

	canvas.selectAll("rect")
		.data(hist)
		.enter()
		.append("rect")
		.attr("x", Rmax + histOffset)
		.attr("y", function(d) {return scaleHY(d.Bin) + YTline + 5})
		.attr("height", scaleHY(0)-scaleHY(1))
		.attr("width", function(d) {return scaleHX(d.Count) - Rmin})
		.attr("fill", d3.rgb(93,161,216))
		.attr("id", function(d) {return "H" + d.Bin})
		.attr("stroke-width", 0.75)
		.attr("stroke", d3.rgb(80,80,80))
		.on("mouseover", histMouseOver)
		.on("mouseout", histMouseOut);

	//build axis
	var Xaxis = d3.axisBottom(scaleHX).ticks(3);

	canvas.append("a")
		.attr("class", "axis")
		.attr("transform", "translate("+ (Rmax - 50 + histOffset) + "," + (Rmax + YTline + 5) + ")")
		.call(Xaxis);


});



function handleMouseOver(d) {
		ID = d3.select(this).attr("id")
    var TBheight = 150;
    // width of text bubble based on stadium name length
    var TBwidth = d.Stadium.length*8 + 20;
    // Font size
    var Fsz = 18;

		var X = parseInt(d3.select(this).attr("cx"));
		var Y = parseInt(d3.select(this).attr("cy"));

		d3.select("#"+ID).attr("fill", d3.rgb(244,161,66));

		d3.select("#H" + d['Hist Bin']).attr("fill",d3.rgb(244,161,66));

    // create text bubble
    canvas.append("rect")
      .attr("x", X+7)
      .attr("y", Y - TBheight)
      .attr("width", TBwidth)
      .attr("height", TBheight-2)
      .attr("fill", d3.rgb(244,161,66))
      .attr("stroke-width", 1)
      .attr("stroke", d3.rgb(140,140,140))
      .attr("rx", 15)
      .attr("ry", 15)
      .attr("id","TxtBub");
    // Text for text bubble
    // Stadium Name
    canvas.append("text")
      .attr("x", X + 9)
      .attr("y", Y - TBheight + Fsz)
      .attr("font-family", "Calibri")
			.attr("font-size", Fsz + "px")
			.attr("fill", d3.rgb(21,21,240))
			.attr("font-weight", 700)
      .attr("id", "TXT0")
      .text(d.Stadium);
    // Year Built
    canvas.append("text")
      .attr("x", X + 9)
      .attr("y", Y - TBheight + (Fsz * 2.1))
      .attr("font-family", "Calibri")
      .attr("font-size", (Fsz-2) + "px")
      .attr("fill", d3.rgb(21,21,240))
      .attr("font-weight", 400)
      .attr("id", "TXT1")
      .text("Year Built: " + d['Year.opened']);
    // 2018 cost to build
    canvas.append("text")
      .attr("x", X + 9)
      .attr("y", Y - TBheight + (Fsz * 3.1))
      .attr("font-family", "Calibri")
      .attr("font-size", (Fsz-2) + "px")
      .attr("fill", d3.rgb(21,21,240))
      .attr("font-weight", 400)
      .attr("id", "TXT2")
      .text("2018 Cost: $" + parseFloat(d.Cost1_Inflation*1000000).toLocaleString('en'));
    // Capacity
    canvas.append("text")
      .attr("x", X + 9)
      .attr("y", Y - TBheight + (Fsz * 4.1))
      .attr("font-family", "Calibri")
      .attr("font-size", (Fsz-2) + "px")
      .attr("fill", d3.rgb(21,21,240))
      .attr("font-weight", 400)
      .attr("id", "TXT3")
      .text("Capacity: " + parseFloat(d.Capacity).toLocaleString('en'));
    // wikipedia link
    canvas.append("text")
      .attr("x", X + 9)
      .attr("y", Y - TBheight + (Fsz * 5.1))
      .attr("font-family", "Calibri")
      .attr("font-size", (Fsz-2) + "px")
      .attr("fill", d3.rgb(21,21,240))
      .attr("font-weight", 400)
      .attr("id", "TXT3")
      .attr("xlink:href", d.Link)
      .text("Click for Wikipedia Page");


    // outline box
		canvas.append("rect")
			.attr("x", Rmin)
			.attr("y", d3.select("#H" + d['Hist Bin']).attr("y"))
			.attr("width", Rmax-Rmin + histOffset)
			.attr("height", d3.select("#H" + d['Hist Bin']).attr("height"))
			.attr("fill", "none")
			.attr("stroke", d3.rgb(80,80,80))
			.attr("stroke-width", 0.75)
			.attr("id", "sightline")
			.style("stroke-dasharray", "4,4");


};

function handleMouseOut(d) {
	d3.select("#TXT0").remove();
	d3.select("#TXT1").remove();
  d3.select("#TXT2").remove();
	d3.select("#sightline").remove();
  d3.select("#TxtBub").remove();
	d3.select("#"+ID).attr("fill", d3.rgb(93,161,216));
	d3.select("#H" + d['Hist Bin']).attr("fill",d3.rgb(93,161,216));
};

function histMouseOver(h) {
	// get the max and min y posistions of the rectangle being hovered over
	ymin = parseInt(d3.select(this).attr("y"));
	ymax = parseInt(d3.select(this).attr("height")) + ymin;
	//Highlight all circles in region of rect
	canvas.selectAll("circle").each(function(d) {
			var CY = d3.select(this).attr("cy");

			if (CY < ymax && CY >= ymin) {
				d3.select(this).attr("fill", d3.rgb(244,161,66))
			};

	});
	// highlight hist block
	d3.select("#H" + h.Bin).attr("fill",d3.rgb(244,161,66));

	// dotted line rect over same height as hist block
	canvas.append("rect")
			.attr("x", Rmin)
			.attr("y", d3.select("#H" + h.Bin).attr("y"))
			.attr("width", Rmax-Rmin + histOffset)
			.attr("height", d3.select("#H" + h.Bin).attr("height"))
			.attr("fill", "none")
			.attr("stroke", d3.rgb(80,80,80))
			.attr("stroke-width", 0.75)
			.attr("id", "sightline")
			.style("stroke-dasharray", "4,4");

};

function histMouseOut(h) {
	// un-highlight circles
	canvas.selectAll("circle").each(function(d) {
			var CY = d3.select(this).attr("cy");

			if (CY < ymax && CY >= ymin) {
				d3.select(this).attr("fill", d3.rgb(93,161,216))
			};
	});
	// un-highlight hist block
	d3.select("#H" + h.Bin).attr("fill", d3.rgb(93,161,216));

	d3.select("#sightline").remove();
};
