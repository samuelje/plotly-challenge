// Select user input field
var idSelect = d3.select("#selDataset");

// Select demographic 
var demographicsTable = d3.select("#sample-metadata");

// Select the bar chart div
var barChart = d3.select("bar");

// Select the bubble chart div
var bubbleChart = d3.select("bubble");

// Select the gauge chart div
// var gaugeChart = d3.select("gauge");

// Create a function to populate dropdown menu with IDs
function init() {
    // reset prior data
    resetData();

    // Read samples from JSON data file
    d3.json("data/samples.json").then((data => {

        // Populate dropdown menu with IDs
        
        // Loop over each name in array for dropdown
        data.names.forEach((name => {
            var option = idSelect.append("option");
            option.text(name);
        }));

        // First ID from list for initial chart data
        var initID = idSelect.property("value")

        // Plot charts with inital ID
        plotCharts(initID);
    }));
};

// Reset data
function resetData() {

    // Clear data
    demographicsTable.html("");
    barChart.hmtl("");
    bubbleChart.html("");
    // gaugeChart.html("");
};

// Create function to read JSON data for plot charts
function plotCharts(id) {
    // Read samples from JSON data file
    d3.json("data/samples.json").then((data => {
    
        // Populate demographics table
        var individualMetadata = data.metadata.filter(participant => participant.id == id)[0];

        // Obtain wash frequency for gauge chart
        var wfreq = individualMetadata.wfreq;

        // Iterate through each key and value in metadata
        Object.entries(individualMetadata).forEach(([key, value]) => {
            var newlist = demographicsTable.append("u1");
            newlist.attr("class", "list-group list-group-flush");

            // Append a li item to the unordered list tag
            var listItem = newlist.append("li");
            listItem.attr("class", "list-group-item p-1 demo-text bg-transparent");

            // Add key value pair from metadata to demographics list
            listItem.text($`{key}: ${value}`);
        });

        // Retrieve data for plotting charts

        // Filter samples for ID chosen
        var individualSample = data.samples.filter(sample => sample.id == id)[0];

        // Empty arrays for sample data
        var otuIDs = [];
        var otuLabels = [];
        var sampleValues = [];

        // Iterate through each key and value for plotting
        Object.entries(individualSample).forEach(([key, value]) => {
            switch (key) {
                case "otu_ids":
                    otuIDs.push(value);
                    break;
                case "sample_values":
                    sampleValues.push(value);
                    break;
                case "otu_labels":
                    otuLabels.push(value);
                    break;
                default:
                    break;
            }
        });

        // Slice and reverse arrays to get top 10 values
        var topOtuIDs = otuIDs[0].slice(0, 10).reverse();
        var topOtuLabels = otuLabels[0].slice(0, 10).reverse();
        var topSampleValues = sampleValues[0].slice(0, 10).reverse();

        // Map function to store IDs with "OTU" for labeling y-axis
        var topOtuIDsFormatted = topOtuIDs.map(otuID => "OTU " + otuID);

        // Plot bar chart
        var traceBar = {
            x: topSampleValues,
            y: topOtuIDsFormatted,
            text: topOtuLabels,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'rgb(29, 145, 192)'
            }
        };

        // Create data array for plot
        var dataBar = [traceBar];

        // Plot layout
        var layoutBar = {
            height: 500,
            width: 600,
            font: {
                family: 'Quicksand'
            },
            hoverlabel: {
                font: {
                    family: 'Quicksand'
                }
            },
            title: {
                text: `<b>Top OTUs for Test Subject ${id}</b>`,
                font: {
                    size: 18,
                    color: 'rgb(34,94,168)'
                }
            },
            xaxis: {
                title: "<b>Sample values<b>",
                color: 'rgb(34,94,168)'
            },
            yaxis: {
                tickfont: { size: 14 }
            }
        }

        // Add bar chart to "bar" div
        Plotly.newPlot("bar", dataBar, layoutBar);

        // Plot bubble chart
        var traceBubble = {
            x: otuIDs[0],
            y: sampleValues[0],
            text: otuLabels[0],
            mode: 'markers',
            marker: {
                size: sampleValues[0],
                color: otuIDs[0],
                colorscale: 'YlGnBu'
            }
        };

        // Create data array for bubble chart
        var dataBubble = [traceBubble];

        // Plot layout for bubble chart
        var layoutBubble = {
            font: {
                family: 'Quicksand'
            },
            hoverlabel: {
                font: {
                    family: 'Quicksand'
                }
            },
            xaxis: {
                title: "<b>OTU ID</b>",
                color: 'rgb(34, 94, 168)'
            },
            yaxis: {
                title: "<b>Sample Values</b>",
                color: 'rgb(34, 94, 168)'
            },
            showlegend: false,
        };

        // Plot bubble chart to div
        Plotly.newPlot('bubble', dataBubble, layoutBubble);
    ));    
};

function optionChanged(id) {
    resetData();

    plotCharts(id);
}

init();