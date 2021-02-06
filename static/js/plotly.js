

function buildSalaryChart(url) {
    d3.json(url).then(function (theData) {
        console.log(theData);
        data = [];
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
            title: "Common Salaries",
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
})