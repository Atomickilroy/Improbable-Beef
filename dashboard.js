function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    //buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
//-----------------------------------------------------------------------

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    //Create a variable that holds the samples array. 
    var samples = data.samples;

    
    //Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample); 

   
   //Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metaArray = metadata.filter(sampleObj => sampleObj.id == sample);


    //Create a variable that holds the first sample in the array.
    //Create a variable that holds the first sample in the metadata array.
    var results = samplesArray[0];
    var result1 = metaArray[0];
    console.log(otu_ids)
    console.log(otu_labels)
    console.log(sample_values)

    // 6. Create variables that hold
    var otu_ids = results.otu_ids;
    var otu_labels = results.otu_labels;
    var sample_values = results.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var washing = parseFloat(result1.wfreq)
    console.log(washing)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last.

    var yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();

    // 8. Create the trace for the bar chart. 
    var trace1 = {
      x: sample_values.slice(0,10).reverse(),
      y: yticks,      
      text:otu_labels.slice(0,10).reverse(),
      //name:""
      type:'bar',
      orientation: 'h',      
   };

    var barData =[trace1];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top Ten Bacterial Cultures Found",
      xaxis: {title: "Sample Values" },
      yaxis: {title: "IDs"},
   };
    // 10. Use Plotly to plot the data with the layout. 

    Plotly.newPlot("bar", barData, barLayout); 

//----------------------------------------------------------------------------

    // 1. Create the trace for the bubble chart.
    var trace2 = {
      x: otu_ids.slice(0,10).reverse(),
      y: sample_values.slice(0,10).reverse(),
      text:otu_labels.slice(0,10).reverse(),
      mode:'markers',
      sizex: 'None',
      marker:{
        size: sample_values.slice(0,10).reverse(),
        color: otu_ids.slice(0,10).reverse(),
        colorscale: 'earth'
      }         
   }
    var bubbleData = [trace2];

    // 2. Create the layout for the bubble chart.

    var bubbleLayout = {
      title: "Top Ten Bacterial Cultures Found",
      xaxis: {title: "OTU ID" },        
   }

   // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


  //--------------------------------------------------------------------------



    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: washing,        
        
        gauge: {          
          axis: {range : [null,10],tickwidth:1},
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "limegreen" },
            { range: [8, 10], color: "blue" }]},
          title: { text: "Belly Button Washing Frequency" },
          type: "indicator",
          mode: "gauge+number"
        }      
     ];    

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, 
      height: 500, 
      margin: { t: 0,  b: 0 }};
    // 6. Use Plotly to plot the gauge data and layout.

      Plotly.newPlot('gauge',gaugeData,gaugeLayout)

  });
}

//-----------------------------------------------------------------------------------





