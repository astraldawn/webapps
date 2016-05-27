/**
 * Created by mark on 27/05/16.
 */

app.controller('PostsCtrl', [
    '$scope',
    'posts', // injection of the post service, kept for comment manipulation
    'post', // injection of post object
    'auth',
    function ($scope, posts, post, auth) {
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

        $scope.incrementUpvotes = function (comment) {
            posts.upvoteComment(post, comment);
        }
    }
]);