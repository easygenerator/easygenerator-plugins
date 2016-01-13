(function (review) {
    'use strict';

    review.SpotController = function (hintController, dialogController) {
        var constants = review.constants,
            spotCollection = new review.SpotCollection();

        function hideSpots() {
            spotCollection.hideSpots();
        }

        function showSpots() {
            spotCollection.showSpots();
        }

        return {
            hideSpots: hideSpots,
            showSpots: showSpots,
            renderSpots: renderSpots
        };

        function renderSpots() {
            var ids = [];

            $(constants.selectors.reviewable).each(function () {
                var $element = $(this);
                var spot = renderSpotOnElement($element);
                if (spot) {
                    ids.push(spot.id);
                }
            });

            spotCollection.filterSpots(ids);
        }

        function renderSpotOnElement($element) {
            var spotId = getReviewSpotIdAttachedToElement($element);
            if (spotId) {
                return spotCollection.getSpotById(spotId);
            }

            var spot = spotCollection.addSpot($element);

            var $spot = spot.$element.find(constants.selectors.reviewSpot);
            $spot.click(function () {
                onSpotClick(spot.$element);
            });

            $spot.data({ reviewSpotId: spot.id });
            $element.data({ reviewSpotId: spot.id });
            return spot;
        }

        function getReviewSpotIdAttachedToElement($element) {
            var data = $element.data();
            if (!data)
                return false;

            return data.reviewSpotId;
        }

        function onSpotClick($spot) {
            if (hintController.isSpotReviewHintShown()) {
                hintController.hideSpotReviewHint();
            } else {
                dialogController.showElementReviewDialog($spot);
            }
        }
    };

})(window.review = window.review || {});