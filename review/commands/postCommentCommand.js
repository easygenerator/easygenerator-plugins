(function (review) {
    'use strict';

    review.PostCommentCommand = function (courseId) {
        function execute(message, username, useremail) {
            alert(courseId + message + username + useremail);
        }

        return {
            execute: execute
        };
    }

})(window.review = window.review || {});