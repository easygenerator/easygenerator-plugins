(function (review) {
    'use strict';

    review.ReviewDialogController = function (courseId, hintController) {
        var constants = review.constants,
            elementReviewDialog = new review.ElementReviewDialog(courseId),
            generalReviewDialog = new review.GeneralReviewDialog(courseId, hintController);

        function showGeneralReviewDialog() {
            generalReviewDialog.show();
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