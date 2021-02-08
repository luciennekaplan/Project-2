// Here we set the svg area
var svgWidth = 500;
var svgHeight = 500;

// and the margins so the axes labels will fit in the svg
var margin = {
    top: 50,
    right: 60,
    bottom: 100,
    left: 50
};

// this is to set the height and width of the chart inside of the svg 
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// here we initialize the svg variable so we can use it inside functions
var svg;

// we have this to use as our initial data route to build the industry bar chart
var url = "/all";

// and here we have our function that builds the bar chart
function updateDash(link) {
    // we log the link here so we can see if we're going to the right place
    console.log(link);
    // then we have our promise
    d3.json(link).then(function (data) {
        // and we look at the data to make sure we're getting the right stuff
        console.log(data);

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
        });

        // and then let's log it so we can see if anything messed up
        console.log(industries);

        // then because we want to work with the keys too we need to put them in an array of objects
        // so here we put both the keys and values into their own arrays
        var industryName = Object.keys(industries);
        var industryCount = Object.values(industries);

        // and initialize an array that we can push objects to
        var industryListDict = [];

        // and then we loop through one of the arrays above, getting the index as well as the item
        industryName.forEach((d, i) => {
            // then we make an object, and put both the industry name and frequency count into it
            var dicty = {
                name: d,
                count: industryCount[i]
            }

            // then push it to the array that we initialized
            industryListDict.push(dicty);
        });

        // then we log it to make sure it matches up with the frequency count we did before
        console.log(industryListDict);

        // then we sort the array in descending order so that we can grab the top industries
        var sortedDicts = industryListDict.sort(function (a, b) {
            return b.count - a.count
        });
        // and log this too for good measure, it's always good to see the data youre working with
        console.log(sortedDicts);

        // here we have a bunch of slices so we're only looking at 10 industries at a time
        var topTen = sortedDicts.slice(0, 10);
        var tenToTwenty = sortedDicts.slice(10, 20);
        var twentyToThirty = sortedDicts.slice(20, 30);
        var thirtyToForty = sortedDicts.slice(30, 40);
        var fortyToFifty = sortedDicts.slice(40, 50);

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
            .style("text-anchor", "start");

        // this function is here because some of the industry names are super long and they run off the svg element, 
        // so we shorten them and add an elipses (...)
        function truncateText(d) {
            d3.select(".xAxis")
                .selectAll("text")
                .text(function (d) {
                    if (d.length > 5)
                        return d.substring(0, 10) + '...';
                    else
                        return d;
                });
        };
        // then we call the function
        truncateText();

        // then we add our tooltips
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-3, 0])
            .html(function (d) {
                return `${d.name} <br> # of jobs: ${d.count}`;
            });
        svg.call(toolTip);

        var type = labelChart("result",url);

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
            .attr("fill", pickColor(type)["fill"])
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

        // Then we have our function here to update the data when our listeners hear a click
        function listenerUpdate(newData) {
            console.log(newData);

            xScale = d3.scaleBand()
                .domain(newData.map(d => d.name))
                .range([0, width])
                .padding(0.1);

            yScale = d3.scaleLinear()
                .domain([0, d3.max(newData, d => d.count)])
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
                .call(leftAxis);

            d3.selectAll(".indusbar")
                .remove();

            chartGroup.selectAll(".indusbar")
                .data(newData)
                .enter()
                .append("rect")
                .classed("indusbar", true)
                .attr("x", d => xScale(d.name))
                .attr("y", d => yScale(d.count))
                .attr("width", xScale.bandwidth())
                .attr("height", d => height - yScale(d.count))
                .attr("fill", pickColor(type)["fill"])
                .on("mouseover", toolTip.show)
                .on("mouseout", toolTip.hide);

            setTimeout(function () { truncateText() }, 500);
        };


        // and then we put the function with the new data in the listeners, as well as changing the clicked button's class to active and all other buttons to inactive
        topTenAxis.on("click", function (d) {
            d3.select(".active")
                .classed("active x", false)
                .classed("inactive", true);
            
            topTenAxis.classed("inactive", false)
                .classed("active x", true);
            
            listenerUpdate(topTen);
        });

        tenToTwentyAxis.on("click", function (d) {
            d3.select(".active")
                .classed("active x", false)
                .classed("inactive", true);
            tenToTwentyAxis.classed("inactive", false)
                .classed("active x", true);

            listenerUpdate(tenToTwenty);
        });

        twentyToThirtyAxis.on("click", function (d) {
            d3.select(".active")
                .classed("active x", false)
                .classed("inactive", true);
            twentyToThirtyAxis.classed("inactive", false)
                .classed("active x", true);

            listenerUpdate(twentyToThirty);
        });


        thirtyToFortyAxis.on("click", function (d) {
            d3.select(".active")
                .classed("active x", false)
                .classed("inactive", true);
            thirtyToFortyAxis.classed("inactive", false)
                .classed("active x", true);

            listenerUpdate(thirtyToForty);
        });


        fortyToFiftyAxis.on("click", function (d) {
            d3.select(".active")
                .classed("active x", false)
                .classed("inactive", true);
            fortyToFiftyAxis.classed("inactive", false)
                .classed("active x", true);

            listenerUpdate(fortyToFifty);
        });
    });
};



// then we have our function to build a grouped bar chart
function groupedBar(link) {
    d3.json(link).then(data => {
        // first things first we call the data then log it so we know what we're dealing with
        console.log(data);

        // then we set up our svg area
        svg = d3.select("#industrybar")
            .append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth);

        // This is where we add the group element to the svg, this is where our chart is going to go
        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // now we need to get a frequency count of the industries in each dataset
        // so first we initialize an object to put it all into
        var daIndustry = {};
        // then we loop through the data
        data.CleanDataAnalyst.forEach((d, i) => {
            if (d.industry in daIndustry) {
                //this is basically saying "if the industry is already in our keys, add 1 to the value"
                daIndustry[d.industry] += 1;
            }
            else {
                // and this one is saying "if this industry isn't already in our keys then make it a key and give it the value of 1"
                daIndustry[d.industry] = 1;
            }
        });

        // and we do the same thing here
        var baIndustry = {};
        data.CleanBusinessAnalyst.forEach((d, i) => {
            if (d.industry in baIndustry) {
                //this is basically saying "if the industry is already in our keys, add 1 to the value"
                baIndustry[d.industry] += 1;
            }
            else {
                // and this one is saying "if this industry isn't already in our keys then make it a key and give it the value of 1"
                baIndustry[d.industry] = 1;
            }
        });
        // then we log our output so we can compare later
        console.log("daIndustry", daIndustry);
        console.log("baIndustry", baIndustry);

        // The next thing we want to do is put them all into an array of objects, but in order to do that we need to wrangle some things around
        // first we're going to put each key and value into their own list
        var baNames = Object.keys(baIndustry);
        var baCount = Object.values(baIndustry);
        var daNames = Object.keys(daIndustry);
        var daCount = Object.values(daIndustry);

        // then we're going to initialize our array that we're going to push things to
        var combinedListDict = [];

        // and then we loop through one of the arrays above, getting the index as well as the item
        baNames.forEach((d, i) => {
            // then we make an object, and put both the industry name and frequency count into it
            var dicty = {
                name: d,
                count: { "Business Analyst": baCount[i] }
            }
            // that's all well and good, but what if there's an industry that is in one dataset but not in the other?
            // that's where this conditional comes in, its saying "if the name that we're on in the business list is NOT in the data analyst list
            // then assign 0 to the data analyst key"
            if (!(daNames.includes(d))) {
                dicty.count["Data Analyst"] = 0
            }
            // then push it to the array that we initialized
            combinedListDict.push(dicty);
        });

        // so now we have all the business analyst industries in the array of objects, as well as some 0's for the frequency count of data analysts
        // so let's add the rest of the frequency counts for the data analyst industries
        // we start by looping through the data analyst list
        daNames.forEach((d, i) => {
            // then we loop through the array of objects that we pushed to before
            combinedListDict.forEach((e, j) => {
                // and we assign the frequency count to the data analyst key when the industries are the same
                if (d === e.name) {
                    e.count["Data Analyst"] = daCount[i]
                }
            });
            // then we do the same thing as above and search for industries that are in the data analyst set but not in the BA set
            if (!(baNames.includes(d))) {
                var dicty = {
                    name: d,
                    count: {
                        "Data Analyst": daCount[i],
                        "Business Analyst": 0
                        }
                }
                // and push it to the array of objects
                combinedListDict.push(dicty);
            }
        });
        
        // then we log it to make sure it matches up with the frequency count we did before
        console.log(combinedListDict);

        // then we sort the list on the one that has the highest frequency count
        var sortedDictsCombined = combinedListDict.sort(function (a, b) {
            return b.count["Business Analyst"] - a.count["Business Analyst"]
        });
        console.log(sortedDictsCombined);

        // and we get our slices for later
        var combinedTopTen = sortedDictsCombined.slice(0, 10);
        var comTenTwenty = sortedDictsCombined.slice(10, 20);
        var comTwentyThirty = sortedDictsCombined.slice(20, 30);
        var comThirtyForty = sortedDictsCombined.slice(30, 40);
        var comFortyFifty = sortedDictsCombined.slice(40, 50);

        // now we set up our chart
        // a grouped bar chart in d3 requires 2 different x scales, one for the overall groups, and one for the subgroups
        var xScaleAll = d3.scaleBand()
            .domain(combinedTopTen.map(d => d.name))
            .range([0, width])
            .padding(0.1);

        // here we grab the names of our sub groups
        var subs = Object.keys(combinedTopTen[0].count);
        
        // and we set up our subscale
        var xScaleSub = d3.scaleBand()
            .domain(subs)
            .range([0, xScaleAll.bandwidth()])
            .padding(0.1);

        // and we set up which colors they'll be, otherwise both bars will be black
        var colors = d3.scaleOrdinal()
            .domain(subs)
            .range([ "rgba(100, 200, 102, 0.7)","rgba(255, 100, 102, 0.7)"]);

        // and we set up our y scale here
        var yScale = d3.scaleLinear()
            // something different here, because we have more than one value we can't just go off one key, because the other value might be larger at some point
            // so we have to grab the max of the max for each array that we make from the nested object
            .domain([0, d3.max(combinedTopTen, function (d) {return d3.max(Object.values(d.count), function (e) { return e }) })  ])
            .range([height, 0]);


        // then we assign them their own variables
        var bottomAxis = d3.axisBottom(xScaleAll);
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
            .style("text-anchor", "start");

        // this function is here because some of the industry names are super long and they run off the svg element, 
        // so we shorten them and add an elipses (...)
        function truncateText(d) {
            d3.select(".xAxis").selectAll("text")
                .text(function (d) {
                    if (d.length > 5)
                        return d.substring(0, 10) + '...';
                    else
                        return d;
                });
        };
        // then we call the function
        truncateText();

        // then we add our tooltips
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-3, 0])
            .html(function (d) {
                return `${d.name} <br> # of jobs: ${d.value}`;
            });
        svg.call(toolTip);



        // here is where we make our bars appear
        chartGroup.append("g")
            .selectAll("g")
            .data(combinedTopTen)
            .enter()
            .append("g")
            .attr("transform", function (d) { return "translate(" + xScaleAll(d.name) + ",0)"; })
            .selectAll("rect")
            .data(function (d) { return subs.map(function (key) { return { name: d.name, key: key, value: d["count"][key] }; }); })// here we assign the different job titles data to each bar
            .enter().append("rect")
            .classed("indusbar", true)
            .attr("x", function (d) { return xScaleSub(d.key); })
            .attr("y", function (d) { return yScale(d.value); })
            .attr("width", xScaleSub.bandwidth())
            .attr("height", function (d) { return height - yScale(d.value); })
            .attr("fill", function (d) { return colors(d.key); })
            .on("mouseover", toolTip.show)
            .on("mouseout", toolTip.hide);

        // then we have out legend to show which color is which
        var legend = chartGroup.selectAll(".legend")
            .data(subs)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

        // here we add a square of color
        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function (d) { return colors(d); });

        // and here we add the text
        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) { return d; });


        // then we have our page numbers
        var comTenAxis = chartGroup.append("text")
            .attr("transform", `translate(${(width / 2) - 30}, ${height + margin.top})`)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .classed("active x", true)
            .text("1");

        var comTenTwentyAxis = chartGroup.append("text")
            .attr("transform", `translate(${(width / 2) - 20}, ${height + margin.top})`)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .classed("inactive", true)
            .text("2");

        var comTwentyThirtyAxis = chartGroup.append("text")
            .attr("transform", `translate(${(width / 2) - 10}, ${height + margin.top})`)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .classed("inactive", true)
            .text("3");

        var comThirtyFortyAxis = chartGroup.append("text")
            .attr("transform", `translate(${(width / 2)}, ${height + margin.top})`)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .classed("inactive", true)
            .text("4");

        var comFortyFiftyAxis = chartGroup.append("text")
            .attr("transform", `translate(${(width / 2) + 10}, ${height + margin.top})`)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .classed("inactive", true)
            .text("5");

        // and our update function for the listeners
        function groupedUpdate(newData) {
            var xScaleAll = d3.scaleBand()
                .domain(newData.map(d => d.name))
                .range([0, width])
                .padding(0.1);
            
            var xScaleSub = d3.scaleBand()
                .domain(subs)
                .range([0, xScaleAll.bandwidth()])
                .padding(0.1);

            var colors = d3.scaleOrdinal()
                .domain(subs)
                .range([ "rgba(100, 200, 102, 0.7)","rgba(255, 100, 102, 0.7)"]);

            var yScale = d3.scaleLinear()
                .domain([0, d3.max(newData, function (d) {return d3.max(Object.values(d.count), function (e) { return e }) })  ])
                .range([height, 0]);


            // then we assign them their own variables
            var bottomAxis = d3.axisBottom(xScaleAll);
            var leftAxis = d3.axisLeft(yScale);

            d3.select(".xAxis")
                .transition()
                .duration(500)
                .call(bottomAxis)
                .selectAll("text") // this section here is needed to rotate the tick values so theyre not running over each other
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(25)")
                .style("text-anchor", "start");

            d3.select(".yAxis")
                .transition()
                .duration(500)
                .call(leftAxis);

            d3.selectAll(".indusbar")
                .remove();

            chartGroup.append("g")
                .selectAll("g")
                // Enter in data = loop group per group
                .data(newData)
                .enter()
                .append("g")
                .attr("transform", function (d) { return "translate(" + xScaleAll(d.name) + ",0)"; })
                .selectAll("rect")
                .data(function (d) { return subs.map(function (key) { return { name: d.name, key: key, value: d["count"][key] }; }); })
                .enter().append("rect")
                .classed("indusbar", true)
                .attr("x", function (d) { return xScaleSub(d.key); })
                .attr("y", function (d) { return yScale(d.value); })
                .attr("width", xScaleSub.bandwidth())
                .attr("height", function (d) { return height - yScale(d.value); })
                .attr("fill", function (d) { return colors(d.key); })
                .on("mouseover", toolTip.show)
                .on("mouseout", toolTip.hide);

            
            
            setTimeout(function () { truncateText() }, 500);
    
        };

        // and then all our listeners
        comTenAxis.on("click", function (d) {
            d3.select(".active")
                .classed("active x", false)
                .classed("inactive", true)
            comTenAxis.classed("inactive", false)
                .classed("active x", true);

            groupedUpdate(combinedTopTen);
        });

        comTenTwentyAxis.on("click", function (d) {
            d3.select(".active")
                .classed("active x", false)
                .classed("inactive", true)
            comTenTwentyAxis.classed("inactive", false)
                .classed("active x", true);

            groupedUpdate(comTenTwenty);
        });

        comTwentyThirtyAxis.on("click", function (d) {
            d3.select(".active")
                .classed("active x", false)
                .classed("inactive", true)
            comTwentyThirtyAxis.classed("inactive", false)
                .classed("active x", true);

            groupedUpdate(comTwentyThirty);
        });

        comThirtyFortyAxis.on("click", function (d) {
            d3.select(".active")
                .classed("active x", false)
                .classed("inactive", true)
            comThirtyFortyAxis.classed("inactive", false)
                .classed("active x", true);

            groupedUpdate(comThirtyForty);
        });

        comFortyFiftyAxis.on("click", function (d) {
            d3.select(".active")
                .classed("active x", false)
                .classed("inactive", true)
            comFortyFiftyAxis.classed("inactive", false)
                .classed("active x", true);

            groupedUpdate(comFortyFifty);
        });
    });
};
// then we call our grouped bar chart function so it loads on page load
groupedBar(url);

