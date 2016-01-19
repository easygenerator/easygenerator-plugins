import SpotPositioner from './spotPositioner';
import reviewSpotHtml from './spot.html';
import constants from './../infrastructure/constants';
import htmlMarkupProvider from './../infrastructure/htmlMarkupProvider';
import dialogController from './../dialogs/dialogController';
import hintController from './../hints/hintController';

class Spot {
    constructor(id, $contextElement) {
        this.id = id;
        this.$element = null;
        this.$contextElement = $contextElement;
        this.spotMarkup = htmlMarkupProvider.getHtmlMarkup(reviewSpotHtml);
    }

    render(){
        var $element = $(this.spotMarkup).appendTo(constants.selectors.body);
        this.$element = $element;
        $element.hide();

        this.$element.data({ reviewSpotId: this.id });
        this.$contextElement.data({ reviewSpotId: this.id });

        this.$element.find(constants.selectors.reviewSpot).click(function () {
            if (hintController.isSpotReviewHintOpened()) {
                hintController.closeSpotReviewHint();
            } 

            dialogController.showElementReviewDialog($element);
        });
    }

    show(){
        this.updatePosition();
        this.$element.trigger(constants.events.elementShown);
        this.$element.show();
    }

    hide(){
        this.$element.trigger(constants.events.elementHidden);
        this.$element.hide();
    }
  
    updatePosition() {
        new SpotPositioner().updatePosition(this);
    }

    remove(){
        this.$element.trigger(constants.events.elementDestroyed);
        this.$element.remove();
    }
}

export default Spot;