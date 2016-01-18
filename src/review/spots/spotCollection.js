import Spot from './Spot';

class SpotCollection{
    constructor() {
        this.collection = [];
        this.maxId = 0;
    }

    addSpot($contextElement) {
        var that = this;
        var spot = new Spot(this.maxId + 1, $contextElement);
        spot.render();
        this.collection.push(spot);
        this.maxId++;

        new ResizeSensor(spot.$contextElement, function(){
            that.updatePositions();
        });

        return spot;
    }

    getSpotById(id) {
        var result = null;
        this.collection.forEach(function (spot) {
            if(spot.id === id) {
                result = spot;
            }
        });

        return result;
    }

    hideSpots() {
        this.collection.forEach(function (spot) {
            spot.hide();
        });
    }

    showSpots() {
        this.collection.forEach(function (spot) {
            spot.show();
        });
    }

    updatePositions(animate){
        this.collection.forEach(function (spot) {
            spot.updatePosition(animate);
        });
    }

    detachSpot(spot){
        ResizeSensor.detach(spot.$contextElement);
        spot.remove();
    }

    filterSpots(ids) {
        var that=this;
        var arr = this.collection.filter(function (item) {
            return ids.some(function (id) {
                return item.id === id;
            });
        });

        this.collection.forEach(function (spot) {
            if (arr.indexOf(spot) === -1) {
                that.detachSpot(spot);
            }
        });

        this.collection = arr;
    }
}

export default SpotCollection;