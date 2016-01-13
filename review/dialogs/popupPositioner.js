import constants from './../infrastructure/constants';
import ElementPositioner from './../infrastructure/domInteraction/elementPositioner';
  
var PopupPositioner = function () {
    var css = constants.css,
        margin = {
            x: 0,
            y: 0
        },
        positioner = new ElementPositioner(margin);

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

module.exports = PopupPositioner;