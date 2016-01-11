(function (review) {
    'use strict';

    review.ElementReviewDialog = function (reviewService) {
        var constants = review.constants,
            commentForm = new review.CommentForm(reviewService, hide),
            popupPositioner = new review.PopupPositioner(),
            $dialog = $(review.htmlMarkupProvider.getHtmlMarkup('{{elementReviewDialog.html}}')),
            closeBtn = new review.controls.Button($dialog, constants.selectors.closeDialogBtn),
            dialog = {
                isShown: false,
                show: show,
                hide: hide,
                isShownForElement: isShownForElement,
                updatePosition: updatePosition,
                $parent: null
            };

        closeBtn.click(hide);
        $dialog.find(constants.selectors.addCommentForm).replaceWith(commentForm.$element);

        return dialog;

        function show($parent) {
            dialog.$parent = $parent;
            $dialog.finish().css({ opacity: 0 }).show().appendTo($parent);
            updatePosition();

            commentForm.init();
            $dialog.fadeTo(50, 1);
            $dialog.addClass(constants.css.shown);

            dialog.isShown = true;
        }

        function hide() {
            $dialog.finish().fadeOut(50, function () {
                $dialog.removeClass(constants.css.shown);
                $dialog.detach();
            });

            dialog.isShown = false;
            dialog.$parent = null;
        }

        function updatePosition() {
            if (dialog.$parent ) {
                popupPositioner.setPopupPosition(dialog.$parent, $dialog);
            }
        }

        function isShownForElement($spot) {
            return $spot.find(constants.selectors.reviewDialog).length > 0;
        }
    };
})(window.review = window.review || {});