var url = "/business-analyst"

d3.json(url).then(function (theData) {
    salaryMid = theData.result.map(
        d => (parseInt(d.salaryHigh) + parseInt(d.salaryLow))/2);

    var trace1 = {
        x: theData.result.map(d => d.salaryHigh),
        name: 'High',
        type: 'histogram',
        marker: {
            color: "rgba(255, 100, 102, 0.7)",
            line: {
                color: "rgba(255, 100, 102, 1)",
                width: 1
            }
        },
        opacity: 0.5
    };
    var trace2 = {
        x: theData.result.map(d => d.salaryLow),
        name: 'Low',
        type: 'histogram',
        marker: {
            color: "rgba(100, 200, 102, 0.7)",
            line: {
                color: "rgba(100, 200, 102, 1)",
                width: 1
            }
        },
        opacity: 0.5
    };
    var data = [trace1, trace2];
    Plotly.newPlot('bargraph2', data);
}
    , function (error) {
        console.log(error);
    });