GraphNodeCtrl.$inject = ['$scope', '$http'];

angular.module('webapps')
.controller('GraphNodeCtrl', GraphNodeCtrl);

function GraphNodeCtrl($scope, $http) {
    //Search function
    $scope.dept = {};
    $scope.compareDept = {};
    $scope.availableDept = [];
    var url = '/alldept';

    $scope.funcAsync = function (query) {
        $http.get(url).then(
            function (response) {
                $scope.availableDept = response.data;
                console.log(response);
            },
            function () {
                console.log('Error');
            }
            );
    };

    $scope.reloadGraph = function () {
        generateData($scope.dept.selected, '#nodeGraph');
    };

    $scope.reloadCompareGraph = function () {
        generateData($scope.dept.selected, '#compareNodeGraph');  
    };

    //testing
    // generateData("lol","lol");
    function generateData(dept, graphID) {

        var url = "/emaildata/" + dept;

        d3.json(url, function(error, links) {

            var nodes = {};
            
            if(error) {
                console.log('URL not found.');
            }

            //testing
            // var links = [
            // {
            //     "source" : "lol",
            //     "target" : "haha"
            // }
            // ];
            // graphID = '#nodeGraph';

            links.forEach( function(link) {
                link.source = nodes[link.source] || 
                (nodes[link.source] = {name: ''});
                link.target = nodes[link.target] || 
                (nodes[link.target] = {name: link.target});
            });

            var width = 500,
            height = 500;

            var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([width, height])
            .linkDistance(60)
            .charge(-300)
            .on("tick", tick)
            .start();

            var zoom = d3.behavior.zoom()
            .scaleExtent([0.1, 10])
            .scale(0.1)
            .on("zoom", zoomed);

            var svg = d3.select(graphID).append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("pointer-events", "all")
              .append('svg:g')
                .call(zoom)
              .append('svg:g');

            svg.append('svg:rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'none');

        // build the arrow.
        svg.append("svg:defs").selectAll("marker")
            .data(["end"])      // Different link/path types can be defined here
          .enter().append("svg:marker")    // This section adds in the arrows
          .attr("id", String)
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 15)
          .attr("refY", -1.5)
          .attr("markerWidth", 6)
          .attr("markerHeight", 6)
          .attr("orient", "auto")
          .append("svg:path")
          .attr("d", "M0,-5L10,0L0,5");

        // add the links and the arrows
        var path = svg.append("svg:g").selectAll("path")
        .data(force.links())
        .enter().append("svg:path")
        //    .attr("class", function(d) { return "link " + d.type; })
        .attr("class", "link")
        .attr("marker-end", "url(#end)");

        // define the nodes
        var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", "node")
        .call(force.drag);

        // add the nodes
        node.append("circle")
        .attr("r", 5);

        // add the text 
        node.append("text")
        .attr("x", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

        // add the curvy lines
        function tick() {
            path.attr("d", function(d) {
                var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
                return "M" + 
                d.source.x + "," + 
                d.source.y + "A" + 
                dr + "," + dr + " 0 0,1 " + 
                d.target.x + "," + 
                d.target.y;
            });

            node
            .attr("transform", function(d) { 
                return "translate(" + d.x + "," + d.y + ")"; });
        }


        function zoomed() {
          svg.attr("transform",
              "translate(" + d3.event.translate + ")"
              + " scale(" + d3.event.scale + ")");
        }

    });
};
};