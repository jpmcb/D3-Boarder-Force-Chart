var w = (window.innerWidth * 0.9), h = (window.innerHeight * 1.2), r = 6;
var margin = {top: 0, bottom: 0, left: 0, right: 0}

var svg = d3.select('.root').append('svg')
            .attr('width', w)
            .attr('height', h);

var simulation = d3.forceSimulation() //set force simulation properties
                  .force('link', d3.forceLink())
                  .force('charge', d3.forceManyBody()
                         .strength([-50])
                         .distanceMax([300])
                         .distanceMin([30]))
                  .force('center', d3.forceCenter(w / 2, h / 2));


//AJAX call to pull data
d3.json('https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json', function(error, data) {
  
  if(error) throw error;
  
  var toolTip = d3.select('body').append('div')
                   .attr('class', 'toolTip')
                   .style('oppacity', '0')
                   .style('position','absolute');
  
  function dragStart(d) {
    if (!d3.event.active) {
      simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }}

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }


  // function dragEnd(d) { //USE IF WANT FORCE TO RETURN TO PREVIOUS
  //   if (!d3.event.active) {simulation.alphaTarget(0);
  //   d.fx = null;
  //   d.fy = null;
  // }}
  

  var link = svg.append('g')
    .attr('class', 'links')
    .attr('width', w)
      .selectAll('line')
        .data(data.links)
        .enter().append('line');
  
  var node = svg.append('g')
    .attr('class', 'nodes')
    .attr('height', h)
      .selectAll('circle')
        .data(data.nodes)
        .enter().append('circle')
          .attr('r', r)
          .on('mousemove', function(d,i) {
            toolTip.style('opacity', '1')
                    .style('left', (d3.event.pageX + 25) + 'px')
                    .style('top', (d3.event.pageY + 25)+ 'px');
            
            toolTip.html('<h2>' + d.country + '</h2>');
          })
          .on('mouseout', function(d,i) {
            toolTip.style('opacity','0')
          })
          .call(d3.drag()
                .on('start', dragStart)
                .on('drag', dragged));
                //.on('end', dragEnd));
  
  simulation
    .nodes(data.nodes)
    .on('tick', ticked);
  
  simulation.force('link')
    .links(data.links);
  
  function ticked() {
    link
      .attr('x1', function(d) { return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; });
    
    node
      .attr('cx', function(d) { return d.x = Math.max(r, Math.min(w-r, d.x)); })
      .attr('cy', function(d) { return d.y = Math.max(r, Math.min(h-r, d.y)); });
  }
  
  svg.append('text')
    .attr('x', 120)
    .attr('y', 30)
    .text('Hover a plot-point to see the country');
  
  svg.append('text')
    .attr('x', 80)
    .attr('y', 60)
    .text('Click and drag a point to move it');
});