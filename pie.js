
//https://codepen.io/thecraftycoderpdx/pen/jZyzKo
//https://bl.ocks.org/mbostock/1346395
//https://bl.ocks.org/cflavs/ff1c6005fd7edad32641

/** 
var dataset = [
    {label: "Assamese", count: 13},
    {label: "Bengali", count: 83},
    {label: "Bodo", count: 1.4},
    {label: "Dogri", count: 2.3},
  ];
  */

// chart dimensions **
var width = 1300;
var height = 800;

// a circle chart needs a radius **
var radius = height / 2.5;

// legend dimensions --
var legendRectSize = 25; // defines the size of the colored squares in legend
var legendSpacing = 6; // defines spacing between squares

// define color scale **
//var color = d3.scaleOrdinal(d3.schemeCategory20b);

//var color = d3.scaleSequential().interpolator(d3.interpolateRgb(pie, pie));
// more color scales: https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9
//var color = d3.scaleOrdinal(d3.schemeCategory20c)
//var color = d3.scaleOrdinal()
    //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
//var color = d3.scaleSequential().domain([1,100])
    //.interpolator(d3.interpolateViridis);
    // ** this does d3.select('#chart') vs. d3.select('body') **
var svg = d3.select('body') // select element in the DOM with id 'chart'
  .append('svg') // append an svg element to the element we've selected
  .attr('width', width) // set the width of the svg element we just added
  .attr('height', height) // set the height of the svg element we just added
  .append('g') // append 'g' element to the svg element
  .attr('transform', 'translate(' + (width / 3) + ',' + (height / 2) + ')'); // our reference is now to the 'g' element. centerting the 'g' element to the svg element

var arc = d3.arc() // ** 
  .innerRadius(0) // none for pie chart
  .outerRadius(radius); // size of overall chart

var pie = d3.pie() // start and end angles of the segments
  .value(function(d) { return d.data_usage; }); // how to extract the numerical data from each entry in our dataset
  //.sort(null); // by default, data sorts in descending value. this will mess with our animation so we set it to null

// define tooltip

var tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip");


                
/** 
var tooltip = d3.select('#pie') // select element in the DOM with id 'chart' (changed to pie)
  .append('div') // append a div element to the element we've selected                                    
  .attr('class', 'tooltip'); // add class 'tooltip' on the divs we just selected

tooltip.append('div') // add divs to the tooltip defined above                            
  .attr('class', 'user'); // add class 'label' on the selection                         

tooltip.append('div') // add divs to the tooltip defined above                     
  .attr('class', 'data_usage'); // add class 'count' on the selection                  

//tooltip.append('div') // add divs to the tooltip defined above  
 // .attr('class', 'percent'); // add class 'percent' on the selection

// Confused? see below:

// <div id="chart">
//   <div class="tooltip">
//     <div class="label">
//     </div>
//     <div class="count">
//     </div>
//     <div class="percent">
//     </div>
//   </div>
// </div>
*/


//from https://bl.ocks.org/mbostock/1346395

d3.tsv("data_ordered.tsv").then(function(data) {
    data.forEach(function(d) {
        d.data_usage = +d.data_usage;
    });
    var color = d3.scaleOrdinal().domain(data).range(d3.schemeRdYlGn[11]);
    ////////////////////////////////////////////////////////////////
    ///////////////APPLES N ORANGES INTERACTION STUFF ///////////////
    ////////////////////////////////////////////////////////////////
    /**  for the interaction
    d3.selectAll("input")
        .on("change", change);
  
    var timeout = setTimeout(function() {
      d3.select("input[value=\"oranges\"]").property("checked", true).each(change);
    }, 2000);
  
    function change() {
      var value = this.value;
      clearTimeout(timeout);
      pie.value(function(d) { return d[value]; }); // change the value function
      path = path.data(pie); // compute the new angles
      path.attr("d", arc); // redraw the arcs
    }
    */


    var mouseover = function(d){
        tooltip.style("display", "block")
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 70 + "px")
        .html(d.data.user + "\n" + d.data.data_usage);
    }
    var mousemove = function(d) {
        tooltip
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 70 + "px")
        .style("display", "block")
        .html(d.data.user + "\n" + d.data.data_usage); 
    }
    var  mouseleave = function(d){
        tooltip.style("display", "none");
    }

    var path = svg.selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        //.attr("fill", function(d, i) { return color(i); })
        .attr("d", arc)
        .attr('fill', function(d, i) {return color(i) }) 
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);


    var legend = svg.selectAll('.legend')
    .data(pie(data))
    .enter()
    .append('g')
    .attr('transform', function(d, i) {
        var height = (legendRectSize + legendSpacing);
        var offset =  height * color.domain().length / 2 + 100;
        var horz = radius + 50;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
    });
    legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)                                   
    .style('fill', function(d, i){return color(i) })
    .style('stroke', color);

    legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) {
        console.log(d.data.user); 
        return d.data.user; });
  });
/** 
// define legend
var legend = svg.selectAll('.legend') // selecting elements with class 'legend'
  .data(color.domain()) // refers to an array of labels from our dataset
  .enter() // creates placeholder
  .append('g') // replace placeholders with g elements
  .attr('class', 'legend') // each g is given a legend class
  .attr('transform', function(d, i) {                   
    var height = legendRectSize + legendSpacing; // height of element is the height of the colored square plus the spacing      
    var offset =  height * color.domain().length / 2; // vertical offset of the entire legend = height of a single element & half the total number of elements  
    var horz = 18 * legendRectSize; // the legend is shifted to the left to make room for the text
    var vert = i * height - offset; // the top of the element is hifted up or down from the center using the offset defiend earlier and the index of the current element 'i'               
      return 'translate(' + horz + ',' + vert + ')'; //return translation       
   });

// adding colored squares to legend
legend.append('rect') // append rectangle squares to legend                                   
  .attr('width', legendRectSize) // width of rect size is defined above                        
  .attr('height', legendRectSize) // height of rect size is defined above                      
  .style('fill', color) // each fill is passed a color
  .style('stroke', color) // each stroke is passed a color
  .on('click', function(label) {
    var rect = d3.select(this); // this refers to the colored squared just clicked
    var enabled = true; // set enabled true to default
    var totalEnabled = d3.sum(dataset.map(function(d) { // can't disable all options
      return (d.enabled) ? 1 : 0; // return 1 for each enabled entry. and summing it up
    }));

    if (rect.attr('class') === 'disabled') { // if class is disabled
      rect.attr('class', ''); // remove class disabled
    } else { // else
      if (totalEnabled < 2) return; // if less than two labels are flagged, exit
      rect.attr('class', 'disabled'); // otherwise flag the square disabled
      enabled = false; // set enabled to false
    }

    pie.value(function(d) { 
      if (d.label === label) d.enabled = enabled; // if entry label matches legend label
        return (d.enabled) ? d.count : 0; // update enabled property and return count or 0 based on the entry's status
    });

    path = path.data(pie(dataset)); // update pie with new data

    path.transition() // transition of redrawn pie
      .duration(750) // 
      .attrTween('d', function(d) { // 'd' specifies the d attribute that we'll be animating
        var interpolate = d3.interpolate(this._current, d); // this = current path element
        this._current = interpolate(0); // interpolate between current value and the new value of 'd'
        return function(t) {
          return arc(interpolate(t));
        };
      });
  });

// adding text to legend
legend.append('text')                                    
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d) { return d; }); // return label
  */ 
