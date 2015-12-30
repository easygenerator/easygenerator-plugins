(function (review) {
    'use strict';

    review.PostCommentCommand = function (courseId) {
        function execute(message, username, useremail) {
            return $.ajax({
                url: 'http://localhost:666/api/comment/create',
                data: { courseId: courseId, text: message.trim(), createdByName: username.trim(), createdBy: useremail.trim() },
                type: 'POST'
            });
        }

        return {
            execute: execute
        };
    }

})(window.review = window.review || {});