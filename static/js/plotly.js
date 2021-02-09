

function buildSalaryChart(url, indus, city) {
    d3.json(url).then(function (theData) {
        console.log(theData);
        data = [];
        if(city !== undefined){
            theData = city
            if (url === "/all"){
            var cityTitle = "in " + city.CleanDataAnalyst[0].location
            }
            else {
                var cityTitle = "in " +city.result[0].location
            }
        }
        else{
            var cityTitle = ""
        }
        if (indus !== undefined) {
            console.log(indus)
            
            if (url === "/all") {
                var filteredba = theData.CleanBusinessAnalyst.filter(function (d) {return d.industry.includes(indus)})
                var filteredda = theData.CleanDataAnalyst.filter(function (d) {return d.industry.includes(indus)})

                theData = {
                    CleanBusinessAnalyst: filteredba,
                    CleanDataAnalyst: filteredda
                }
            }
            else if (url === "/business-analyst") {
                var filteredba = theData.result.filter(function (d) {return d.industry.includes(indus)})
                theData = {result: filteredba}
            }
            else if (url === "/data-analyst") {
                var filteredda = theData.result.filter(function (d) {return d.industry.includes(indus)})
                theData = {result: filteredda}
            }
            function shortenTitle(text) {
                if (text.length > 20)
                        return text.substring(0, 15) + '...';
                    else
                        return text;
            }
            var industitle = shortenTitle(indus)
        }                
        else {
            var industitle = ""
        }
        for (const [key, value] of Object.entries(theData)) {
            var salary = value.map(d => (parseInt(d.salaryHigh) +
                parseInt(d.salaryLow)) / 2);
            var type = labelChart(key,url);
            var trace = {
                x: salary,
                name: type,
                type: 'histogram',
                marker: {
                    color: pickColor(type)["fill"],
                    line: {
                        color: pickColor(type)["line"],
                        width: 1
                    }
                },
                opacity: 0.5
            };
            data.push(trace)
        }
        var layout = {
            bargap: 0.05,
            bargroupgap: 0.2,
            title: `${industitle} Common Salaries ${cityTitle}`,
            xaxis: { title: "Salary" },
            yaxis: { title: "Count" },
            legend: {
                orientation: "h",
                yanchor: "bottom",
                y: 1.02,
                xanchor: "right",
                x: 1
            }
        };
        Plotly.newPlot('bargraph2', data, layout);
    }
        , function (error) {
            console.log(error);
        });
}

function pickColor(type) {
    if (type === 'Data Analyst') {
        return {
            "fill": "rgba(255, 100, 102, 0.7)",
            "line": "rgba(255, 100, 102, 1)"
        };
    }
    else if (type === 'Business Analyst') {
        return {
            "fill": "rgba(100, 200, 102, 0.7)",
            "line": "rgba(100, 200, 102, 1)"
        };
    }
    else if (type === 'Data Engineer') {
        return {
            "fill": "rgba(100, 200, 255, 0.7)",
            "line": "rgba(100, 200, 255, 1)"
        };
    }
    else if (type === 'Data Scientist') {
        return {
            "fill": "rgba(255, 100, 255, 0.7)",
            "line": "rgba(255, 100, 255, 1)"
        };
    }
}

function labelChart(key,url) {
    if (key === 'result') {
        if (url === '/data-analyst') {return 'Data Analyst'}
        else if (url === '/business-analyst') {return 'Business Analyst'}
        else if (url === '/data-engineer') {return 'Data Engineer'}
        else if (url === '/data-scientist') {return 'Data Scientist'}
    }
    else { 
        if (key === 'CleanDataAnalyst') {return 'Data Analyst'}
        else if (key === 'CleanBusinessAnalyst') {return 'Business Analyst'}
        else if (key === 'CleanDataEngineer') {return 'Data Engineer'}
        else if (key === 'CleanDataScientist') {return 'Data Scientist'}
    }
}

buildSalaryChart("/all");
d3.selectAll("option").on("click", function () {
    d3.event.preventDefault();
    url = d3.select(this).property("value")
    buildSalaryChart(url);
    svg.remove()
    if (url === "/all") {
        groupedBar(url)
    }
    else {
        updateDash(url)
    }
})