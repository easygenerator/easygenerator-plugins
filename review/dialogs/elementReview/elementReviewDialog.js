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

        return dialog;

        function show($parent) {
            if (dialog.isShown)
                return;

            $dialog.find(constants.selectors.addCommentForm).replaceWith(commentForm.$element);
            $dialog.appendTo($parent);

            $dialog.hide();
            popupPositioner.setPopupPosition($parent, $dialog);

            $dialog.fadeIn('fast').addClass(constants.css.shown);
            commentForm.init();

            dialog.isShown = true;
        }

        function hide() {
            if (!dialog.isShown)
                return;

            $dialog.removeClass(constants.css.shown).fadeOut('fast', function () {
                $dialog.detach();
            });

            dialog.isShown = false;
        }
    };
})(window.review = window.review || {});