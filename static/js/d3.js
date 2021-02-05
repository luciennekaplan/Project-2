// Here we set the svg area
var svgWidth = 800;
var svgHeight = 600;

// and the margins so the axes labels will fit in the svg
var margin = {
    top: 50,
    right: 60,
    bottom: 100,
    left: 100
};

// this is to set the height and width of the chart inside of the svg 
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// here is where we input the svg into the html
var svg = d3.select("#industrybar")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// This is where we add the group element to the svg, this is where our chart is going to go
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var url = "/data-analyst"
d3.json(url).then(function(data) {
    console.log(data)
    var industries = {};
    data.result.forEach((d, i) => {
        if (d.industry in industries) {
            industries[d.industry] += 1;
        }
        else {
            industries[d.industry] = 1;
        }
    })
    console.log(industries)

    var xScale = d3.scaleBand()
    .domain(Object.keys(industries))
    .range([0, width])
    .padding(0.1);

    var yScale = d3.scaleLinear()
    .domain([0, d3.max(Object.values(industries))])
    .range([height, 0]);

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);
    console.log(d3.max(Object.values(industries)))
    chartGroup.append("g")
        .call(leftAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.selectAll(".indusbar")
        .data(industries)
        .enter()
        .append("rect")
        .classed("indusbar", true)
        .attr("x", d => xScale(Object.keys(d)))
        .attr("y", d => yScale(Object.values(d)))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(Object.values(d)));
})