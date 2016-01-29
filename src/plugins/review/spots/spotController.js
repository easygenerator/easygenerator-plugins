import constants from './../infrastructure/constants';
import hintController from './../hints/hintController';
import dialogController from './../dialogs/dialogController';
import SpotCollection from './SpotCollection';

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
        dialogController.updatePositionIfNeeded();
    }

    renderSpots() {
        var existingSpotIds = [];
        $(constants.selectors.reviewable).each((index, value) => {
            let $element = $(value),
                spot = this.renderSpot($element);

            if (spot) {
                existingSpotIds.push(spot.id);
            }
        });

        this.spotCollection.filterSpots(existingSpotIds);
        hintController.openHintsIfNeeded();
    }

    renderSpot($element) {
        var spotId = getAttachedSpotId($element);
        if (spotId) {
            let spot = this.spotCollection.getSpotById(spotId);
            spot.updatePosition();
            return spot;
        }

        return this.spotCollection.addSpot($element);
    }
}

function getAttachedSpotId($element) {
    var data = $element.data();
    if (!data)
        return false;

    return data.reviewSpotId;
}

var spotController = new SpotController();
export default spotController;

