(function (review) {
    'use strict';

    review.ReviewPlugin = function () {
        var spotsController = new review.ReviewSpotsController(),
            hintController = new review.ReviewHintController(),
            dialogController = null;

        function init(courseId) {
            if ($ === undefined) {
                throw 'Easygenerator review requires jQuery';
            }

            dialogController = new review.ReviewDialogController(courseId, hintController);
            dialogController.showGeneralReviewDialog();
        }

        function render() {
            spotsController.renderSpots(onSpotClick);
            hintController.showHintsIfNeeded();
        }

        function onSpotClick($spot) {
            if (hintController.isSpotReviewHintShown()) {
                hintController.hideSpotReviewHint();
            } else {
                dialogController.showElementReviewDialog($spot);
            }
        }

        return {
            init: init,
            render: render
        };
    };

})(window.review = window.review || {});