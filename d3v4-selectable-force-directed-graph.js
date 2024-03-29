function createV4SelectableForceDirectedGraph(svg, graph) {
    // if both d3v3 and d3v4 are loaded, we'll assume
    // that d3v4 is called d3v4, otherwise we'll assume
    // that d3v4 is the default (d3)
    if (typeof d3v4 == 'undefined')
        d3v4 = d3;

    var width = +svg.attr("width"),
        height = +svg.attr("height");

    let parentWidth = d3v4.select('svg').node().parentNode.clientWidth;
    // console.log(d3v4.select('svg').node());
    // let parentHeight = d3v4.select('svg').node().parentNode.clientHeight;
    // let parentWidth = screen.width;
    let parentHeight = window.innerHeight;

    var svg = d3v4.select('svg')
    .attr('width', parentWidth)
    .attr('height', parentHeight)

    // remove any previous graphs
    svg.selectAll('.g-main').remove();

    var gMain = svg.append('g')
    .classed('g-main', true);

    var rect = gMain.append('rect')
    .attr('width', parentWidth)
    .attr('height', parentHeight)
    .style('fill', '#696969')

    var gDraw = gMain.append('g');

    var zoom = d3v4.zoom()
    .on('zoom', zoomed)

    gMain.call(zoom);

    function zoomed() {
        gDraw.attr('transform', d3v4.event.transform);
    }

    var color = d3v4.scaleOrdinal(d3v4.schemeCategory20);

    if (! ("links" in graph)) {
        console.log("Graph is missing links");
        return;
    }

    var nodes = {};
    var i;
    for (i = 0; i < graph.nodes.length; i++) {
        nodes[graph.nodes[i].id] = graph.nodes[i];
        // graph.nodes[i].weight = 1.01;
    }

    // the brush needs to go before the nodes so that it doesn't
    // get called when the mouse is over a node
    var gBrushHolder = gDraw.append('g');
    var gBrush = null;

    var link = gDraw.append("g")
        .attr("class", "link")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); })
        .on("mousemove", function moveTooltip() {
                var [posX, posY] = [d3.event.x, d3.event.y];
                posX += posX > width / 2 ? -100 : 50;
                posY += posY > height / 2 ? -100 : 50;
                tooltip.interrupt()
                    .style("opacity", 1)
                    .html("Title: " + this.__data__.title + 
                    // "<br>URL: " + this.__data__.urlLink + 
                    "<br>Year: " + this.__data__.year + 
                    "<br>Overview: " + this.__data__.overview  )
                    .transition().duration(5000).ease(d3.easeLinear)
                    .style("left", posX + "px")
                    .style("top", posY + "px");
            }
        )
        .on("mouseout", hideTooltip);

        
    var node = gDraw.append("g")
        .attr("class", "node")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { 
            if ('color' in d)
                return d.color;
            else
                // console.log(this.__data__.name);
                return color(d.group);
        })
        .call(d3v4.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
        .on("mousemove",  function moveTooltip() {
                    var [posX, posY] = [d3.event.x, d3.event.y];
                    posX += posX > width / 2 ? -100 : 50;
                    posY += posY > height / 2 ? -100 : 50;
                    // console.log(this.__data__.name);
                    if (this.__data__.totalPaper != '')
                        if(this.__data__.degreeCentrality == 0 && 
                            this.__data__.closenessCentrality == 0 && 
                            this.__data__.betweennessCentrality == 0 && 
                            this.__data__.eigenvectorCentrality == 0)
                            tooltip.interrupt()
                                .style("opacity", 1)
                                .html("Name: " + this.__data__.name + 
                                // "<br>URL: " + this.__data__.urlLink + 
                                "<br>Total Papers: " + this.__data__.totalPaper + 
                                "<br>Total Coauthors: " + this.__data__.totalCoAuthor + 
                                "<br>Total Citations: " + this.__data__.totalCitation )
                                .transition().duration(5000).ease(d3.easeLinear)
                                .style("left", posX + "px")
                                .style("top", posY + "px");
                        else{
                            tooltip.interrupt()
                                .style("opacity", 1)
                                .html("Name: " + this.__data__.name + 
                                // "<br>URL: " + this.__data__.urlLink + 
                                // "<br>Total Papers: " + this.__data__.totalPaper + 
                                // "<br>Total Coauthors: " + this.__data__.totalCoAuthor + 
                                // "<br>Total Citations: " + this.__data__.totalCitation + 
                                "<br>Degree Centrality: " + this.__data__.degreeCentrality + 
                                "<br>Closeness Centrality: " + this.__data__.closenessCentrality + 
                                "<br>Betweenness Centrality: " + this.__data__.betweennessCentrality + 
                                "<br>Eigen Vector Centrality: " + this.__data__.eigenvectorCentrality )
                                .transition().duration(5000).ease(d3.easeLinear)
                                .style("left", posX + "px")
                                .style("top", posY + "px");
                        }
                    else {
                        if(this.__data__.degreeCentrality == 0 && 
                            this.__data__.closenessCentrality == 0 && 
                            this.__data__.betweennessCentrality == 0 && 
                            this.__data__.eigenvectorCentrality == 0)
                            tooltip.interrupt()
                                .style("opacity", 1)
                                .html("Name: " + this.__data__.name 
                                // +"<br>URL: " + this.__data__.urlLink 
                                )
                                .transition().duration(5000).ease(d3.easeLinear)
                                .style("left", posX + "px")
                                .style("top", posY + "px");
                        else{
                            tooltip.interrupt()
                                .style("opacity", 1)
                                .html("Name: " + this.__data__.name + 
                                "<br>Degree Centrality: " + this.__data__.degreeCentrality + 
                                "<br>Closeness Centrality: " + this.__data__.closenessCentrality + 
                                "<br>Betweenness Centrality: " + this.__data__.betweennessCentrality + 
                                "<br>Eigen Vector Centrality: " + this.__data__.eigenvectorCentrality  
                                )
                                .transition().duration(5000).ease(d3.easeLinear)
                                .style("left", posX + "px")
                                .style("top", posY + "px");
                        }
                    }
                }
            )
        .on("mouseout", hideTooltip);

    //https://blockbuilder.org/alexmacy/e81c67c1f0db4c4806ffdc4160c6e7d9
    var tooltip = d3.select("body").append("div")
        .attr("id", "tooltip")
        .html("")
        .on("mouseover",     function moveTooltip() {
            var [posX, posY] = [d3.event.x, d3.event.y];
            posX += posX > width / 2 ? -100 : 50;
            posY += posY > height / 2 ? -100 : 50;
            
            tooltip.interrupt()
                .style("opacity", 1)
                .html("Pointer x-axis: " + d3.event.x + "<br>Pointer y-axis: " + d3.event.y)
                .transition().duration(200).ease(d3.easeLinear)
                .style("left", posX + "px")
                .style("top", posY + "px");
            })
        .on("click", clicked);

    // function moveTooltip() {
    //     var [posX, posY] = [d3.event.x, d3.event.y];
    //     posX += posX > width / 2 ? -100 : 50;
    //     posY += posY > height / 2 ? -100 : 50;
        
    //     tooltip.interrupt()
    //         .style("opacity", 1)
    //         .html("Name: " + 10 + "<br>y: " + 10)
    //         .transition().duration(200).ease(d3.easeLinear)
    //         .style("left", posX + "px")
    //         .style("top", posY + "px");
    //     }
        
    function hideTooltip() {
        tooltip.interrupt()
            .transition().duration(1000)
            .style("opacity", 0)
        }
        
    function clicked() {
        flashRect
            .transition().duration(500)
            .style("fill-opacity", 1)
            .transition().duration(500)
            .style("fill-opacity", 0)
        }
                  
    // add titles for mouseover blurbs
    node.append("title")
        .text("Person");

    link.append("title")
        .text("Publication");

    // link.append("title")
    //     .text(function(d) {
    //             return d.title;
    // });

    var simulation = d3v4.forceSimulation()
        .force("link", d3v4.forceLink()
                .id(function(d) { return d.id; })
                .distance(function(d) { 
                    return 30;
                    //var dist = 20 / d.value;
                    //console.log('dist:', dist);

                    return dist; 
                })
              )
        .force("charge", d3v4.forceManyBody())
        .force("center", d3v4.forceCenter(parentWidth / 2, parentHeight / 2))
        .force("x", d3v4.forceX(parentWidth/2))
        .force("y", d3v4.forceY(parentHeight/2));

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        // update node and line positions at every step of 
        // the force simulation
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    var brushMode = false;
    var brushing = false;

    var brush = d3v4.brush()
        .on("start", brushstarted)
        .on("brush", brushed)
        .on("end", brushended);

    function brushstarted() {
        // keep track of whether we're actively brushing so that we
        // don't remove the brush on keyup in the middle of a selection
        brushing = true;
 
        node.each(function(d) {
            d.previouslySelected = shiftKey && d.selected;
        });
    }

    rect.on('click', () => {
        node.each(function(d) {
            d.selected = false;
            d.previouslySelected = false;
        });
        node.classed("selected", false);
    });

    function brushed() {
        if (!d3v4.event.sourceEvent) return;
        if (!d3v4.event.selection) return;

        var extent = d3v4.event.selection;

        node.classed("selected", function(d) {
            return d.selected = d.previouslySelected ^
            (extent[0][0] <= d.x && d.x < extent[1][0]
             && extent[0][1] <= d.y && d.y < extent[1][1]);
        });
    }

    function brushended() {
        if (!d3v4.event.sourceEvent) return;
        if (!d3v4.event.selection) return;
        if (!gBrush) return;

        gBrush.call(brush.move, null);

        if (!brushMode) {
            // the shift key has been release before we ended our brushing
            gBrush.remove();
            gBrush = null;
        }

        brushing = false;
    }

    d3v4.select('body').on('keydown', keydown);
    d3v4.select('body').on('keyup', keyup);

    var shiftKey;

    function keydown() {
        shiftKey = d3v4.event.shiftKey;

        if (shiftKey) {
            // if we already have a brush, don't do anything
            if (gBrush)
                return;

            brushMode = true;

            if (!gBrush) {
                gBrush = gBrushHolder.append('g');
                gBrush.call(brush);
            }
        }
    }

    function keyup() {
        shiftKey = false;
        brushMode = false;

        if (!gBrush)
            return;

        if (!brushing) {
            // only remove the brush if we're not actively brushing
            // otherwise it'll be removed when the brushing ends
            gBrush.remove();
            gBrush = null;
        }
    }

    function dragstarted(d) {
      if (!d3v4.event.active) simulation.alphaTarget(0.9).restart();

        if (!d.selected && !shiftKey) {
            // if this node isn't selected, then we have to unselect every other node
            node.classed("selected", function(p) { return p.selected =  p.previouslySelected = false; });
        }

        d3v4.select(this).classed("selected", function(p) { d.previouslySelected = d.selected; return d.selected = true; });

        node.filter(function(d) { return d.selected; })
        .each(function(d) { //d.fixed |= 2; 
          d.fx = d.x;
          d.fy = d.y;
        })

    }

    function dragged(d) {
      //d.fx = d3v4.event.x;
      //d.fy = d3v4.event.y;
            node.filter(function(d) { return d.selected; })
            .each(function(d) { 
                d.fx += d3v4.event.dx;
                d.fy += d3v4.event.dy;
            })
    }

    function dragended(d) {
      if (!d3v4.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
        node.filter(function(d) { return d.selected; })
        .each(function(d) { //d.fixed &= ~6; 
            d.fx = null;
            d.fy = null;
        })
    }

    var texts = ['Hold the shift key to select nodes',
                    'Use the scroll wheel to zoom']

    svg.selectAll('text')
        .data(texts)
        .enter()
        .append('text')
        .attr('x', 900)
        .attr('y', function(d,i) { return parentHeight - (i+1) * 20;})
        // .attr('y', function(d,i) { return 470 + i * 18; })
        .text(function(d) { return d; });

    return graph;
};
