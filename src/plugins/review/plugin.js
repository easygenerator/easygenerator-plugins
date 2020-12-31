import reviewService from './reviewService';
import hintController from './hints/hintController';
import spotController from './spots/spotController';
import dialogController from './dialogs/dialogController';
import EventTracker from './infrastructure/domInteraction/eventTracker';

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

        //if (!settings.authoringToolDomain) {
        //    throw 'Failed to initialize review plugin. AuthoringToolDomain is invalid.';
        //}

        reviewService.init(settings.reviewApiUrl, settings.courseId, settings.authoringToolDomain);
        hintController.init();
        dialogController.init();

        var eventTracker = new EventTracker();

        eventTracker.trackWindowResize(() => {
            spotController.hideSpots();
        }, () => {
            spotController.showSpots();
        });

        eventTracker.trackWindowScroll(() => {
            spotController.updatePositions();
        });

        dialogController.showGeneralReviewDialog();
    }

    renderSpots(){
        spotController.renderSpots();
    }
}

window.ReviewPlugin = Plugin;
export default Plugin;
