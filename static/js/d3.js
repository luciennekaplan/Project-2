// Here we set the svg area
var svgWidth = 500;
var svgHeight = 500;

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
    var industryName = Object.keys(industries)
    var industryCount = Object.values(industries)
    var industryListDict = []

    industryName.forEach((d, i) => {
        var dicty = {
            name: d,
            count: industryCount[i]
        }
        industryListDict.push(dicty)
    })
    console.log(industryListDict)

    var sortedDicts = industryListDict.sort(function(a,b) {
        return b.count - a.count
    })
    console.log(sortedDicts)
    var topTen = sortedDicts.slice(0,10)
    var tenToTwenty = sortedDicts.slice(10,20)
    console.log(topTen)
    var xScale = d3.scaleBand()
    .domain(topTen.map(d => d.name))
    .range([0, width])
    .padding(0.1);

    var yScale = d3.scaleLinear()
    .domain([0, d3.max(topTen, d => d.count)])
    .range([height, 0]);

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);
    
    chartGroup.append("g")
        .classed("yAxis", true)
        .call(leftAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .classed("xAxis", true)
        .call(bottomAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(25)")
        .style("text-anchor", "start");

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-3, 0])
        .html(function (d) { 
                return `${d.name} <br> # of jobs: ${d.count}`;});
    svg.call(toolTip);

    chartGroup.selectAll(".indusbar")
        .data(topTen)
        .enter()
        .append("rect")
        .classed("indusbar", true)
        .attr("x", d => xScale(d.name))
        .attr("y", d => yScale(d.count))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.count))
        .on("mouseover", toolTip.show)
        .on("mouseout", toolTip.hide);

    var topTenAxis = chartGroup.append("text")
        .attr("transform", `translate(${(width / 2) - 30}, ${height + margin.top})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .classed("active x", true) 
        .text("1");

    var tenToTwentyAxis = chartGroup.append("text")
        .attr("transform", `translate(${(width / 2) - 20}, ${height + margin.top})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .classed("inactive", true) // I also add the class "x" to the active x axis label so that I can access it later in the listeners
        .text("2");

    tenToTwentyAxis.on("click", function (d) {
        topTenAxis.classed("inactive", true)
            .classed("active x", false);
        tenToTwentyAxis.classed("inactive", false)
            .classed("active x", true);
        console.log(tenToTwenty)
        
        xScale = d3.scaleBand()
        .domain(tenToTwenty.map(d => d.name))
        .range([0, width])
        .padding(0.1);
    
        yScale = d3.scaleLinear()
        .domain([0, d3.max(tenToTwenty, d => d.count)])
        .range([height, 0]);
    
        bottomAxis = d3.axisBottom(xScale);
        leftAxis = d3.axisLeft(yScale);

        d3.select(".xAxis")
            .transition()
            .duration(500)
            .call(bottomAxis)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(25)")
            .style("text-anchor", "start");

        d3.select(".yAxis")
            .transition()
            .duration(500)
            .call(leftAxis)

        d3.selectAll(".indusbar")
            .data(tenToTwenty)
            .enter()
            .attr("x", d => xScale(d.name))
            .attr("y", d => yScale(d.count))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d.count));
    })
})