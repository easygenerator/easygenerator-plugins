import constants from './../constants';

var ElementPositioner = function (margin) {
    var css = constants.css,
        elementSize = null,
        containerSize=null,
        $windowContainer = $(constants.selectors.body);

    function cleanupPosition($element) {
        $element.removeClass(css.top);
        $element.removeClass(css.bottom);
        $element.removeClass(css.left);
        $element.removeClass(css.right);
        $element.removeClass(css.middle);
    }

    // #region horizontal

    function getHorizontalPosition($contextElement, $element) {
        elementSize = {
            width: $element.outerWidth(),
            height: $element.outerWidth()
        };

        containerSize = {
            width: $contextElement.width(),
            height: $contextElement.height()
        };

        var preferredPosition = getPreferredHorizontalPosition($contextElement),
            fitsRight = fitsToRight($contextElement),
            fitsLeft = fitsToLeft($contextElement);

        if (preferredPosition === css.left && fitsLeft) {
            return css.left;
        }

        if (preferredPosition === css.right && fitsRight) {
            return css.right;
        }

        if (fitsLeft) {
            return css.left;
        }

        if (fitsRight) {
            return css.right;
        }

        return undefined;
    }

    function fitsToRight($contextElement) {
        var constainerX = $contextElement.offset().left;
        return ($windowContainer.width() - constainerX - containerSize.width - margin.x - elementSize.width) > 0;
    }

    function fitsToLeft($contextElement) {
        var constainerX = $contextElement.offset().left;
        return (constainerX - margin.x - elementSize.width) > 0;
    }

    function getPreferredHorizontalPosition($contextElement) {
        var constainerX = $contextElement.offset().left;
        return $windowContainer.width() / 2 - constainerX > 0 ? css.right : css.left;
    }

    // #endregion

    // #region vertical

    function getVerticalPosition($contextElement) {
        var preferredPosition = getPreferredVerticalPosition($contextElement),
            fitsTop = fitsToTop($contextElement),
            fitsBottom = fitsToBottom($contextElement);

        if (preferredPosition === css.top && fitsTop) {
            return css.top;
        }

        if (preferredPosition === css.bottom && fitsBottom) {
            return css.bottom;
        }

        if (fitsTop) {
            return css.top;
        }

        if (fitsBottom) {
            return css.bottom;
        }

        return undefined;
    }

    function fitsToBottom($contextElement) {
        var constainerY = $contextElement.offset().top;
        return ($windowContainer.height() - constainerY - containerSize.height - margin.y - elementSize.height) > 0;
    }

    function fitsToTop($contextElement) {
        var constainerY = $contextElement.offset().top;
        return (constainerY - margin.y - elementSize.height) > 0;
    }

    function getPreferredVerticalPosition($contextElement) {
        var constainerY = $contextElement.offset().top;
        return $windowContainer.height() / 2 - constainerY > 0 ? css.bottom : css.top;
    }

    // #endregion

    return {
        cleanupPosition: cleanupPosition,
        getHorizontalPosition: getHorizontalPosition,
        getVerticalPosition: getVerticalPosition
    };
};
    
module.exports = ElementPositioner;