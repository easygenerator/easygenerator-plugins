(function (review) {
    'use strict';

    review.PopupPositioner = function () {
        var constants = review.constants,
            css = constants.css,
            $windowContainer = $(constants.selectors.body),
            preferredVerticalAligment = css.bottom;

        function setPopupPosition($container, $popup) {
            var popupHeight = $popup.height();
            var popupWidth = $popup.width();

            var containerOffset = $container.offset();
            var windowOffset = $windowContainer.offset();
            var position = {};

            position.vertical = getVerticalPosition(preferredVerticalAligment, containerOffset.top, windowOffset.top, popupHeight);
            position.horizontal = getHorizontalPosition(containerOffset.left, windowOffset.left, $windowContainer.width(), popupWidth);

            $popup.addClass(position.vertical.aligment).addClass(position.horizontal.aligment);

            function getVerticalPosition(preferredVerticalAligment, pointerTopOffset, containerTopOffset, tooltipHeight) {
                var vertical = {};
                vertical.aligment = getVerticalAligment(preferredVerticalAligment, pointerTopOffset, tooltipHeight);

                function getVerticalAligment(preferredVerticalAligment, pointerTopOffset, tooltipHeight) {
                    if (preferredVerticalAligment === css.top && (pointerTopOffset - 100) < tooltipHeight) {
                        return css.bottom;
                    }
                    if (preferredVerticalAligment === css.bottom && pointerTopOffset + tooltipHeight > $windowContainer.height()) {
                        return css.top;
                    }
                    return preferredVerticalAligment;
                }

                return vertical;
            }

            function getHorizontalPosition(pointerLeftOffset, containerLeftOffset, containerWidth, tooltipWidth) {
                var horizontal = {};
                horizontal.aligment = '';

                var leftLimit = containerLeftOffset;
                var rightLimit = leftLimit + containerWidth;
                var preferredHorizontalPosition = getPreferredHorizontalPosition();

                if (preferredHorizontalPosition === css.right && pointerLeftOffset - tooltipWidth + 23 > leftLimit) {
                    horizontal.aligment = css.right;
                    return horizontal;
                } else if (preferredHorizontalPosition === css.left && pointerLeftOffset + tooltipWidth < rightLimit) {
                    horizontal.aligment = css.left;
                    return horizontal;
                }

                if (pointerLeftOffset + tooltipWidth < rightLimit) {
                    horizontal.aligment = css.left;
                    return horizontal;
                } else if (pointerLeftOffset - tooltipWidth + 23 > leftLimit) {
                    horizontal.aligment = css.right;
                    return horizontal;
                }

                horizontal.aligment = css.middle;
                return horizontal;
            }

            function getPreferredHorizontalPosition() {
                var constainerX = $container.offset().left;
                return $windowContainer.width() / 2 - constainerX > 0 ? css.right : css.left;
            }

            return position;
        }

        return {
            setPopupPosition: setPopupPosition
        };
    };

})(window.review = window.review || {});