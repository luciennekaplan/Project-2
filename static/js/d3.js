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

// here we initialize the svg variable so we can use it inside functions
var svg;

// we have this to use as our initial data route to build the industry bar chart
var url = "/data-analyst"

// and here we have our function that builds the bar chart
function updateDash(link) {
    // we log the link here so we can see if we're going to the right place
    console.log(link)
    // then we have our promise
    d3.json(link).then(function (data) {
        // and we look at the data to make sure we're getting the right stuff
        console.log(data)

        // here we add the svg element to the html
        svg = d3.select("#industrybar")
            .append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth);

        // This is where we add the group element to the svg, this is where our chart is going to go
        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // here we initialize a dictionary for the industry count
        var industries = {};

        // then we loop through the data that we got from the promise and do a frequency count for each industry
        data.result.forEach((d, i) => {
            if (d.industry in industries) {
                //this is basically saying "if the industry is already in our keys, add 1 to the value"
                industries[d.industry] += 1;
            }
            else {
                // and this one is saying "if this industry isn't already in our keys then make it a key and give it the value of 1"
                industries[d.industry] = 1;
            }
        })

        // and then let's log it so we can see if anything messed up
        console.log(industries)
        
        // then because we want to work with the keys too we need to put them in an array of objects
        // so here we put both the keys and values into their own arrays
        var industryName = Object.keys(industries)
        var industryCount = Object.values(industries)

        // and initialize an array that we can push objects to
        var industryListDict = []

        // and then we loop through one of the arrays above, getting the index as well as the item
        industryName.forEach((d, i) => {
            // then we make an object, and put both the industry name and frequency count into it
            var dicty = {
                name: d,
                count: industryCount[i]
            }

            // then push it to the array that we initialized
            industryListDict.push(dicty)
        })

        // then we log it to make sure it matches up with the frequency count we did before
        console.log(industryListDict)

        // then we sort the array in descending order so that we can grab the top industries
        var sortedDicts = industryListDict.sort(function (a, b) {
            return b.count - a.count
        })
        // and log this too for good measure, it's always good to see the data youre working with
        console.log(sortedDicts)

        // here we have a bunch of slices so we're only looking at 10 industries at a time
        var topTen = sortedDicts.slice(0, 10)
        var tenToTwenty = sortedDicts.slice(10, 20)
        var twentyToThirty = sortedDicts.slice(20, 30)
        var thirtyToForty = sortedDicts.slice(30, 40)
        var fortyToFifty = sortedDicts.slice(40, 50)

        // then here we set up our initial x axis with the top 10 industries
        var xScale = d3.scaleBand()
            .domain(topTen.map(d => d.name))
            .range([0, width])
            .padding(0.1);

        // and our initial y axis with the top 10 industries
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(topTen, d => d.count)])
            .range([height, 0]);

        // then we assign them their own variables
        var bottomAxis = d3.axisBottom(xScale);
        var leftAxis = d3.axisLeft(yScale);

        // and call them
        chartGroup.append("g")
            .classed("yAxis", true)
            .call(leftAxis);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .classed("xAxis", true)
            .call(bottomAxis)
            .selectAll("text") // this section here is needed to rotate the tick values so theyre not running over each other
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(25)")
            .style("text-anchor", "start")

        // this function is here because some of the industry names are super long and they run off the svg element, 
        // so we shorten them and add an elipses (...)
        function truncateText(d) {
            d3.selectAll("text")
                .text(function (d) {
                    console.log(d)
                    if (d.length > 5)
                        return d.substring(0, 10) + '...';
                    else
                        return d;
                });
        }
        // then we call the function
        truncateText()

        // then we add our tooltips
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-3, 0])
            .html(function (d) {
                return `${d.name} <br> # of jobs: ${d.count}`;
            });
        svg.call(toolTip);

        // then we add the bars to the bar chart with the data we need
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

        // and here we add the different axes labels for the different pages of data    
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
            .classed("inactive", true) 
            .text("2");

        var twentyToThirtyAxis = chartGroup.append("text")
            .attr("transform", `translate(${(width / 2) - 10}, ${height + margin.top})`)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .classed("inactive", true) 
            .text("3");

        var thirtyToFortyAxis = chartGroup.append("text")
            .attr("transform", `translate(${(width / 2)}, ${height + margin.top})`)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .classed("inactive", true) 
            .text("4");

        var fortyToFiftyAxis = chartGroup.append("text")
            .attr("transform", `translate(${(width / 2) + 10}, ${height + margin.top})`)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .classed("inactive", true) 
            .text("5");

        // Then we have all of our listeners to update the bar chart
        topTenAxis.on("click", function (d) {
            topTenAxis.classed("inactive", false)
                .classed("active x", true);
            tenToTwentyAxis.classed("inactive", true)
                .classed("active x", false);
            twentyToThirtyAxis.classed("inactive", true)
                .classed("active x", false);
            thirtyToFortyAxis.classed("inactive", true)
                .classed("active x", false);
            fortyToFiftyAxis.classed("inactive", true)
                .classed("active x", false);
            console.log(topTen)

            xScale = d3.scaleBand()
                .domain(topTen.map(d => d.name))
                .range([0, width])
                .padding(0.1);

            yScale = d3.scaleLinear()
                .domain([0, d3.max(topTen, d => d.count)])
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
                .remove()

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

            setTimeout(function () { truncateText() }, 500)
        })

        tenToTwentyAxis.on("click", function (d) {
            topTenAxis.classed("inactive", true)
                .classed("active x", false);
            tenToTwentyAxis.classed("inactive", false)
                .classed("active x", true);
            twentyToThirtyAxis.classed("inactive", true)
                .classed("active x", false);
            thirtyToFortyAxis.classed("inactive", true)
                .classed("active x", false);
            fortyToFiftyAxis.classed("inactive", true)
                .classed("active x", false);
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
                .remove()

            chartGroup.selectAll(".indusbar")
                .data(tenToTwenty)
                .enter()
                .append("rect")
                .classed("indusbar", true)
                .attr("x", d => xScale(d.name))
                .attr("y", d => yScale(d.count))
                .attr("width", xScale.bandwidth())
                .attr("height", d => height - yScale(d.count))
                .on("mouseover", toolTip.show)
                .on("mouseout", toolTip.hide);

            setTimeout(function () { truncateText() }, 500)
        })

        twentyToThirtyAxis.on("click", function (d) {
            topTenAxis.classed("inactive", true)
                .classed("active x", false);
            tenToTwentyAxis.classed("inactive", true)
                .classed("active x", false);
            twentyToThirtyAxis.classed("inactive", false)
                .classed("active x", true);
            thirtyToFortyAxis.classed("inactive", true)
                .classed("active x", false);
            fortyToFiftyAxis.classed("inactive", true)
                .classed("active x", false);


            console.log(twentyToThirty)

            xScale = d3.scaleBand()
                .domain(twentyToThirty.map(d => d.name))
                .range([0, width])
                .padding(0.1);

            yScale = d3.scaleLinear()
                .domain([0, d3.max(twentyToThirty, d => d.count)])
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
                .remove()

            chartGroup.selectAll(".indusbar")
                .data(twentyToThirty)
                .enter()
                .append("rect")
                .classed("indusbar", true)
                .attr("x", d => xScale(d.name))
                .attr("y", d => yScale(d.count))
                .attr("width", xScale.bandwidth())
                .attr("height", d => height - yScale(d.count))
                .on("mouseover", toolTip.show)
                .on("mouseout", toolTip.hide);

            setTimeout(function () { truncateText() }, 500)
        })


        thirtyToFortyAxis.on("click", function (d) {
            topTenAxis.classed("inactive", true)
                .classed("active x", false);
            tenToTwentyAxis.classed("inactive", true)
                .classed("active x", false);
            twentyToThirtyAxis.classed("inactive", true)
                .classed("active x", false);
            thirtyToFortyAxis.classed("inactive", false)
                .classed("active x", true);
            fortyToFiftyAxis.classed("inactive", true)
                .classed("active x", false);


            console.log(thirtyToForty)

            xScale = d3.scaleBand()
                .domain(thirtyToForty.map(d => d.name))
                .range([0, width])
                .padding(0.1);

            yScale = d3.scaleLinear()
                .domain([0, d3.max(thirtyToForty, d => d.count)])
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
                .remove()

            chartGroup.selectAll(".indusbar")
                .data(thirtyToForty)
                .enter()
                .append("rect")
                .classed("indusbar", true)
                .attr("x", d => xScale(d.name))
                .attr("y", d => yScale(d.count))
                .attr("width", xScale.bandwidth())
                .attr("height", d => height - yScale(d.count))
                .on("mouseover", toolTip.show)
                .on("mouseout", toolTip.hide);

            setTimeout(function () { truncateText() }, 500)
        })


        fortyToFiftyAxis.on("click", function (d) {
            topTenAxis.classed("inactive", true)
                .classed("active x", false);
            tenToTwentyAxis.classed("inactive", true)
                .classed("active x", false);
            twentyToThirtyAxis.classed("inactive", true)
                .classed("active x", false);
            thirtyToFortyAxis.classed("inactive", true)
                .classed("active x", false);
            fortyToFiftyAxis.classed("inactive", false)
                .classed("active x", true);


            console.log(fortyToFifty)

            xScale = d3.scaleBand()
                .domain(fortyToFifty.map(d => d.name))
                .range([0, width])
                .padding(0.1);

            yScale = d3.scaleLinear()
                .domain([0, d3.max(fortyToFifty, d => d.count)])
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
                .remove()

            chartGroup.selectAll(".indusbar")
                .data(fortyToFifty)
                .enter()
                .append("rect")
                .classed("indusbar", true)
                .attr("x", d => xScale(d.name))
                .attr("y", d => yScale(d.count))
                .attr("width", xScale.bandwidth())
                .attr("height", d => height - yScale(d.count))
                .on("mouseover", toolTip.show)
                .on("mouseout", toolTip.hide);

            setTimeout(function () { truncateText() }, 500)
        })
    })
}

// then we call the function to initialize the chart on page load
updateDash(url)

// and here we have a listener to change the dataset we're looking at
d3.selectAll("option").on("click", function () {
    url = d3.select(this).property("value")
    svg.remove()
    updateDash(url)
})