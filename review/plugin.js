(function (review) {
    'use strict';

    review.ReviewPlugin = function () {
        var spotController = null,
            hintController = null,
            dialogController = null;

        function init(settings) {
            if ($ === undefined) {
                throw 'Easygenerator review requires jQuery';
            }

            if (!settings) {
                throw 'Failed to initialize review plugin. Settings are not defined.';
            }

            if (!settings.reviewApiUrl) {
                throw 'Failed to initialize review plugin. Review api url is invalid.';
            }

            if (!settings.courseId) {
                throw 'Failed to initialize review plugin. Course id is invalid.';
            }

            var reviewService = new review.ReviewService(settings.reviewApiUrl, settings.courseId);
            hintController = new review.HintController(),
            dialogController = new review.ReviewDialogController(reviewService, hintController),
            spotController = new review.SpotController(hintController, dialogController);

            var windowResizeTracker = new review.WindowResizeTracker();

            windowResizeTracker.track(function () {
                spotController.hideSpots();
                hintController.hideHints();
            }, function () {
                spotController.showSpots();
                hintController.showHintsIfNeeded();
                dialogController.updatePosition();
            });

            if (!settings.hideGeneralReviewDialog) {
                dialogController.showGeneralReviewDialog();
            }
        }

        function render() {
            spotController.renderSpots();
            hintController.showHintsIfNeeded();
        }

        return {
            init: init,
            render: render
        };
    };

})(window.review = window.review || {});