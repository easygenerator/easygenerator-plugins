(function (review) {
    'use strict';

    review.HintController = function () {
        var constants = review.constants,
            clientContext = review.clientContext,
            localizationService = window.plugins.localizationService,
            spotReviewHint = new review.Hint(localizationService.localize('elementReviewHint'), constants.css.spotReviewHint,
                function () {
                    hideSpotReviewHint();
                }),
            generalReviewHint = new review.Hint(localizationService.localize('generalReviewHint'), constants.css.generalReviewHint + ' ' + constants.css.top,
                function () {
                    hideGeneralReviewHint();
                });

        function showSpotReviewHint($spot) {
            spotReviewHint.show($spot);
        }

        function hideSpotReviewHint() {
            spotReviewHint.hide();
            clientContext.set(constants.clientContextKeys.reviewSpotHintShown, true);

            showHintsIfNeeded();
        }

        function showGeneralReviewHint() {
            generalReviewHint.show();
        }

        function hideGeneralReviewHint() {
            generalReviewHint.hide();
            clientContext.set(constants.clientContextKeys.reviewGeneralHintShown, true);

            showHintsIfNeeded();
        }

        function isSpotReviewHintShown() {
            return spotReviewHint.isShown;
        }

        function isGeneralReviewHintShown() {
            return generalReviewHint.isShown;
        }

        function showHintsIfNeeded() {
            if (generalReviewHint.isShown)
                return;

            if (spotReviewHint.isShown) {
                spotReviewHint.hide();
            }

            if (clientContext.get(constants.clientContextKeys.reviewSpotHintShown) !== true) {
                var $spots = $(constants.selectors.reviewSpotWrapper);
                if ($spots.length > 0) {
                    showSpotReviewHint($($spots[0]));
                    return;
                } 
            }

            if (clientContext.get(constants.clientContextKeys.reviewGeneralHintShown) !== true) {
                showGeneralReviewHint();
            }
        }

        function hideHints() {
            spotReviewHint.hide();
            generalReviewHint.hide();
        }

        return {
            isSpotReviewHintShown: isSpotReviewHintShown,
            isGeneralReviewHintShown: isGeneralReviewHintShown,
            showSpotReviewHint: showSpotReviewHint,
            showGeneralReviewHint: showGeneralReviewHint,
            hideSpotReviewHint: hideSpotReviewHint,
            hideGeneralReviewHint: hideGeneralReviewHint,
            showHintsIfNeeded: showHintsIfNeeded,
            hideHints: hideHints
        };
    };

})(window.review = window.review || {});