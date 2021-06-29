// User input field
var idSelect = d3.select("#selDataset");

// Demographics table for user input
var demographicsTable = d3.select("#sample-metadata");

// Bar chart div
var barChart = d3.select("#bar");

// Bubble chart div
var bubbleChart = d3.select("bubble");

// Function to populate dropdown user input field for sample data
function init() {

    // Reset data
    resetData();

    // Read JSON file
    d3.json("data/samples.json").then((data => {

        // Populate dropdown with all IDs from sample data

        //  Use for loop to add IDs to dropdown menu
        data.names.forEach((name => {
            var option = idSelect.append("option");
            option.text(name);
        }));

        // Use first ID value as default for initial dropdown selection
        var initId = idSelect.property("value")

        // Plot charts with ID from dropdown
        plotCharts(initId);

    }));

}

// Function to reset for new user input
function resetData() {

    demographicsTable.html("");
    barChart.html("");
    bubbleChart.html("");

};

// Read JSON for plots and create plots
function plotCharts(id) {

    d3.json("data/samples.json").then((data => {

        // Generate demographics table

        // Filter for user input of participant ID
        var individualMetadata = data.metadata.filter(participant => participant.id == id)[0];

        // Iterate through each key and value in the metadata
        Object.entries(individualMetadata).forEach(([key, value]) => {

            var newList = demographicsTable.append("ul");
            newList.attr("class", "list-group list-group-flush");

            var listItem = newList.append("li");

            listItem.attr("class", "list-group-item p-1 demo-text bg-transparent");

            listItem.text(`${key}: ${value}`);

        });

        // Retrieve data for plotting charts

        // Filter for user input of ID
        var individualSample = data.samples.filter(sample => sample.id == id)[0];

        // Empty arrays to store data
        var otuIds = [];
        var otuLabels = [];
        var sampleValues = [];

        // Iterate through each key and value in the sample to retrieve data for plotting
        Object.entries(individualSample).forEach(([key, value]) => {

            switch (key) {
                case "otu_ids":
                    otuIds.push(value);
                    break;
                case "sample_values":
                    sampleValues.push(value);
                    break;
                case "otu_labels":
                    otuLabels.push(value);
                    break;
                    // case
                default:
                    break;
            }

        });

        // Slice and reverse the arrays to get the top 10 values, labels, and IDs
        var topOtuIds = otuIds[0].slice(0, 10).reverse();
        var topOtuLabels = otuLabels[0].slice(0, 10).reverse();
        var topSampleValues = sampleValues[0].slice(0, 10).reverse();

        // use the map function to store the IDs with "OTU" for labeling y-axis
        var topOtuIdsFormatted = topOtuIds.map(otuID => "OTU " + otuID);

        // Plot bar chart

        // Create trace
        var traceBar = {
            x: topSampleValues,
            y: topOtuIdsFormatted,
            text: topOtuLabels,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'rgb(29,145,192)'
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


        // Plot bar chart to "bar" div
        Plotly.newPlot("bar", dataBar, layoutBar);
        
        // Plot bubble chart

        // Create trace
        var traceBub = {
            x: otuIds[0],
            y: sampleValues[0],
            text: otuLabels[0],
            mode: 'markers',
            marker: {
                size: sampleValues[0],
                color: otuIds[0],
                colorscale: 'YlGnBu'
            }
        };

        // Data array
        var dataBub = [traceBub];

        // Layout for bubble chart
        var layoutBub = {
            font: {
                family: 'Quicksand'
            },
            hoverlabel: {
                font: {
                    family: 'Quicksand'
                }
            },
            xaxis: {
                title: "<b>OTU Id</b>",
                color: 'rgb(34,94,168)'
            },
            yaxis: {
                title: "<b>Sample Values</b>",
                color: 'rgb(34,94,168)'
            },
            showlegend: false,
        };

        // Plot bubble chart to bubble div
        Plotly.newPlot('bubble', dataBub, layoutBub);

    }));

};

// Create function with ID parameter for when dropdown selection is changed
function optionChanged(id) {

    // Reset data
    resetData();

    // Plot charts for user input ID
    plotCharts(id);

}

// init function used to recall default data
init();