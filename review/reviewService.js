(function (review) {
    'use strict';

    review.ReviewService = function (reviewApiUrl, courseId) {
        function postComment(message, username, useremail) {
            return $.ajax({
                url: getApiUrl('api/comment/create'),
                data: { courseId: courseId, text: message.trim(), createdByName: username.trim(), createdBy: useremail.trim() },
                type: 'POST'
            });
        }

        function getApiUrl(apiPath) {
            if (reviewApiUrl.indexOf('/', reviewApiUrl.length - 1) !== -1) {
                return reviewApiUrl + apiPath;
            }

            return reviewApiUrl + '/' + apiPath;
        }

        return {
            postComment: postComment
        };
    }

})(window.review = window.review || {});