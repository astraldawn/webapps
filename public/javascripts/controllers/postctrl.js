/**
 * Created by mark on 27/05/16.
 */

PostsCtrl.$inject = ['$scope', '$state', 'posts', 'post', 'auth'];

angular.module('webapps')
    .controller('PostsCtrl', PostsCtrl);

function PostsCtrl($scope, $state, posts, post, auth) {
    $scope.post = post;
    $scope.isLoggedIn = auth.isLoggedIn;

    $scope.addComment = function () {
        if ($scope.body === '') {
            return;
        }

        posts.addComment(post._id, {
            body: $scope.body,
            author: 'user'
        }).success(function (comment) {
            $scope.post.comments.push(comment);
        });

        $scope.body = '';
    };

    $scope.userMatch = function () {
        return $scope.post.author === auth.currentUser();
    };

    $scope.deletePost = function () {
        posts.delete(post._id).success(function() {
            $state.go('postview');
        })
    };

    $scope.incrementUpvotes = function (comment) {
        posts.upvoteComment(post, comment);
    };

    $scope.deleteComment = function (comment) {
        posts.deleteComment(post, comment).success(function (){
            $state.go($state.current, {}, {reload: true}); //second parameter is for $stateParams
        });
    }
}