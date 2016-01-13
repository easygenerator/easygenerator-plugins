(function (review) {
    'use strict';

    review.SpotCollection = function () {
        var spotPositioner = new review.SpotPositioner(),
            constants = review.constants,
            data = {
                arr: [],
                maxId: 0
            };

        function addSpot($element) {
            var spotMarkup = review.htmlMarkupProvider.getHtmlMarkup('{{reviewSpot.html}}');
            var $spotWrapper = $(spotMarkup).appendTo(constants.selectors.body);
            $spotWrapper.hide();

            var id = data.maxId + 1;
            var spot = {
                id: id,
                $element: $spotWrapper,
                $contextElement: $element
            };
            data.arr.push(spot);
            data.maxId = id;

            spot.$contextElement.find(constants.selectors.img).one('load', updateSpotPositions);
            spot.$contextElement.find(constants.selectors.iframe).one('load', updateSpotPositions);

            spotPositioner.updatePosition(spot);
            $spotWrapper.fadeIn(200);

            return spot;
        }

        function updateSpotPositions() {
            data.arr.forEach(function (item) {
                spotPositioner.updatePosition(item);
            });
        }

        function getSpotById(id) {
            return data.arr.find(function (item) {
                return item.id === id;
            });
        }

        function filterSpots(ids) {
            var arr = data.arr.filter(function (item) {
                return ids.some(function (id) {
                    return item.id === id;
                });
            });

            data.arr.forEach(function (item) {
                if (arr.indexOf(item) === -1) {
                    item.$element.fadeOut(200, function () {
                        item.$element.detach();
                    });
                }
            });

            data.arr = arr;
        }

        function hideSpots() {
            data.arr.forEach(function (spot) {
                spot.$element.hide();
            });
        }

        function showSpots() {
            data.arr.forEach(function (spot) {
                spotPositioner.updatePosition(spot);
            });

            data.arr.forEach(function (spot) {
                spot.$element.show();
            });
        }

        return {
            arr: data.arr,
            addSpot: addSpot,
            getSpotById: getSpotById,
            filterSpots: filterSpots,
            hideSpots: hideSpots,
            showSpots: showSpots
        };

    };

})(window.review = window.review || {});