(function (review) {
    'use strict';

    review.ReviewHintController = function () {
        var constants = review.constants,
            clientContext = review.clientContext,
            spotReviewHint = new review.ReviewHint('Click on icon near elements to leave the comment.', constants.css.spotReviewHint),
            generalReviewHint = new review.ReviewHint('Click on icon near elements to leave the general comment.', constants.css.generalReviewHint);

        function showSpotReviewHint($spot) {
            spotReviewHint.show($spot, function () {
                hideSpotReviewHint();
            });
        }

        function hideSpotReviewHint() {
            spotReviewHint.hide();
            clientContext.set(constants.clientContextKeys.reviewSpotHintShown, true);

            if (clientContext.get(constants.clientContextKeys.reviewGeneralHintShown) !== true) {
                showGeneralReviewHint();
            }
        }

        function showGeneralReviewHint() {
            generalReviewHint.show($('body'), function () {
                hideGeneralReviewHint();
            });
        }

        function hideGeneralReviewHint() {
            generalReviewHint.hide();
            clientContext.set(constants.clientContextKeys.reviewGeneralHintShown, true);
        }

        function isSpotReviewHintShown() {
            return spotReviewHint.isShown;
        }

        function showHintsIfNeeded(spots) {
            if (spots.length > 0 && clientContext.get(constants.clientContextKeys.reviewSpotHintShown) !== true) {
                showSpotReviewHint(spots[0]);
            } else if (clientContext.get(constants.clientContextKeys.reviewGeneralHintShown) !== true) {
                showGeneralReviewHint();
            }
        }

        return {
            isSpotReviewHintShown: isSpotReviewHintShown,
            showSpotReviewHint: showSpotReviewHint,
            showGeneralReviewHint: showGeneralReviewHint,
            hideSpotReviewHint: hideSpotReviewHint,
            hideGeneralReviewHint: hideGeneralReviewHint,
            showHintsIfNeeded: showHintsIfNeeded
        };
    };

})(window.review = window.review || {});