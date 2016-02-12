import SpotPositioner from './spotPositioner';
import reviewSpotHtml from './spot.html';
import SpotContextValidator from './spotContextValidator';
import constants from './../infrastructure/constants';
import htmlMarkupProvider from './../infrastructure/htmlMarkupProvider';
import dialogController from './../dialogs/dialogController';
import hintController from './../hints/hintController';

export default class Spot {
    constructor(id, $contextElement) {    
        this.id = id;
        this.$element = null;
        this.$contextElement = $contextElement;
        this.context = this.$contextElement.data(constants.dataKeys.reviewContext);        
        this.spotMarkup = htmlMarkupProvider.getHtmlMarkup(reviewSpotHtml);
        
        new SpotContextValidator().validate(this.context);
    }

    render() {        
        this.$element = $(this.spotMarkup).appendTo(constants.selectors.body);

        this.$element.data(constants.dataKeys.reviewSpotId, this.id);
        this.$contextElement.data(constants.dataKeys.reviewSpotId, this.id);

        this.$element.find(constants.selectors.reviewSpot).click(() => {
            if (hintController.isSpotReviewHintOpened()) {
                hintController.closeSpotReviewHint();
            } 

            dialogController.showElementReviewDialog(this);
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
