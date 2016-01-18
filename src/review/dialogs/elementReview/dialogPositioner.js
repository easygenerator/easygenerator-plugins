import constants from './../../infrastructure/constants';
import ElementPositioner from './../../infrastructure/domInteraction/elementPositioner';
  
const css = constants.css,
      margin = {
            x: 0,
            y: 0
      };

class DialogPositioner{
    setPosition($container, $element) {
        var positioner = new ElementPositioner(margin);
        positioner.cleanupPosition($element);

        var position = positioner.getPosition($container, $element);
            
        $element.addClass(position.horizontal ? position.horizontal : css.middle);
        $element.addClass(position.vertical ? position.vertical : css.bottom);
    }
}

export default DialogPositioner;