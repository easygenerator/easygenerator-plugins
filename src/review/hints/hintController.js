import Hint from './hint';
import constants from './../infrastructure/constants';
import clientContext from './../infrastructure/clientContext';
import localizationService from './../../localization/localizationService';

class HintController{
    init(){
        var that = this;
        this.spotReviewHint = new Hint(localizationService.localize('elementReviewHint'), constants.css.spotReviewHint,
            function () {
                that.closeSpotReviewHint();
            }),
        this.generalReviewHint = new Hint(localizationService.localize('generalReviewHint'), constants.css.generalReviewHint + ' ' + constants.css.top,
            function () {
                that.closeGeneralReviewHint();
            });
    }

    closeSpotReviewHint() {
        this.spotReviewHint.close();
        clientContext.set(constants.clientContextKeys.reviewSpotHintShown, true);

        this.openHintsIfNeeded();
    }

    closeGeneralReviewHint() {
        this.generalReviewHint.close();
        clientContext.set(constants.clientContextKeys.reviewGeneralHintShown, true);

        this.openHintsIfNeeded();
    }

    isSpotReviewHintOpened() {
        return this.spotReviewHint.isShown;
    }

    isGeneralReviewHintOpened() {
        return this.generalReviewHint.isShown;
    }

    openHintsIfNeeded() {
        if (this.generalReviewHint.isShown)
            return;

        if (this.spotReviewHint.isShown) {
            spotReviewHint.hide();
        }

        if (clientContext.get(constants.clientContextKeys.reviewSpotHintShown) !== true) {
            var $spots = $(constants.selectors.reviewSpotWrapper);
            if ($spots.length > 0) {
                this.spotReviewHint.open($($spots[0]));
                return;
            } 
        }

        if (clientContext.get(constants.clientContextKeys.reviewGeneralHintShown) !== true) {
            this.generalReviewHint.open();
        }
    }

    showHintsIfNeeded(){
        this.spotReviewHint.show();
        this.generalReviewHint.show();
    }

    hideHints() {
        this.spotReviewHint.hide();
        this.generalReviewHint.hide();
    }
}

var hintController = new HintController();
export default hintController;