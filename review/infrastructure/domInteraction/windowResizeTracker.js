(function (review) {
    'use strict';

    review.WindowResizeTracker = function () {
        function track(resizeStartedHandler, resizeFinishedHandler) {
            var rtime;
            var timeout = false;
            var delta = 200;
            $(window).resize(function () {
                resizeStartedHandler();
                rtime = new Date();
                if (timeout === false) {
                    timeout = true;
                    setTimeout(resizeend, delta);
                }
            });

            function resizeend() {
                if (new Date() - rtime < delta) {
                    setTimeout(resizeend, delta);
                } else {
                    timeout = false;
                    resizeFinishedHandler();
                }
            }
        }

        return {
            track: track
        };
    };

})(window.review = window.review || {});