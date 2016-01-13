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
                setCoordinates($contextElement, $element, horizontalPosition);
                $element.addClass(horizontalPosition);
                return;
            }

            var verticalPosition = positioner.getVerticalPosition($contextElement, $element);
            if (verticalPosition) {
                setCoordinates($contextElement, $element, verticalPosition);
                $element.addClass(verticalPosition);
                return;
            }

            hint.$element.addClass(css.bottom);
        }

        function setCoordinates($contextElement, $element, position) {
            var coordinates = getCoordinates($contextElement, $element, position);
            var styles = {
                left: coordinates.x,
                top: coordinates.y
            };

            $element.css(styles);
        }

        function getCoordinates($contextElement, $element, position) {
            var elementSize = {
                width: $element.outerWidth(),
                height: $element.outerHeight()
            };

            var containerSize = {
                width: $contextElement.width(),
                height: $contextElement.height()
            };

            var containerPosition = {
                x: $contextElement.offset().left,
                y: $contextElement.offset().top
            };

            if (position === css.right) {
                return {
                    x: containerPosition.x + containerSize.width + margin.x,
                    y: containerPosition.y + containerSize.height / 2 - elementSize.height / 2
                };
            }

            if (position === css.left) {
                return {
                    x: containerPosition.x - margin.x - elementSize.width,
                    y: containerPosition.y + containerSize.height / 2 - elementSize.height / 2
                };
            }

            if (position === css.top) {
                return {
                    x: containerPosition.x + containerSize.width / 2 - elementSize.width / 2,
                    y: containerPosition.y - margin.y - elementSize.height
                };
            }

            if (position === css.bottom) {
                return {
                    x: containerPosition.x + containerSize.width / 2 - elementSize.width / 2,
                    y: containerPosition.y + containerSize.height + margin.y
                };
            }

            return undefined;
        }

        return {
            updatePosition: updatePosition
        };
    };

})(window.review = window.review || {});