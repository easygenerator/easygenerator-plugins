import constants from './../constants';
import windowProperiesProvider from './windowPropertiesProvider';

const css = constants.css;

class ElementPositioner{
    constructor(margin){
        this.margin = margin;
        this.$windowContainer = $(constants.selectors.body);
    }

    cleanupPosition($element) {
        $element.removeClass(css.top);
        $element.removeClass(css.bottom);
        $element.removeClass(css.left);
        $element.removeClass(css.right);
        $element.removeClass(css.middle);
    }

    getPosition($contextElement, $element){
        var that=this;

        var elementSize = {
            width: $element.outerWidth(),
            height: $element.outerWidth()
        };

        var containerSize = {
            width: $contextElement.width(),
            height: $contextElement.height()
        };

        return {
            vertical: getVerticalPosition(),
            horizontal: getHorizontalPosition()
        };

        function getHorizontalPosition() {
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

            function fitsToRight($contextElement) {
                var constainerX = $contextElement.offset().left;
                return (that.$windowContainer.width() - constainerX - containerSize.width - that.margin.x - elementSize.width) > 0;
            }

            function fitsToLeft($contextElement) {
                var constainerX = $contextElement.offset().left;
                return (constainerX - that.margin.x - elementSize.width) > 0;
            }

            function getPreferredHorizontalPosition($contextElement) {
                var constainerX = $contextElement.offset().left;
                return that.$windowContainer.width() / 2 - constainerX > 0 ? css.right : css.left;
            }
        }

        function getVerticalPosition() {
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

            function fitsToBottom($contextElement) {
                var constainerY = $contextElement.offset().top - windowProperiesProvider.scrollTop();
                return (that.$windowContainer.height() - constainerY - containerSize.height - that.margin.y - elementSize.height) > 0;
            }

            function fitsToTop($contextElement) {
                var constainerY = $contextElement.offset().top - windowProperiesProvider.scrollTop();
                return (constainerY - that.margin.y - elementSize.height) > 0;
            }

            function getPreferredVerticalPosition($contextElement) {
                var constainerY = $contextElement.offset().top - windowProperiesProvider.scrollTop();
                return that.$windowContainer.height() / 2 - constainerY > 0 ? css.bottom : css.top;
            }
        }
    }
}

export default ElementPositioner;