RoleCtrl.$inject = ['$scope', '$http'];

angular.module('webapps')
    .controller('RoleCtrl', RoleCtrl);

function RoleCtrl($scope, $http) {

    //Search function
    $scope.role = {};
    $scope.compareRole = {};
    $scope.availableRole = [];
    $scope.leftGraphDisplay = true;
    $scope.rightGraphDisplay = true;

    var roleUrl = '/allrole';
    var appendDateUrl = '/getdate';
    var appendLdapUrl = "/ldapdata/";

    var leftGraph = '#nodeGraph';
    var rightGraph = '#compareNodeGraph';

    $scope.funcAsync = function (query) {
        $http.get(roleUrl).then(
            function (response) {
                $scope.availableRole = response.data;
                console.log(response);
            },
            function () {
                console.log('Error');
            }
        );
    };

    $scope.reloadGraph = function () {
        generateGraphDates($scope.role.selected, leftGraph);
    };

    $scope.reloadCompareGraph = function () {
        generateGraphDates($scope.compareRole.selected, rightGraph);
    };

    $scope.filterLeftGraphByDate = function () {
        if ($scope.leftGraphDateFrom > $scope.leftGraphDateTo) {
            return;
        } else {
            generateData($scope.role.selected, leftGraph);
        }
    };

    $scope.filterRightGraphByDate = function () {
        if ($scope.rightGraphDateFrom > $scope.rightGraphDateTo) {
            return;
        } else {
            generateData($scope.compareRole.selected, rightGraph);
        }
    };

    function clearData(graphID) {
        d3.select(graphID).selectAll("*").remove();
    }

    function generateGraphDates(role, graph) {
        var dateUrl = appendLdapUrl + role + appendDateUrl;

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
                generateData($scope.role.selected, graph);

            } else {
                $scope.rightGraphMinDate = minDate;
                $scope.rightGraphDateFrom = startDate;
                $scope.rightGraphMaxDate = endDate;
                $scope.rightGraphDateTo = endDate;

                $scope.$apply(function () {
                    $scope.rightGraphDisplay = false;
                });

                generateData($scope.compareRole.selected, graph);
            }

        });
    }

    function generateData(role, graphID) {
        var emailUrl;

        if (graphID === leftGraph) {
            emailUrl = appendLdapUrl + role + "/" + $scope.leftGraphDateFrom + "/" +
                $scope.leftGraphDateTo;
        } else {
            emailUrl = appendLdapUrl + role + "/" + $scope.rightGraphDateFrom + "/" +
                $scope.rightGraphDateTo;
        }

        d3.json(emailUrl, function (error, links) {
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
            var height = width * 0.60;

            var color = d3.scale.category20();

            var force = d3.layout.force()
                .nodes(d3.values(nodes))
                .links(links)
                .size([width, height])
                .linkDistance(function (d) {
                    return maxValue - d.value + 20;
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
                .attr("pointer-events", "all");

            var vis = svg.append('vis:g')
                .call(zoom)
                .append("vis:g");

            vis.append('vis:rect')
                .attr('width', width)
                .attr('height', height)
                .attr('fill', 'none');

            // // Arrows
            // vis.append("vis:defs").selectAll("marker")
            //     .data(["end"])
            //     .enter().append("vis:marker")
            //     .attr("id", String)
            //     .attr("viewBox", "0 -5 10 10")
            //     .attr("refX", 15)
            //     .attr("refY", -1.5)
            //     .attr("markerWidth", 6)
            //     .attr("markerHeight", 6)
            //     .attr("orient", "auto")
            //     .append("vis:path")
            //     .attr("d", "M0,-5L10,0L0,5");

            // Links
            var path = vis.append("vis:g").selectAll("path")
                .data(force.links())
                .enter().append("vis:path")
                //    .attr("class", function(d) { return "link " + d.type; })
                .attr("class", "link")
                .attr("marker-end", "url(#end)");

            // Nodes
            var node = vis.selectAll(".node")
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
                .attr("transform", function (d, i) {
                    return "translate(0," + i * 20 + ")";
                });

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
                .text(function (d) {
                    var desc = $scope.availableRole[d] || "External";
                    return desc;
                });


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
                vis.attr("transform",
                    "translate(" + d3.event.translate + ")" +
                    " scale(" + d3.event.scale + ")");
            }

        });
    }
}
