/**
 * Created by mark on 27/05/16.
 */

MainCtrl.$inject = ['$scope', 'posts', 'auth', '$state'];

angular.module('webapps')
    .controller('MainCtrl', MainCtrl);

function MainCtrl($scope, posts, auth, $state) {
    $scope.posts = posts.posts;
    $scope.isLoggedIn = auth.isLoggedIn;

    $scope.addPost = function () {
        // Prevent user from creating a blank post
        if (!$scope.title || $scope.title === '') {
            return;
        }

        posts.create({
            title: $scope.title,
            link: $scope.link
        });

        // Clearing variables
        $scope.title = '';
        $scope.link = '';
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
