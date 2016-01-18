import constants from './../infrastructure/constants';
import SpotCollection from './SpotCollection';
import Spot from './Spot';
import MultiEventTracker from './../infrastructure/domInteraction/multiEventTracker';
import hintController from './../hints/hintController';

class SpotController{
    constructor() {
        this.spotCollection = new SpotCollection();
    }

    hideSpots() {
        this.spotCollection.hideSpots();
        hintController.hideHints();
    }

    showSpots() {
        this.spotCollection.showSpots();
        hintController.showHintsIfNeeded();
    }

    updatePositions(){
        this.spotCollection.updatePositions();
    }

    renderSpots() {
        var spotIds = [];
        var that = this;
        $(constants.selectors.reviewable).each(function () {
            var $element = $(this);
            var spot = that.renderSpot($element);
            if (spot) {
                spotIds.push(spot.id);
            }
        });

        this.spotCollection.filterSpots(spotIds);
        hintController.openHintsIfNeeded();
    }

    renderSpot($element) {
        var that = this;
        var spotId = getReviewSpotIdAttachedToElement($element);
        if (spotId) {
            var spot = this.spotCollection.getSpotById(spotId);
            spot.updatePosition();
            return spot;
        }

        var spot = this.spotCollection.addSpot($element);
        spot.show();
        return spot;

        function getReviewSpotIdAttachedToElement($element) {
            var data = $element.data();
            if (!data)
                return false;

            return data.reviewSpotId;
        }
    }
}

var spotController = new SpotController();
export default spotController;