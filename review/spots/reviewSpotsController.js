(function (review) {
    'use strict';

    review.ReviewSpotsController = function () {
        var constants = review.constants,
            clientContext = review.clientContext,
            hintController = new review.ReviewHintController(),
            spotMarkup = '{{reviewSpot.html}}',
            controller = {
                spots: [],
                isFirstRender: true
            }

        function renderSpots() {
            $(constants.selectors.reviewable).each(function () {
                var $spot = renderSpotOnElement($(this));
                if ($spot) {
                    controller.spots.push($spot);
                }
            });

            if (controller.isFirstRender) {
                hintController.showHintsIfNeeded(spots);
            }

            spots.each(function () {
                var $spot = $(this).find(constants.selectors.reviewSpot);
                $spot.click(function () {
                    if (hintController.isSpotReviewHintShown()) {
                        hintController.hideSpotReviewHint();
                    } else {
                        dialog.show($spot);
                    }
                });
            });

            controller.isFirstRender = false;
        }

        return {
            renderSpots: renderSpots
        };

        function renderSpotOnElement($element) {
            if ($element.children().find(constants.selectors.reviewSpot).length > 0)
                return;

            var $spot = $(spotMarkup);
            $spot.appendTo($element);
            return $spot;
        }
    };

})(window.review = window.review || {});