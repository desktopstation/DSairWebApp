var DsairSpeedControl = function () {
    this._controller = null;
};

DsairSpeedControl.prototype._speedRange = 1024;

DsairSpeedControl.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'mousedown':
            this.onClickCanvasDown(e);
            break;
        case 'mousemove':
            this.onClickCanvasMove(e);
            break;
        case 'mouseup':
            this.onClickCanvasUp(e);
            break;
        case 'touchstart':
            this.onTouchCanvasDown(e);
            break;
        case 'touchmove':
            this.onTouchCanvasMove(e);
            break;
        case 'touchend':
            this.onTouchCanvasUp(e);
            break;
        default:
            break;
    }
};

DsairSpeedControl.prototype.onClickCanvasDown = function (/*e*/) {
};

DsairSpeedControl.prototype.onClickCanvasMove = function (/*e*/) {
};

DsairSpeedControl.prototype.onClickCanvasUp = function (/*e*/) {
};

DsairSpeedControl.prototype.onTouchCanvasDown = function (/*e*/) {
};

DsairSpeedControl.prototype.onTouchCanvasMove = function (/*e*/) {
};

DsairSpeedControl.prototype.onTouchCanvasUp = function (/*e*/) {
};

DsairSpeedControl.prototype.addCabController = function (inController) {
    this._controller = inController;
};

DsairSpeedControl.prototype.removeCabController = function (inController) {
    if (this._controller == inController) {
        this._controller = null;
    }
};

DsairSpeedControl.prototype.setControlInfo = function (/*meterInfo*/) {

};


DsairSpeedControl.prototype.setMeterMaxValue = function (/*inMeterMaxSpeed*/) {

};
