function LineChartMC(chartID,variables){
    var line;
    var cwidth = document.querySelector("#"+chartID).clientWidth;
    var cheight = document.querySelector("#"+chartID).clientHeight;
    var cwidth = $("#"+chartID).width();
    var cheight = $("#"+chartID).height();
    cwidth = cheight;
    console.log(cwidth);
    console.log(cheight);
    var margin = {top: 70, right: 70, bottom: 70, left: 70}
        , width = cwidth - margin.left - margin.right // Use the window's width
        , height = cheight - margin.top - margin.bottom; // Use the window's height
    var slopeScale = d3.scaleLinear().domain([1,-1]).range([45,-45]);

// 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
        .domain([0, 1]) // input
        .range([0, width]); // output

// 6. Y scale will use the randomly generate number
    var yScale = d3.scaleLinear()
        .domain([0, 1]) // input
        .range([height, 0]); // output

// 7. d3's line generator
    var valueLine = d3.line()
        .x(function(d, i) { return xScale(d.x); }) // set the x values for the line generator
        .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
        .curve(d3.curveLinear); // apply smoothing to the line

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
//    var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } });
    var dataset = [];
//    console.log(dataset);
// 1. Add the SVG to the page and employ #2
    var svg = d3.select("#"+chartID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        // .attr("clip-path", "url(#rect-clip)");

    if (chartID==="chart2"){
        svg.append("text").attr("id","M")
            .attr("text-anchor","middle")
            .attr("x",width/2)
            .attr("y",height+40)
            .attr("font-size",40)
            .text("M");
    } else {
        svg.append("text").attr("id","C")
            .attr("text-anchor","middle")
            .attr("x",width/2)
            .attr("y",height+40)
            .attr("font-size",40)
            .text("C");
    }


// 3. Call the x axis in a group tag
    var xAxis = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height /2+ ")")
        .call(d3.axisBottom(xScale).ticks([])); // Create an axis component with d3.axisBottom



// 4. Call the y axis in a group tag
    var yAxis = svg.append("g")
        .attr("class", "y axis").attr("transform","translate("+width/2+",0)")
        .call(d3.axisLeft(yScale).ticks([])); // Create an axis component with d3.axisLeft
// 9. Append the path, bind the data, and call the line generator
    svg
        .append("clipPath") // define a clip path
        .attr("id", "rect-clip") // give the clipPath an ID
        .append("rect") // shape it as an ellipse
        .attr("width", width+margin.left) // position the x-centre
        .attr("height", height+margin.top)
        .attr("transform","translate("+-margin.left+","+-margin.top+")"); // position the y-centre



    svg.append("text").attr("id","x label")
        .attr("text-anchor","start")
        .attr("x",width+ 10)
        .attr("y",height/2+10)
        .text(variables[0]);

    svg.append("text").attr("id","y label")
        .attr("text-anchor","middle")
        .attr("x",width/2 )
        .attr("y",-10)
        .text(variables[1]);

    // var pos = {x:0,y:0};
this.createChart = function(corr){

    var posDegree = slopeScale(corr);
    var pos1Radians = posDegree * Math.PI / 180;
    var pos2Radians = (posDegree + 180) * Math.PI / 180;
    var posy= Math.sin(pos1Radians) /2;
    var posx = Math.cos(pos1Radians) /2;
    var posy1 = Math.sin(pos2Radians)/2;
    var posx1 = Math.cos(pos2Radians)/2;
    var pos = {x:posx,y:posy};
    var pos1 = {x:posx1,y:posy1};
//                console.log(focusPoint);
    dataset.push(pos);
    dataset.push(pos1);
    console.log(dataset);
    var lineG = svg.append("g").attr("class","lineContainer");
    // lineG.attr("clip-path","url(#rect-clip)");
//                console.log(focusNumber);
    line = lineG.append("path")
        .data([dataset]) // 10. Binds data to the line
        .attr("class", "line") // Assign a class for styling
        .attr("d", valueLine)
        .attr("fill","none")
        .attr("stroke","#ffab00")
        .attr("stroke-width",5);

    // fill: none;
    // stroke: #ffab00;
    // stroke-width: 5;
    // pointer-events: none;
    // ; // 11. Calls the line generator

    line.attr("transform","translate("+width/2+","+ (-height/2)+")")
};

this.updateChart = function(corr){
    dataset = [];
    var posDegree = slopeScale(corr);
    var pos1Radians = posDegree * Math.PI / 180;
    var pos2Radians = (posDegree + 180) * Math.PI / 180;
    var posy= Math.sin(pos1Radians) /2;
    var posx = Math.cos(pos1Radians) /2;
    var posy1 = Math.sin(pos2Radians)/2;
    var posx1 = Math.cos(pos2Radians)/2;
    var pos = {x:posx,y:posy};
    var pos1 = {x:posx1,y:posy1};
    dataset.push(pos);
    dataset.push(pos1);
    line.data([dataset]).transition().attr("d",valueLine);

};

this.highlightLine = function(){
    var oldStroke = xAxis.attr("stroke-width");
    xAxis.select("path").transition().attr("stroke-width",5).duration(500).transition().attr("stroke-width",oldStroke).duration(500);
    yAxis.select("path").transition().attr("stroke-width",5).duration(500).transition().attr("stroke-width",oldStroke).duration(500);

}


}
