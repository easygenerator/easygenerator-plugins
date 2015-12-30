(function (review) {
    'use strict';

    review.ElementReviewDialog = function (courseId) {
        var constants = review.constants,
            html = $.parseHTML('{{elementReviewDialog.html}}'),
            commentForm = new review.CommentForm(courseId, hide),
            $dialog = $(html),
            closeBtn = new review.controls.Button($dialog, constants.selectors.closeDialogBtn),
            dialog = {
                isShown: false,
                show: show,
                hide: hide
            };

        closeBtn.click(hide);

        return dialog;

        function show($parent) {
            $dialog.hide();
            $dialog.find(constants.selectors.addCommentForm).replaceWith(commentForm.$element);
            $dialog.appendTo($parent);
            $dialog.addClass(constants.css.shown);
            commentForm.init();

            $dialog.fadeIn('fast').addClass(constants.css.shown);
            dialog.isShown = true;
        }

        function hide() {
            $dialog.removeClass(constants.css.shown).fadeOut('fast', function () {
                $dialog.detach();
            });

            dialog.isShown = false;
        }
    };
})(window.review = window.review || {});