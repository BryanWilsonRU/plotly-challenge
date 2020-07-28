// Read source data with D3
d3.json("samples.json").then((data) => {
   console.log(data);
 });

// Initialize Page
function init() {
  d3.json("samples.json").then((data) => {
    // Build dropdown menu 
    var dropdown = d3.select("#selDataset");
    data.names.forEach(function(name) {
      dropdown.append("option").text(name).property("value", name);
    });

    // Create bar graph (greatest to largest; use .reverse)
    var sampleValues = data.samples[0].sample_values.slice(0, 10).reverse();
    var sampleIDs = data.samples[0].otu_ids.slice(0, 10).reverse();
    var sampleLabels = data.samples[0].otu_labels.slice(0, 10).reverse();
    var stringIDs = sampleIDs.map(samID =>  `OTU ${samID}`);

    // Trace1 for OTU
    var trace1 = {
        x: sampleValues,    
        y: stringIDs,      
        text: sampleLabels, 
        name: "OTU",
        type: "bar",
        orientation: "h"
      };

    // Layout for bar graph
    var layout1 = {
        title: "Belly Button Biodiversity Bar Chart",
        xaxis:{title: "OTU Values"},
        yaxis:{title: "OTU ID"},
        height: 500,
        width: 1000,
        margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 100
        }
      };
    
    var data1 = [trace1];

    // Plot the bar graph
    Plotly.newPlot("bar", data1, layout1);


    // Create bubble plot for first ID
    var trace2 = {
      x: data.samples[0].otu_ids,
      y: data.samples[0].sample_values,
      mode: "markers",
      marker: {
          size: data.samples[0].sample_values,
          color: data.samples[0].otu_ids
      },
      text:  data.samples[0].otu_labels
    };

    // Layout for bubble chart
    var layout2 = {
      title: "Belly Button Biodiversity Bubble Plot",
      xaxis:{title: "OTU ID"},
      yaxis:{title: "OTU Values"},
      height: 500,
      width: 1000
    };

    var data2 = [trace2];

    // Plot the bubble chart
    Plotly.newPlot("bubble", data2, layout2); 

    // Insert metadata into panel for first subject ID
    var metadata = data.metadata[0];

    // Filter metadata
    var mData = d3.select("#sample-metadata");
      
    // Reset metadata section
    mData.html("");

    // Choose first subject metadata to get selectedMetadata, then append, + use Object.entries to iterate 
    Object.entries(metadata).forEach((key) => {   
      mData.append("p").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
    });
  });
}

// Update plots and metadata when new ID selected
function optionChanged(selectValue) {
  d3.json("samples.json").then((data) => {

    var sampleData = data.samples;

    // Create bar graph (greatest to largest; use .reverse)
    var filteredSample = sampleData.filter(record => record.id === selectValue)[0];
    var sampleValues = filteredSample.sample_values.slice(0, 10).reverse();
    var sampleIDs = filteredSample.otu_ids.slice(0, 10).reverse();
    var stringIDs = sampleIDs.map(samID =>  `OTU ${samID}`);
    var sampleLabels = filteredSample.otu_labels.slice(0, 10).reverse();

    var trace1 = {
      x: sampleValues,    
      y: stringIDs,      
      text: sampleLabels, 
      name: "OTU",
      type: "bar",
      orientation: "h"
    };

  // Create bar chart for the first subject ID
  var layout1 = {
      title: "Belly Button Biodiversity Bar Chart",
      xaxis:{title: "OTU Values"},
      yaxis:{title: "OTU ID"},
      height: 500,
      width: 1000,
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };
  
  var data1 = [trace1];

  // Create bar chart
  Plotly.newPlot("bar", data1, layout1);

    // Bubble chart
    var bubbleValues = filteredSample.sample_values;
    var bubbleIDs = filteredSample.otu_ids;
    var bubbleLabels = filteredSample.otu_labels;

    var trace2 = {
      x: bubbleIDs,
      y: bubbleValues,
      mode: "markers",
      marker: {
          size: bubbleValues,
          color: bubbleIDs
      },
      text:  bubbleLabels
    };

    // Layout for the bubble plot
    var layout2 = {
      title: "Belly Button Biodiversity Bubble Plot",
      xaxis:{title: "OTU ID"},
      yaxis:{title: "OTU Values"},
      height: 500,
      width: 1000
    };

    var data2 = [trace2];

    // Create the bubble plot
    Plotly.newPlot("bubble", data2, layout2); 

    // Build metadata based on the filter
    var metadata = data.metadata;

    // Filter meta data info by id
    var filteredMeta = metadata.filter(record => record.id.toString()  === selectValue)[0];

    var mData = d3.select("#sample-metadata");
      
    // Reset metadata section
    mData.html("");

    // Choose first subject's metadata to get selectedMetadata, then append, + use Object.entries to iterate
    Object.entries(filteredMeta).forEach((key) => {   
      mData.append("p").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
    });
  });
}

init();