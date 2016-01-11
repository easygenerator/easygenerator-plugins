(function (review) {
    'use strict';

    review.PopupPositioner = function () {
        var constants = review.constants,
            css = constants.css,
            margin = {
                x: 0,
                y: 0
            },
            positioner = new review.ElementPositioner(margin);

        function setPopupPosition($container, $popup) {
            positioner.cleanupPosition($popup);
            
            var horizontalPosition = positioner.getHorizontalPosition($container, $popup);
            $popup.addClass(horizontalPosition ? horizontalPosition : css.middle);

            var verticalPosition = positioner.getVerticalPosition($container, $popup);
            $popup.addClass(verticalPosition ? verticalPosition : css.bottom);
        }

        return {
            setPopupPosition: setPopupPosition
        };
    };

})(window.review = window.review || {});