import reviewService from './reviewService';
import hintController from './hints/hintController';
import spotController from './spots/spotController';
import dialogController from './dialogs/dialogController';
import EventTracker from './infrastructure/domInteraction/eventTracker';
import WindowPluginsObjectExtender from './../windowPluginsObjectExtender';

class Plugin{
    init(settings) {
        if ($ === undefined) {
            throw 'Easygenerator review requires jQuery';
        }

        if (!settings) {
            throw 'Failed to initialize review plugin. Settings are not defined.';
        }

        if (!settings.reviewApiUrl) {
            throw 'Failed to initialize review plugin. Review api url is invalid.';
        }

        if (!settings.courseId) {
            throw 'Failed to initialize review plugin. Course id is invalid.';
        }

        reviewService.init(settings.reviewApiUrl, settings.courseId);     
        hintController.init();
        dialogController.init();

        var eventTracker = new EventTracker();

        eventTracker.trackWindowResize(function () {
            spotController.hideSpots();
        }, function () {
            spotController.showSpots();
        });

        eventTracker.trackWindowScroll(function () {
            spotController.updatePositions();
        });

        dialogController.showGeneralReviewDialog();
    }

    renderSpots(){
        spotController.renderSpots();
    }
}

new WindowPluginsObjectExtender().extend('ReviewPlugin', Plugin);

export default Plugin;