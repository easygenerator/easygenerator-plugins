import Spot from './Spot';

export default class SpotCollection{
    constructor() {
        this.collection = [];
        this.maxId = 0;
    }

    addSpot($contextElement) {
        let maxId = getArrayElementMaxId(this.collection),
            spot = new Spot(maxId + 1, $contextElement);

        this.collection.push(spot);
        spot.render();
        spot.show();

        new ResizeSensor(spot.$contextElement, () => {
            this.updatePositions();
        });

        return spot;
    }

    getSpotById(id) {
        let result = null;
        this.collection.forEach(spot => {
            if(spot.id === id) {
                result = spot;
            }
        });

        return result;
    }

    hideSpots() {
        this.collection.forEach(spot => spot.hide());
    }

    showSpots() {
        this.collection.forEach(spot => spot.show());
    }

    updatePositions(){
        this.collection.forEach(spot => spot.updatePosition());
    }

    detachSpot(spot){
        ResizeSensor.detach(spot.$contextElement);
        spot.remove();
    }

    filterSpots(ids) {
        let arr = this.collection.filter(item => {
            return ids.some(id => {
                return item.id === id;
            });
        });

        this.collection.forEach(spot => {
            if (arr.indexOf(spot) === -1) {
                this.detachSpot(spot);
            }
        });

        this.collection = arr;
    }
}

function getArrayElementMaxId(arr) {
    if (arr.length === 0)
        return 0;

    return Math.max.apply(null, arr.map(i => i.id));
}