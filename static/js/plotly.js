var url = "/all"

d3.json(url).then(function (theData) {
    console.log(theData);
    data = []
    for (const [key, value] of Object.entries(theData)) {
        salary = value.map(d => (parseInt(d.salaryHigh) +
            parseInt(d.salaryLow)) / 2);
        var trace = {
            x: salary,
            name: key.slice(5),
            type: 'histogram',
            marker: {
                color: pickColor(key)["fill"],
                line: {
                    color: pickColor(key)["line"],
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
        barmode: "overlay", 
        title: "Common Salaries", 
        xaxis: {title: "Salary"}, 
        yaxis: {title: "Count"},
        legend: {
            orientation:"h",
            yanchor:"bottom",
            y:1.02,
            xanchor:"right",
            x:1
        }
      };
    Plotly.newPlot('bargraph2', data,layout);
}
    , function (error) {
        console.log(error);
    });

function pickColor(type) {
    if (type === 'CleanDataAnalyst') {
        return {"fill":"rgba(255, 100, 102, 0.7)",
                "line":"rgba(255, 100, 102, 1)"}
    }
    else if (type === 'CleanBusinessAnalyst'){
        return {"fill":"rgba(100, 200, 102, 0.7)",
                "line":"rgba(100, 200, 102, 1)"}
    }
    else if (type === 'CleanDataEngineer'){
        return {"fill":"rgba(100, 200, 255, 0.7)",
                "line":"rgba(100, 200, 255, 1)"}
    }
    else if (type === 'CleanDataScientist'){
        return {"fill":"rgba(255, 100, 255, 0.7)",
                "line":"rgba(255, 100, 255, 1)"}
    }
}