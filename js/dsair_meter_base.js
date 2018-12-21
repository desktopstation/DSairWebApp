//
var DsairMeterBase = function (inCanvasName) {
    this._canvasName = inCanvasName;
    this._meterController = null;
    window.addEventListener('load', this);
};

DsairMeterBase.prototype._internalMeterRange = 1024;

DsairMeterBase.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'load':
            this.onLoad();
            break;
        default:
            break;
    }
};

DsairMeterBase.prototype.onLoad = function() {
    this._setControlInfo();
};

DsairMeterBase.prototype.addMeterController = function (inController) {
    this._meterController = inController;
};

DsairMeterBase.prototype.removeMeterController = function (inController) {
    if (this._meterController == inController) {
        this._meterController = null;    
    }
};

DsairMeterBase.prototype.onDrawMeter = function (/*inValue, inLocDir*/) {
};

DsairMeterBase.prototype.setMeterMaxValue = function (/*inMeterMaxValue*/) {
};

DsairMeterBase.prototype._setControlInfo = function() {
};
