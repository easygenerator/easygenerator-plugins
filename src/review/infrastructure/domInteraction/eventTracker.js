import MultiEventTracker from './multiEventTracker';
import constants from './../constants';

class EventTracker{
    trackWindowResize(resizeStartedHandler, resizeFinishedHandler) {
        var multiEventTracker = new MultiEventTracker(resizeStartedHandler, resizeFinishedHandler);

        $(window).resize(function () {
            multiEventTracker.eventTrigerred();
        });
    }

    trackWindowScroll(handler) {
        $(window).scroll(function () {
            handler();
        });
    }
}

export default EventTracker;