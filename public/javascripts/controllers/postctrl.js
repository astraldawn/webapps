/**
 * Created by mark on 27/05/16.
 */

PostsCtrl.$inject = ['$scope', '$state', 'posts', 'post', 'auth', '$http', 'notifications'];

angular.module('webapps')
    .controller('PostsCtrl', PostsCtrl);

function PostsCtrl($scope, $state, posts, post, auth, $http, notifications) {
    $scope.post = post;
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.availableType = [];

    var typeUrl = (($scope.post.graphType === 'department') ? '/alldept' : '/allrole');
    var dataUrl = (($scope.post.graphType === 'department') ? '/emaildata/' : '/ldapdata/');

    var leftGraph = '#nodeGraph';
    var rightGraph = '#compareNodeGraph';

    if ($scope.post !== null && typeof $scope.post !== 'undefined') {
        $http.get(typeUrl).then(
            function (response) {
                $scope.availableType = response.data;
            },
            function () {
                console.log('Error');
            }
        );

        if ($scope.post.leftSubCat !== null && typeof $scope.post.leftSubCat !== 'undefined') {
            generateData($scope.post.leftSubCat, leftGraph,
                $scope.post.leftFrom, $scope.post.leftTo);
        }

        if ($scope.post.rightSubCat !== null && typeof $scope.post.rightSubCat !== 'undefined') {
            generateData(post.rightSubCat, rightGraph,
                $scope.post.rightFrom, $scope.post.rightTo);
        }
    }

    $scope.addComment = function () {
        if (!$scope.body || $scope.body === '') {
            notifications.showError({message:"Please specify some text for comment"});
            return;
        }

        posts.addComment(post._id, {
            body: $scope.body,
            author: 'user',
            time: new Date()
        }).success(function (comment) {
            $scope.post.comments.push(comment);
        });

        $scope.body = '';
    };

    $scope.userMatch = function () {
        return $scope.post.author === auth.currentUser();
    };

    $scope.deletePost = function () {
        posts.delete(post._id).success(function () {
            $state.go('postview');
        });
    };

    $scope.incrementUpvotes = function (comment) {
        posts.upvoteComment(post, comment);
    };

    $scope.deleteComment = function (comment) {
        posts.deleteComment(post, comment).success(function () {
            // $state.go($state.current, {}, {reload: true}); //second parameter is for $stateParams
            var index = $scope.post.comments.indexOf(comment);
            $scope.post.comments.splice(index, 1);
        });
    };

    function generateData(cat, graphID, fromDate, toDate) {

        var url = dataUrl + cat + "/" + fromDate + "/" + toDate;
        console.log("URL:" + url);

        d3.json(url, function (error, links) {
            console.log(links);
            var nodes = {};

            var maxValue = 0;

            var targetGroup = '';
            if (links[0] !== null || typeof links[0] !== 'undefined') {
                targetGroup = links[0].td;
            }

            links.forEach(function (link) {
                link.target = nodes[link.target] ||
                    (nodes[link.target] = {name: '', group: link.td});
                link.source = nodes[link.source] ||
                    (nodes[link.source] = {name: '', group: link.sd});
                maxValue = Math.max(maxValue, link.value);
            });

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

            // Links
            var path = vis.append("vis:g").selectAll("path")
                .data(force.links())
                .enter().append("vis:path")
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
                    var desc = $scope.availableType[d] || "External";
                    return desc;
                });

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


