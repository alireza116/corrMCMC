function LineChartDraw(chartID,variables){
    var line;
    var uncertainty;
    var uncertaintyPaths;
    var lineG;
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

    // if (chartID==="chart2"){
    //     svg.append("text").attr("id","M")
    //         .attr("text-anchor","middle")
    //         .attr("x",width/2)
    //         .attr("y",height+40)
    //         .attr("font-size",40)
    //         .text("M");
    // } else {
    //     svg.append("text").attr("id","C")
    //         .attr("text-anchor","middle")
    //         .attr("x",width/2)
    //         .attr("y",height+40)
    //         .attr("font-size",40)
    //         .text("C");
    // }


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
    lineG = svg.append("g").attr("class","lineContainer");
    // lineG.attr("clip-path","url(#rect-clip)");
//                console.log(focusNumber);
    uncertainty = lineG.append("path").attr("class","uncertainty").attr("fill","grey").attr("fill-opacity",0);
    uncertaintyPaths = lineG.append("g");
    line = lineG.append("path")
        .data([dataset]) // 10. Binds data to the line
        .attr("class", "line") // Assign a class for styling
        .attr("d", valueLine)
        .attr("fill","none")
        .attr("stroke","#ffab00")
        .attr("stroke-width",5);


    line.attr("transform","translate("+width/2+","+ (-height/2)+")")
};

var selected = false;
var uncertaintySelected = false;
    var center = [width/2,height/2];
    var xVector = [width-center[0],height/2-center[1]];
    var posDegree;
    var selectedAngle;
    var centerPos;
    var centerPos1;
    var minAngle;
    var maxAngle;
    svg
        .append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .attr("stroke", 0)
        .attr("fill-opacity",0)
        .on("click", function() {
            console.log("kir");
            if (!selected){
                selected = true;
            } else if(!uncertaintySelected) {
                uncertaintySelected = true;
            }

            console.log(slopeScale.invert(posDegree))
        })
        .on("mousemove", function () {
            dataset= []
            var m = d3.mouse(this);
            var mousPosVect = [m[0]-center[0],height-m[1]-center[1]];
            var angle = Math.atan2(mousPosVect[1],mousPosVect[0]) - Math.atan2(xVector[1],xVector[0]);
            // if (angle < 0) { angle += 2 * Math.PI; }
            posDegree = angle * 180 / Math.PI;
            if (posDegree > 45 && posDegree < 90){
                posDegree = 45
            } else if (posDegree >=90 && posDegree < 135 ) {posDegree = -45}
            else if (posDegree <-45 && posDegree > -90) {posDegree = -45}
            else if (posDegree <= - 90 && posDegree > -135){posDegree=45}
            // else if (posDegree < 135) {posDegree = -45}
            // else if (posDegree < -45 && posDegree > -90) {
            //     posDegree = -45
            // }
            if (posDegree > 45) {
                posDegree = -180 + posDegree;
            } else if (posDegree < -45) {
                posDegree = 180 + posDegree
            }


            // console.log(posDegree);
            // console.log(m);
            if (!selected){
                var pos1Radians = posDegree * Math.PI / 180;
                var pos2Radians = (posDegree + 180) * Math.PI / 180;
                var posy= Math.sin(pos1Radians) /2;
                var posx = Math.cos(pos1Radians) /2;
                var posy1 = Math.sin(pos2Radians)/2;
                var posx1 = Math.cos(pos2Radians)/2;
                var pos = {x:posx,y:posy};
                var pos1 = {x:posx1,y:posy1};
                centerPos = pos;
                centerPos1 = pos1;
                dataset.push(pos);
                dataset.push(pos1);
                line.data([dataset]).attr("d",valueLine);
                selectedAngle = posDegree;
            } else if (!uncertaintySelected) {
                var pos1Radians = posDegree * Math.PI / 180;
                var pos2Radians = (posDegree + 180) * Math.PI / 180;
                var angle1Diff = posDegree - selectedAngle;
                var otherAngle = posDegree - 2 *angle1Diff;
                minAngle = posDegree;
                maxAngle = otherAngle;
                var pos3Radians = otherAngle * Math.PI / 180;
                var pos4Radians = (otherAngle+180) * Math.PI /180;
                var posy= Math.sin(pos1Radians) /2;
                var posx = Math.cos(pos1Radians) /2;
                var posy1 = Math.sin(pos2Radians)/2;
                var posx1 = Math.cos(pos2Radians)/2;
                var posy2 = Math.sin(pos4Radians)/2;
                var posx2 = Math.cos(pos4Radians)/2;
                var posy3 = Math.sin(pos3Radians)/2;
                var posx3 = Math.cos(pos3Radians)/2;
                var pos = {x:posx,y:posy};
                var pos1 = {x:posx1,y:posy1};
                var pos2 = {x:posx2,y:posy2};
                var pos3 = {x:posx3,y:posy3};
                dataset.push(pos);
                dataset.push(pos1);
                dataset.push(centerPos1);
                dataset.push(pos2);
                dataset.push(pos3);
                dataset.push(centerPos);
                uncertainty.data([dataset]).attr("d",valueLine);
                uncertainty.attr("transform","translate("+width/2+","+ (-height/2)+")")
                makeUncertainty(50);
            }
        });

    function makeUncertainty(n){
        var uniform = d3.randomNormal(selectedAngle,(maxAngle-minAngle)/6);
        uncertaintyPaths.selectAll("path").remove();
        console.log([minAngle,maxAngle]);
        console.log("uncertainty paths");
        for (var i=0; i <n;i++){
            var dataset =[];
            var posDegree = uniform();
            console.log(posDegree);
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
            uncertaintyPaths.append("path").data([dataset]).attr("d",valueLine).attr("class","uncertaintyPaths").attr("fill","none").attr("stroke","lightgrey").attr("stroke-opacity",0.7);
            uncertaintyPaths.attr("transform","translate("+width/2+","+ (-height/2)+")");
        }
    }


}
