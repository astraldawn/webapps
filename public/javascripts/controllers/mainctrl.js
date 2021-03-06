/**
 * Created by mark on 27/05/16.
 */

MainCtrl.$inject = ['$scope', 'posts', 'auth', '$state', 'notifications'];

angular.module('webapps')
    .controller('MainCtrl', MainCtrl);

function MainCtrl($scope, posts, auth, $state, notifications) {
    $scope.posts = posts.posts;
    $scope.isLoggedIn = auth.isLoggedIn;

    $scope.$on('saveGraph', function (event, arg) {
        $scope.msg = arg;
    });

    $scope.addPost = function () {
        // Prevent user from creating a blank post
        if (!$scope.title || $scope.title === '') {
            notifications.showError({message:"Please specify a title"});
            return;
        }

        if($scope.msg !== null && typeof $scope.msg !== 'undefined') {
            posts.create({
                title: $scope.title,
                graphType: $state.$current.name,
                leftSubCat: $scope.msg.leftSubCat,
                rightSubCat: $scope.msg.rightSubCat,
                leftFrom: $scope.msg.leftFrom,
                leftTo: $scope.msg.leftTo,
                rightFrom: $scope.msg.rightFrom,
                rightTo: $scope.msg.rightTo,
                time: new Date()
            }).success(function(){
                notifications.showSuccess({message:"Post created"});
            });
        } else {
            posts.create({
                title: $scope.title
            }).success(function(){
                notifications.showSuccess({message:"Post created"});
            });
        }

        // Clearing variables
        $scope.title = '';
    };

    // Pass by instance
    $scope.incrementUpvotes = function (post) {
        posts.upvote(post);
    };

    var _this = this;

    _this.mainOptions = {
        navigation: true,
        navigationPosition: 'right',
        scrollingSpeed: 1000
    };

}