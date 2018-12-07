function makeResponsive() {
  
  var svgArea = d3.select("body").select("svg");

  if(!svgArea.empty()) {
    svgArea.remove();
  }

  var svgWidth = parseInt(d3.select("#scatterplot").style("width"));
  var svgHeight = svgWidth - (svgWidth / 3.9);
//is there a better way to size this?
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
  //attempted to add Ychosenaxis
  //var chosenYAxis = "smokes";

  //function xScale(stateData, chosenXAxis) {
  //  var xLinearScale = d3.scaleLinear()
  //    .domain([d3.min(stateData, data=>data[chosenXAxis]),
  //      d3.max(stateData, data=>data[chosenXAxis])
  //    ])
  //   .range([0,width]);
  // return xLinearScale;
  //}  Took this out because I couldnt get the scale right, hard coded
  function xScale(stateData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
      .domain([8,d3.max(stateData, data=>data[chosenXAxis])])
      .range([0,width]);
    
    return xLinearScale;

  }
  function yScale(stateData,chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
      .domain([15,d3.max(stateData, data=>data[chosenYAxis])])
      .range([height, 0]);

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
   
  function renderXCircles(circlesGroup,newXScale, chosenXAxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", data=>newXScale(data[chosenXAxis]))
      //.attr("cy", data=>newYScale(data[chosenYAxis]));
    return circlesGroup;
  }

  function renderYCircles(circlesGroup,newYScale, chosenYAxis) {
    circlesGroup.transition()
      .duration(1000)
      //.attr("cx", data=>newXScale(data[chosenXAxis]))
      .attr("cy", data=>newYScale(data[chosenYAxis]))
    return circlesGroup;
  }
  //function updateToolTip(chosenXAxis, circlesGroup) {
    
  // if(chosenXAxis === "poverty") {
  //    var label = "In Poverty (%)";
  //  }
  //  else {
  //    var label = "Age (Median)";
  //    }
  //  var toolTip = d3.tip()
  //    .attr("class", "tooltip")
  //    .offset([80, -60])
  ///    .html(function(data) {
  //      return (`${data.abbr}<br>${label} ${data[chosenXAxis]}`);
  //    });

   // circlesGroup.call(toolTip);

   // circlesGroup.on("mouseover", function(data) {
   //   toolTip.show(data);
   // })
   //   .on("mouseout", function(data,index) {
  //      toolTip.hide(data);
   //   });
   // return circlesGroup;
  //}

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
    //var yLinearScale = d3.scaleLinear()
    //.domain([18, d3.max(stateData, data => data.obesity)])
    //.range([height, 0]);

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


     var testgroup = circlesGroup.append("circle")
    .attr("cx", data => xLinearScale(data.poverty))
    .attr("cy", data => yLinearScale(data.obesity))
    .attr("r", 10)
    .attr("fill", "#c6dbef")
    .attr("opacity", ".5");
    
    // var circlesText = chartGroup.selectAll("circle")
    //  .data(stateData)
    //  .enter()
    // var textgroup = circlesGroup.append("text")
     //.attr("class", "text")
     circlesGroup.append("text")
     .attr("x", data => xLinearScale(data.poverty))
     .attr("y", data => yLinearScale(data.obesity))
     .attr('text-anchor', 'middle')
     .attr('alignment-baseline', 'middle')
     .style('font-size', '10')
     .text(function(d) {return d.abbr;}).on("click",function(x1){
      toolTip.show(x1, this)
     }).on("mouseout",function(x1){
      toolTip.hide(x1)
     });
    //trying to append text to a circle, below working?
    //.append("text")
     //.text(function(d) {return data.abbr})
     //.attr("x")
     //.attr("y");
    //.text(`${data.abbr}`); // Tried to append text to the circle
    //had to put tooltip here to make it work, wouldnt work with the other coding
    
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(data) {
        return (`${data.state}<br>Y-Axis: ${data[chosenYAxis]}%<br>X-Axis: ${data[chosenXAxis]}%`);
      });


    chartGroup.call(toolTip);

    testgroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width/2}, ${height + 20})`);

    var labelsBGroup = chartGroup.append("g")
      

    var povertyLabel = labelsGroup.append("text")
      .attr("x",0)
      .attr("y",20)
      .attr("value", "poverty")
      .classed("active", true)
      .text("In Poverty (%)");

    var ageLabel = labelsGroup.append("text")
      .attr("x",0)
      .attr("y",40)
      .attr("value", "age")
      .classed("active", true)
      .text("Age (Median)");

    var obesityLabel = labelsBGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height/2))
      .attr("dy","1em")
      .classed("active", true)
      .text("Obesity (%)");

    var smokesLabel = labelsBGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 20 - margin.left)
      .attr("x", 0 - (height/2))
      .attr("dy", "1em")
      .classed("active", true)
      .text("Smokes");
    //var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    labelsGroup.selectAll("text")
      .on("click", function() {
        
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
          
          chosenXAxis = value;
          console.log(chosenXAxis)
          xLinearScale = xScale(stateData, chosenXAxis);
        
          xAxis = renderXAxes(xLinearScale, xAxis);

          testgroup = renderXCircles(testgroup, xLinearScale, chosenXAxis);
          //textgroup = renderCircles(textgroup, xLinearScale, chosenXAxis);

          //circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

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
    labelsBGroup.selectAll("text")
      .on("click", function() {
        
        var valuetwo = d3.select(this).attr("value");
        if (valuetwo !== chosenYAxis) {
          
          chosenYAxis = valuetwo;
          console.log(chosenYAxis)

          yLinearScale = yScale(stateData, chosenYAxis);
        
          yAxis = renderYAxes(yLinearScale, yAxis);

          testgroup = renderYCircles(testgroup, yLinearScale, chosenYAxis);
          //textgroup = renderCircles(textgroup, xLinearScale, chosenXAxis);

          //circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

          if (chosenXAxis === "obesity") {
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