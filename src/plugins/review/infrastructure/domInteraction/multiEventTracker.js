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
        if (this.useFirstTimeTimeout) {
            setTimeout(() => {
                this.handleEvent();
            }, 0);
        }else {
            this.handleEvent();
        }
    }

    handleEvent(){
        this.runTime = new Date();
        if (this.timeout === false) {
            if (this.startHandler) {
                this.startHandler();
            }

            this.timeout = true;
            setTimeout(() => {
                this.eventStoppedTrigerring();
            }, this.delta);
        }
    }

    eventStoppedTrigerring() {
        if (new Date() - this.runTime < this.delta) {
            setTimeout(() => {
                this.eventStoppedTrigerring();
            }, this.delta);
        } else {
            this.timeout = false;
            if (this.endHandler) {
                this.endHandler();
            }
        }
    }
}

export default MultiEventTracker;