class MultiEventTracker{
    constructor(startHandler, endHandler, useFirstTimeTimeout, interval){
        this.startHandler = startHandler;
        this.endHandler = endHandler;
        this.useFirstTimeTimeout=useFirstTimeTimeout;
        this.delta = interval ? interval : 200;
        this.timeout = false;
        this.runTime = null;
    }

    eventTrigerred(){
        var that = this;
        if (this.useFirstTimeTimeout) {
            setTimeout(function() {
                that.handleEvent();
            }, 0);
        }else {
            this.handleEvent();
        }
    }

    handleEvent(){
        var that=this;
        this.runTime = new Date();
        if (this.timeout === false) {
            if (this.startHandler) {
                this.startHandler();
            }

            this.timeout = true;
            setTimeout(function(){
                that.eventStoppedTrigerring();
            }, this.delta);
        }
    }

    eventStoppedTrigerring() {
        var that = this;
        if (new Date() - this.runTime < this.delta) {
            setTimeout(function(){
                that.eventStoppedTrigerring();
            }, this.delta);
        } else {
            this.timeout = false;
            if (this.endHandler) {
                this.endHandler();
            }
        }
    }
}


//var MultiEventTracker = function (startHandler, endHandler, useFirstTimeTimeout, interval) {
//    var rtime;
//    var timeout = false;
//    var delta = interval ? interval : 200;
        
//    function eventTrigerred(){
//        if (useFirstTimeTimeout) {
//            setTimeout(function() {
//                eventHandler();
//            }, 0);
//        }else {
//            eventHandler();
//        }
//    }

//    function eventHandler(){
//        rtime = new Date();
//        if (timeout === false) {
//            if (startHandler) {
//                startHandler();
//            }

//            timeout = true;
//            setTimeout(eventStoppedTrigerring, delta);
//        }
//    }
    
//    function eventStoppedTrigerring() {
//        if (new Date() - rtime < delta) {
//            setTimeout(eventStoppedTrigerring, delta);
//        } else {
//            timeout = false;
//            if (endHandler) {
//                endHandler();
//            }
//        }
//    }

//    return {
//        eventTrigerred: eventTrigerred
//    };
//};

export default MultiEventTracker;