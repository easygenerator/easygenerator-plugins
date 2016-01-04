(function (review) {
    'use strict';

    review.ReviewService = function (reviewApiUrl, courseId) {
        function postComment(message, username, useremail) {
            return $.ajax({
                url: reviewApiUrl + 'api/comment/create',
                data: { courseId: courseId, text: message.trim(), createdByName: username.trim(), createdBy: useremail.trim() },
                type: 'POST'
            });
        }

        return {
            postComment: postComment
        };
    }

})(window.review = window.review || {});