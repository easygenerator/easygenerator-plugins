import ReviewService from './reviewService';
import HintController from './hints/hintController';
import SpotController from './spots/spotController';
import ReviewDialogController from './dialogs/ReviewDialogController';
import WindowEventTracker from './infrastructure/domInteraction/windowEventTracker';
import localizationService from './../localization/localizationService';

import styles from './css/review.less';

var Plugin = function () {
    var spotController = null,
        hintController = null,
        dialogController = null;

    function init(settings) {
        if ($ === undefined) {
            throw 'Easygenerator review requires jQuery';
        }

        if (!settings) {
            throw 'Failed to initialize review plugin. Settings are not defined.';
        }
        
        if (!settings.locale) {
            throw 'Failed to initialize review plugin. Settings locale is not defined.';
        }

        if (!settings.reviewApiUrl) {
            throw 'Failed to initialize review plugin. Review api url is invalid.';
        }

        if (!settings.courseId) {
            throw 'Failed to initialize review plugin. Course id is invalid.';
        }

        localizationService.init(settings.locale);

        var reviewService = new ReviewService(settings.reviewApiUrl, settings.courseId);
        hintController = new HintController(),
        dialogController = new ReviewDialogController(reviewService, hintController),
        spotController = new SpotController(hintController, dialogController);

        var windowEventTracker = new WindowEventTracker();

        windowEventTracker.trackWindowResize(function () {
            spotController.hideSpots();
            hintController.hideHints();
        }, function () {
            spotController.showSpots();
            hintController.showHintsIfNeeded();
            dialogController.updatePositionIfNeeded();
        });

        dialogController.showGeneralReviewDialog();
    }

    function renderSpots() {
        if (!spotController||!hintController) {
            throw 'Easygenerator review plugin is not initialized.';
        }
            
        spotController.renderSpots();
        hintController.showHintsIfNeeded();
    }

    return {
        init: init,
        renderSpots: renderSpots
    };
};
    
window.easygeneratorPlugins= {
    ReviewPlugin: Plugin
};
    
module.exports = Plugin;