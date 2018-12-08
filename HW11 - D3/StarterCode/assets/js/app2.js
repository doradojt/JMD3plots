function makeResponsive() {
  
  var svgArea = d3.select("body").select("svg");

  if(!svgArea.empty()) {
    svgArea.remove();
  }

  var svgWidth = parseInt(d3.select("#scatterplot").style("width"));
  var svgHeight = svgWidth - (svgWidth / 3.9);

  var margin = {
    top: 20,
    right: 200,
    bottom: 60,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  var svg = d3.select("#scatterplot")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  var chosenXAxis = "poverty";
  var chosenYAxis = "obesity";

  function xScale(stateData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, data=> data[chosenXAxis])-1,d3.max(stateData, data=>data[chosenXAxis])+1])
      .range([0,width]);
    console.log(typeof xLinearScale);
    
    return xLinearScale;
  }

  function yScale(stateData,chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, data=>data[chosenYAxis])-1, d3.max(stateData, data=>data[chosenYAxis])+1])
      .range([height, 0]);
    console.log(typeof yLinearScale);

    return yLinearScale;
  }

  function renderXAxes(newXScale,xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);

    return xAxis;
  }
  function renderYAxes(newYScale,yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);

    return yAxis;
  }
  function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", data=>newXScale(data[chosenXAxis]))
      
    return circlesGroup;
  }
   
  function renderXCircles(testGroup, newXScale, chosenXAxis) {
    testGroup.transition()
      .duration(1000)
      .attr("cx", data=>newXScale(data[chosenXAxis]))
     
    return testGroup;
  }
  function renderXText(textGroup, newXScale, chosenXAxis) {
    textGroup.transition()
      .duration(1000)
      .attr("x", data=>newXScale(data[chosenXAxis]))
    
    return textGroup;
  }

  function renderYCircles(testGroup, newYScale, chosenYAxis) {
    testGroup.transition()
      .duration(1000)
     
      .attr("cy", data=>newYScale(data[chosenYAxis]))
    return testGroup;
  }

  function renderYText(textGroup, newYScale, chosenYAxis) {
    textGroup.transition()
      .duration(1000)
     
      .attr("y", data=>newYScale(data[chosenYAxis]))
    return textGroup;
  }


  // @TODO: YOUR CODE HERE!
  d3.csv("assets/data/data.csv").then(function(stateData, error) {
    if (error) console.log(error);

    stateData.forEach(function(data) {
      data.income = +data.income;
      data.age = +data.age;
      data.obesity =+data.obesity;
      data.poverty = +data.poverty;
      data.smokes = +data.smokes;
    });

    console.log(stateData);

    Object.entries(stateData).forEach(function([key,value]) {
      console.log(key,value);
    });

    var states = Object.values(stateData).map(data=>data.state);
    //console.log("state", states);
    var stateAb = Object.values(stateData).map(data=>data.abbr);
    //console.log("abbr", stateAb);
    var income = Object.values(stateData).map(data=>data.income);
    //console.log("income", income);
    var obesity = Object.values(stateData).map(data=>data.obesity);
    //console.log("obesity", obesity);
    var poverty = Object.values(stateData).map(data=>data.poverty);
    //console.log("poverty", poverty);
    var smokes = Object.values(stateData).map(data=>data.smokes);
    //console.log("smokes", smokes);

    Object.values(stateData).forEach(
        function(data) {
            data.income = +data.income;
            data.obesity =+data.obesity;
            data.poverty = +data.poverty;
            data.smokes = +data.smokes;
           // console.log("Income:", data.income);
           // console.log("Obesity:" , data.obesity);
           // console.log("Poverty:", data.poverty);
           // console.log("Smokes:", data.smokes);
        }
    );
    
    var xLinearScale = xScale(stateData, chosenXAxis);

    var yLinearScale = yScale(stateData, chosenYAxis);
 

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
      .classed("axisText", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    var yAxis = chartGroup.append("g")
      .classed("axisText", true)
      .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append('g')
    .attr("class", "point");


     var testGroup = circlesGroup.append("circle")
    .attr("cx", data => xLinearScale(data.poverty))
    .attr("cy", data => yLinearScale(data.obesity)) // data.obesity
    .attr("r", 10)
    .attr("fill", "#c6dbef")
    .attr("opacity", ".5");
    
 
     var textGroup = circlesGroup.append("text")
     .attr("x", data => xLinearScale(data.poverty))
     .attr("y", data => yLinearScale(data.obesity)) // data.obesity
     .attr('text-anchor', 'middle')
     .attr('alignment-baseline', 'middle')
     .style('font-size', '10')
     .text(function(data) {return data.abbr}).on("click",function(x1){
      toolTip.show(x1, this)
     }).on("mouseout",function(x1){
      toolTip.hide(x1)
     });
    
    
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(data) {
        return (`${data.state}<br>Y-Axis: ${data[chosenYAxis]}%<br>X-Axis: ${data[chosenXAxis]}%`);
      });


    chartGroup.call(toolTip);

    testGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
   
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    var labelsXGroup = chartGroup.append("g")
      .attr("transform", `translate(${width/2}, ${height + 20})`);

    var labelsYGroup = chartGroup.append("g")
      

    var povertyLabel = labelsXGroup.append("text")
      .attr("x",0)
      .attr("y",20)
      .attr("value", "poverty")
      .attr("dx","1em")
      .classed("active", true)
      .text("In Poverty (%)");

    var ageLabel = labelsXGroup.append("text")
      .attr("x",0)
      .attr("y",40)
      .attr("dx","1em")
      .attr("value", "age")
      .classed("inactive", true)
      .text("Age (Median)");

    var obesityLabel = labelsYGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height/2))
      .attr("dy","1em")
      .attr("value", "obesity")
      .classed("active", true)
      .text("Obesity (%)");

    var smokesLabel = labelsYGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 20 - margin.left)
      .attr("x", 0 - (height/2))
      .attr("dy", "1em")
      .attr("value", "smokes")
      .classed("inactive", true)
      .text("Smokes");


    labelsXGroup.selectAll("text")
      .on("click", function() {
        
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
          
          chosenXAxis = value;
          console.log(chosenXAxis)
          console.log(chosenYAxis)
          xLinearScale = xScale(stateData, chosenXAxis);
        
          xAxis = renderXAxes(xLinearScale, xAxis);

          testGroup = renderXCircles(testGroup, xLinearScale, chosenXAxis);
          textGroup = renderXText(textGroup, xLinearScale, chosenXAxis);
          

        

          if (chosenXAxis === "poverty") {
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
    });   
    labelsYGroup.selectAll("text")
      .on("click", function() {
        
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
          
          console.log(value)
          chosenYAxis = value;
          console.log(chosenYAxis)


          yLinearScale = yScale(stateData, chosenYAxis);
        
          yAxis = renderYAxes(yLinearScale, yAxis);

          testGroup = renderYCircles(testGroup, yLinearScale, chosenYAxis);
          textGroup = renderYText(textGroup, yLinearScale, chosenYAxis);


          if (chosenYAxis === "obesity") {
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
    });   
  });
} 

makeResponsive();

d3.select(window).on("resize", makeResponsive);