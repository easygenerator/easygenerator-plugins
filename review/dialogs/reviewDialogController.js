﻿(function (review) {
    'use strict';

    review.ReviewDialogController = function (reviewService, hintController) {
        var constants = review.constants,
            elementReviewDialog = new review.ElementReviewDialog(reviewService),
            generalReviewDialog = new review.GeneralReviewDialog(reviewService, onGeneralReviewDialogExpansionChanged);

        function onGeneralReviewDialogExpansionChanged() {
            if (hintController.isGeneralReviewHintShown()) {
                hintController.hideGeneralReviewHint();
            }

            if (elementReviewDialog.isShown) {
                elementReviewDialog.hide();
            }
        }

        function showGeneralReviewDialog() {
            generalReviewDialog.show();
        }

        function showElementReviewDialog($spot) {
            if (generalReviewDialog.isExpanded) {
                generalReviewDialog.toggleExpansion();
            }

            if (elementReviewDialog.isShown) {
                var isShownForElement = elementReviewDialog.isShownForElement($spot);
                elementReviewDialog.hide();
                if (isShownForElement) {
                    return;
                }
            }

            elementReviewDialog.show($spot, constants.css.elementReviewDialog);
        }

        function updatePosition() {
            if (elementReviewDialog.isShown) {
                elementReviewDialog.updatePosition();
            }
        }

        return {
            showGeneralReviewDialog: showGeneralReviewDialog,
            showElementReviewDialog: showElementReviewDialog,
            updatePosition: updatePosition
        };
    };

})(window.review = window.review || {});