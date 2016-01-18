import constants from './../infrastructure/constants';
import windowPropertiesProvider from './../infrastructure/domInteraction/windowPropertiesProvider';

var margin = {
    x: 3,
    y: 10
},
    size = {
        width: 32,
        height: 32
    };

class SpotPositioner{
    constructor () {
        this.$windowContainer = $(window);
    }

    updatePosition(spot) {
        var currentPosition = spot.$element.position();
        var position = this.calculatePosition(spot);

        if (currentPosition.left === position.x && currentPosition.top === position.y)
            return;

        var styles = {
            left: position.x,
            top: position.y
        };

        spot.$element.css(styles);
        spot.$element.trigger(constants.events.positionUpdated);
    }

    calculatePosition(spot) {
        var that = this;
        
        var position = getContextElementTopRightPosition(spot.$contextElement);

        position.x = fitsInOuterCornerHirizonatlly(position) ? position.x + margin.x : position.x - size.width;
        
        if(isElementPartlyScrolledUp(spot.$contextElement)){
            position.y = windowPropertiesProvider.scrollTop() + margin.y;
        }
        else{
            position.y = fitsInOuterCornerVertically(position) ? position.y + margin.y - size.width : position.y + margin.y;
        }

        return position;

        function isElementPartlyScrolledUp($contextElement){
            var scrollTop = windowPropertiesProvider.scrollTop();
            if(scrollTop === 0)
                return false;

            var y = $contextElement.offset().top - scrollTop;
            var height = $contextElement.outerHeight();

            return y - size.height + margin.y < 0 && y + height >= size.height + margin.y;
        }

        function getContextElementTopRightPosition($contextElement) { 
            var offset = $contextElement.offset();
            return {
                y: offset.top,
                x: offset.left + $contextElement.outerWidth()
            }
        }

        function fitsInOuterCornerHirizonatlly(position) {
            var windowWidth = that.$windowContainer.width();
            return windowWidth - position.x - size.width - margin.x > 0;
        }

        function fitsInOuterCornerVertically(position) {
            return position.y + margin.y - size.width > 0;
        }
    }
}

export default SpotPositioner;