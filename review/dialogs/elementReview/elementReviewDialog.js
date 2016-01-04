(function (review) {
    'use strict';

    review.ElementReviewDialog = function (reviewService) {
        var constants = review.constants,
            html = $.parseHTML('{{elementReviewDialog.html}}'),
            commentForm = new review.CommentForm(reviewService, hide),
            popupPositioner = new review.PopupPositioner(),
            $dialog = $(html),
            closeBtn = new review.controls.Button($dialog, constants.selectors.closeDialogBtn),
            dialog = {
                isShown: false,
                show: show,
                hide: hide
            };

        closeBtn.click(hide);
        $dialog.find(constants.selectors.addCommentForm).replaceWith(commentForm.$element);

        return dialog;

        function show($parent) {
            if (dialog.isShown)
                return;

            $dialog.appendTo($parent);

            $dialog.hide();
            popupPositioner.setPopupPosition($parent, $dialog);

            $dialog.fadeIn(0.1).addClass(constants.css.shown);
            commentForm.init();

            dialog.isShown = true;
        }

        function hide() {
            if (!dialog.isShown)
                return;

            $dialog.fadeOut(0.1, function () {
                $dialog.removeClass(constants.css.shown);
                $dialog.detach();
            });

            dialog.isShown = false;
        }
    };
})(window.review = window.review || {});