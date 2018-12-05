var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select(".scatterplot")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// @TODO: YOUR CODE HERE!
d3.csv("assets/data/data.csv").then(function(stateData, error) {
    if (error) console.log(error);

    console.log(stateData);

    Object.entries(stateData).forEach(function([key,value]) {
      console.log(key,value);
    });

    var states = Object.values(stateData).map(data=>data.state);
    console.log("state", states);
    var stateAb = Object.values(stateData).map(data=>data.abbr);
    console.log("abbr", stateAb);
    var income = Object.values(stateData).map(data=>data.income);
    console.log("income", income);
    var obesity = Object.values(stateData).map(data=>data.obesity);
    console.log("obesity", obesity);
    var poverty = Object.values(stateData).map(data=>data.poverty);
    console.log("poverty", poverty);
    var smokes = Object.values(stateData).map(data=>data.smokes);
    console.log("smokes", smokes);

    Object.values(stateData).forEach(
        function(data) {
            data.income = +data.income;
            data.obesity =+data.obesity;
            data.poverty = +data.poverty;
            data.smokes = +data.smokes;
            console.log("Income:", data.income);
            console.log("Obesity:" , data.obesity);
            console.log("Poverty:", data.poverty);
            console.log("Smokes:", data.smokes);
        }
    );

    var xLinearScale = d3.scaleLinear()
    .domain([20, d3.max(stateData, d => d.obesity)])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(stateData, d => d.smokes)])
    .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".5");

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Obesity: ${d.obesity}<br>Smokes: ${d.smokes}`);
      });

    chartGroup.call(toolTip);

    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Obesity vs Smokes");
  
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("States and their relation of Obesity to Smoking");
});