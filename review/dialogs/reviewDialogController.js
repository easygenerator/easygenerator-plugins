(function (review) {
    'use strict';

    review.ReviewDialogController = function (courseId, hintController) {
        var constants = review.constants,
            elementReviewDialog = review.ReviewDialog(courseId, hintController);

        function showGeneralReviewDialog() {
            review.ReviewDialog(courseId, hintController).show($('body'), constants.css.generalReviewDialog);
        }

        function showElementReviewDialog($spot) {
            if (elementReviewDialog.isShown) {
                elementReviewDialog.hide();
            }

            elementReviewDialog.show($spot, constants.css.elementReviewDialog);
        }

        return {
            showGeneralReviewDialog: showGeneralReviewDialog,
            showElementReviewDialog: showElementReviewDialog
        };
    };

})(window.review = window.review || {});