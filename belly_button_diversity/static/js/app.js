function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(sample){

    // Use d3 to select the panel with id of `#sample-metadata`
    var metaData = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metaData.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    for (let [key, value] of Object.entries(sample)) {
      metaData.append("div")
      .text(`${key} : ${value}`);
      console.log(`${key}: ${value}`);
    };
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(sample) {
    console.log(sample);
    var sampleValues = sample.sample_values.splice(0,10); 
    console.log(sampleValues);
    var otuIDs = sample.otu_ids.splice(0,10);
    console.log(otuIDs);
    var otuLabels = sample.otu_labels.splice(0,10);
    console.log(otuLabels);

    // @TODO: Build a Bubble Chart using the sample data
    var traceBubble = {
      x: otuIDs,
      y: sampleValues,
      mode:'markers',
      marker: {
        size: sampleValues,
        color: otuIDs,
      },
      name: otuLabels
    };

    var bubbleData = [traceBubble];
    var bubbleLayout = {
      title: `${sample}`
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var tracePie = {
      labels:otuIDs,
      values:sampleValues,
      type:"pie",
      name:otuLabels
    };
    var pieData = [tracePie];
    var pieLayout = {
      title: `${sample}`
    };

    Plotly.newPlot("pie", pieData, pieLayout);

  })

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
