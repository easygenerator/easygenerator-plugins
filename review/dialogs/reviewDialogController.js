   import constants from './../infrastructure/constants';
   import ElementReviewDialog from './elementReview/elementReviewDialog';
   import GeneralReviewDialog from './generalReview/generalReviewDialog';
   
var ReviewDialogController = function (reviewService, hintController) {
    var elementReviewDialog = new ElementReviewDialog(reviewService),
        generalReviewDialog = new GeneralReviewDialog(reviewService, onGeneralReviewDialogExpansionChanged);

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

    function updatePositionIfNeeded() {
        if (elementReviewDialog.isShown) {
            elementReviewDialog.updatePosition();
        }
    }

    return {
        showGeneralReviewDialog: showGeneralReviewDialog,
        showElementReviewDialog: showElementReviewDialog,
        updatePositionIfNeeded: updatePositionIfNeeded
    };
};

module.exports = ReviewDialogController;