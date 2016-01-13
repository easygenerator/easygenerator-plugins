var WindowResizeTracker = function () {
    function trackWindowResize(resizeStartedHandler, resizeFinishedHandler) {
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
        trackWindowResize: trackWindowResize
    };
};

module.exports = WindowResizeTracker;