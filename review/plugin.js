(function (review) {
    'use strict';

    review.ReviewPlugin = function () {
        var spotsController = new review.ReviewSpotsController();

        function init() {
            if ($ === undefined) {
                throw 'Easygenerator review requires jQuery';
            }
        }

        function render() {
            spotsController.renderSpots();
        }

        return {
            init: init,
            render: render
        };
    };

})(window.review = window.review || {});