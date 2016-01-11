(function (review) {
    'use strict';

    review.SpotPositioner = function () {
        var margin = {
            x: 10,
            y: 10
        },
        size = {
            width: 32,
            height: 32
        },
        $windowContainer = $(window);

        function updatePosition(spot) {
            var position = getContextElementTopRightPosition(spot.$contextElement);

            position.x = fitsInOuterCornerHirizonatlly(position) ? position.x + margin.x : position.x - size.width;
            position.y = fitsInOuterCornerVertically(position) ? position.y + margin.y - size.width : position.y + margin.y;

            var styles = {
                left: position.x,
                top: position.y
            };

            spot.$element.css(styles);
        }

        function getContextElementTopRightPosition($contextElement) {
            var offset = $contextElement.offset();
            return {
                y: offset.top,
                x: offset.left + $contextElement.outerWidth()
            }
        }

        function fitsInOuterCornerHirizonatlly(position) {
            var windowWidth = $windowContainer.width();
            return windowWidth - position.x - size.width - margin.x > 0;
        }

        function fitsInOuterCornerVertically(position) {
            return position.y + margin.y - size.width > 0;
        }

        return {
            updatePosition: updatePosition
        };
    };

})(window.review = window.review || {});