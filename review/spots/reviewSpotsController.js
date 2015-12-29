(function (review) {
    'use strict';

    review.ReviewSpotsController = function () {
        var constants = review.constants,
            spotMarkup = '{{reviewSpot.html}}';

        function renderSpots(clickHandler) {
            var spots = [];
            $(constants.selectors.reviewable).each(function () {
                var $spot = renderSpotOnElement($(this), clickHandler);
                if ($spot) {
                    spots.push($spot);
                }
            });

            return spots;
        }

        return {
            renderSpots: renderSpots
        };

        function renderSpotOnElement($element, clickHandler) {
            if ($element.children().find(constants.selectors.reviewSpot).length > 0)
                return;

            var $spotWrapper = $(spotMarkup);
            $spotWrapper.appendTo($element);

            if (clickHandler) {
                var $spot = $spotWrapper.find(constants.selectors.reviewSpot);
                $spot.click(function () {
                    clickHandler($spotWrapper);
                });
            }

            return $spotWrapper;
        }
    };

})(window.review = window.review || {});