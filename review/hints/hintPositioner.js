(function (review) {
    'use strict';

    review.HintPositioner = function () {
        var constants = review.constants,
            css = constants.css,
            margin = {
                x: 6,
                y: 6
            },
            positioner = new review.ElementPositioner(margin);

        function updatePosition($contextElement, hint) {
            var $element = hint.$element;
            positioner.cleanupPosition($element);

            var horizontalPosition = positioner.getHorizontalPosition($contextElement, $element);
            if (horizontalPosition) {
                $element.addClass(horizontalPosition);
                return;
            }

            var verticalPosition = positioner.getVerticalPosition($contextElement, $element);
            if (verticalPosition) {
                $element.addClass(verticalPosition);
                return;
            }

            hint.$element.addClass(css.bottom);
        }

        return {
            updatePosition: updatePosition
        };
    };

})(window.review = window.review || {});