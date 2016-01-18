import HintPositioner from './hintPositioner';
import constants from './../infrastructure/constants';
import htmlMarkupProvider from './../infrastructure/htmlMarkupProvider';
import hintHtml from './hint.html';

var hintPositioner = new HintPositioner();

class Hint{
    constructor(text, css, gotItHandler){
        this.isShown = false;
        this.$element = $(htmlMarkupProvider.getHtmlMarkup(hintHtml));
        this.$spot = null;

        this.$element.addClass(css);
        this.$element.find(constants.selectors.reviewHintText).text(text);
        this.$element.find(constants.selectors.reviewHitnBtn).click(gotItHandler);

        this.updatePositionProxy = this.updatePosition.bind(this);
        this.hideProxy = this.hide.bind(this);
        this.showProxy = this.show.bind(this);
        this.closeProxy = this.close.bind(this);
    }

    open($spot) {
        this.$element.appendTo($(constants.selectors.body));
        if ($spot) {
            this.$spot = $spot;

            this.$spot.on(constants.events.positionUpdated, this.updatePositionProxy);
            this.$spot.on(constants.events.elementHidden, this.hideProxy);
            this.$spot.on(constants.events.elementShown, this.showProxy);
            this.$spot.on(constants.events.elementDestroyed, this.closeProxy);

            this.updatePosition();
        }

        this.isShown = true;
        this.$element.show();
    }

    show(){
        this.updatePosition();
        this.$element.show();
    }

    hide(){
        this.$element.hide();
    }

    close() {
        if (!this.isShown)
            return;

        this.$element.detach();
        this.isShown = false;

        if (this.$spot) {
            this.$spot.off(constants.events.positionUpdated, this.updatePositionProxy);
            this.$spot.off(constants.events.elementHidden, this.hideProxy);
            this.$spot.off(constants.events.elementShown, this.showProxy);
            this.$spot.off(constants.events.elementDestroyed, this.closeProxy);
            this.$spot = null;
        }
    }

    updatePosition(){
        if(this.$spot){
            hintPositioner.updatePosition(this);
        }
    }
}
    
export default Hint;