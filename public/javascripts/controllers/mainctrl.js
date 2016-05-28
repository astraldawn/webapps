/**
 * Created by mark on 27/05/16.
 */

app.controller('MainCtrl', [
    '$scope',
    'posts', // injection of the post service
    'chronodatas', // injection of pwned data
    'auth',
    function ($scope, posts, chronodatas, auth) {
        $scope.posts = posts.posts;
        $scope.chronodatas = chronodatas.chronodatas;
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
        }

    }
]);
