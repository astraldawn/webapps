GraphNodeCtrl.$inject = ['$scope', '$http'];

angular.module('webapps')
    .controller('GraphNodeCtrl', GraphNodeCtrl);

function GraphNodeCtrl($scope, $http) {

    //Search function
    $scope.dept = {};
    $scope.compareDept = {};
    $scope.availableDept = [];
    $scope.leftGraphDisplay = true;
    $scope.rightGraphDisplay = true;

    var departmentUrl = '/alldept';
    var appendDateUrl = '/getdate';
    var appendEmailUrl = "/emaildata/";

    var leftGraph = '#nodeGraph';
    var rightGraph = '#compareNodeGraph';

    $scope.funcAsync = function (query) {
        $http.get(departmentUrl).then(
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
        generateGraphDates($scope.dept.selected, leftGraph);
    };

    $scope.reloadCompareGraph = function () {
        generateGraphDates($scope.compareDept.selected, rightGraph);
    };

    $scope.filterLeftGraphByDate = function () {
        if ($scope.leftGraphDateFrom > $scope.leftGraphDateTo) {
            return;
        } else {
            generateData($scope.dept.selected, leftGraph);
        }
    };

    $scope.filterRightGraphByDate = function () {
        if ($scope.rightGraphDateFrom > $scope.rightGraphDateTo) {
            return;
        } else {
            generateData($scope.compareDept.selected, rightGraph);
        }
    };

    function clearData(graphID) {
        d3.select(graphID).selectAll("*").remove();
    }

    function generateGraphDates(dept, graph) {
        var dateUrl = appendEmailUrl + dept + appendDateUrl;

        d3.json(dateUrl, function (error, dates) {
            var minDate = new Date(dates.startDate);
            var endDate = new Date(dates.endDate);
            var startDate = new Date(dates.endDate);
            startDate.setDate(startDate.getDate() - 7);

            if (graph === leftGraph) {
                $scope.leftGraphMinDate = minDate;
                $scope.leftGraphDateFrom = startDate;
                $scope.leftGraphMaxDate = endDate;
                $scope.leftGraphDateTo = endDate;

                $scope.$apply(function () {
                    $scope.leftGraphDisplay = false;
                });
                generateData($scope.dept.selected, graph);

            } else {
                $scope.rightGraphMinDate = minDate;
                $scope.rightGraphDateFrom = startDate;
                $scope.rightGraphMaxDate = endDate;
                $scope.rightGraphDateTo = endDate;

                $scope.$apply(function () {
                    $scope.rightGraphDisplay = false;
                });

                generateData($scope.compareDept.selected, graph);
            }

        });
    }

    function generateData(dept, graphID) {
        var emailUrl;

        if (graphID === leftGraph) {
            emailUrl = appendEmailUrl + dept + "/" + $scope.leftGraphDateFrom + "/" +
                $scope.leftGraphDateTo;
        } else {
            emailUrl = appendEmailUrl + dept + "/" + $scope.rightGraphDateFrom + "/" +
                $scope.rightGraphDateTo;
        }

        d3.json(emailUrl, function (error, links) {
            console.log(links);
            var nodes = {};

            var maxValue = 0;

            var targetGroup = '';
            if (links[0] !== null || links[0] !== undefined) {
                targetGroup = links[0].td;
            }

            links.forEach(function (link) {
                link.target = nodes[link.target] ||
                    (nodes[link.target] = {name: '', group: link.td});
            });

            links.forEach(function (link) {
                link.source = nodes[link.source] ||
                    (nodes[link.source] = {name: '', group: link.sd});
                maxValue = Math.max(maxValue, link.value);
            });

            clearData(graphID);

            var width = d3.select(graphID).style("width").split("px").shift();
            var height = width * 0.8;

            var color = d3.scale.category20();

            var force = d3.layout.force()
                .nodes(d3.values(nodes))
                .links(links)
                .size([width, height])
                .linkDistance(function (d) {
                    return maxValue - d.value;
                })
                .charge(-300)
                .on("tick", tick)
                .start();

            var zoom = d3.behavior.zoom()
                .scaleExtent([0.1, 10])
                .scale(1)
                .on("zoom", zoomed);

            var svg = d3.select(graphID).append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("pointer-events", "all")
                .append('svg:g')
                //.attr("transform", "translate(" + width / 2 + "," + height / 2 + ") scale(0.15)")
                .call(zoom);

            svg.append('svg:rect')
                .attr('width', width)
                .attr('height', height)
                .attr('fill', 'none');

            // Arrows
            svg.append("svg:defs").selectAll("marker")
                .data(["end"])
                .enter().append("svg:marker")
                .attr("id", String)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 15)
                .attr("refY", -1.5)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5");

            // Links
            var path = svg.append("svg:g").selectAll("path")
                .data(force.links())
                .enter().append("svg:path")
                //    .attr("class", function(d) { return "link " + d.type; })
                .attr("class", "link")
                .attr("marker-end", "url(#end)");

            // Nodes
            var node = svg.selectAll(".node")
                .data(force.nodes())
                .enter().append("g")
                .attr("class", "node")
                .style("fill", function (d) {
                    return color(d.group);
                })
                .call(force.drag);

            node.append("circle")
                .attr("r", function (d) {
                    return 10;
                });

            var legend = svg.selectAll(".legend")
                .data(color.domain())
                .enter().insert("g", ":first-child")
                .attr("class", "legend")
                .attr("transform", function(d, i) { 
                    return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) {
                    var desc = $scope.availableDept[d-1] || "External";
                    return desc; });

            // Text
            // node.append("text")
            //     .attr("x", 12)
            //     .attr("dy", ".35em")
            //     .text(function (d) {
            //         return d.name;
            //     });

            // Curve lines
            function tick() {
                path.attr("d", function (d) {
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
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });
            }


            function zoomed() {
                svg.attr("transform",
                    "translate(" + d3.event.translate + ")" +
                    " scale(" + d3.event.scale + ")");
                // svg.selectAll(".legend")
                // .attr("transform", function(d, i) { 
                //     console.log("translate(0," + ((i * 20) + d3.event.translate[1]) + ")");

                //     return "translate(0," + ((i * 20) + d3.event.translate[1]) + ")";
                //      });

            }

        });
    }
}
