(function (review) {
    'use strict';

    review.GeneralReviewDialog = function (reviewService, onExpansionChanhed) {
        var constants = review.constants,
            commentForm = new review.CommentForm(reviewService),
            $dialog = $(review.htmlMarkupProvider.getHtmlMarkup('{{generalReviewDialog.html}}')),
            expandCollapseBtn = new review.controls.Button($dialog, constants.selectors.commentsHeader),
            dialog = {
                show: show,
                isExpanded: false,
                toggleExpansion: toggleExpansion
            };

        $dialog.find(constants.selectors.addCommentForm).replaceWith(commentForm.$element);
        expandCollapseBtn.click(toggleExpansion);

        return dialog;

        function show() {
            $dialog.appendTo(constants.selectors.body);
            commentForm.init();
        }

        function toggleExpansion() {
            var isExpanded = $dialog.hasClass(constants.css.expanded);
            $dialog.toggleClass(constants.css.expanded);
            dialog.isExpanded = false;

            if (!isExpanded) {
                commentForm.init();
                dialog.isExpanded = true;
            }

            onExpansionChanhed();
        }
    };
})(window.review = window.review || {});