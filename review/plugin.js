(function (review) {
    'use strict';

    review.ReviewPlugin = function () {
        var spotsController = new review.ReviewSpotsController(),
            hintController = new review.ReviewHintController(),
            dialogController = null,
            plugin = {
                isFirstRender: true,
                courseId: null
            };

        function init(courseId) {
            if ($ === undefined) {
                throw 'Easygenerator review requires jQuery';
            }

            plugin.courseId = courseId;
            dialogController = new review.ReviewDialogController(courseId, hintController);
        }

        function render() {
            var spots = spotsController.renderSpots(onSpotClick);

            if (plugin.isFirstRender) {
                hintController.showHintsIfNeeded(spots);
                dialogController.showGeneralReviewDialog();
            }

            plugin.isFirstRender = false;
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