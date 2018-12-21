//
//
var DsairCabControlMock = function () {
    DsairCabControl.call(this);
    this._currentLocSpeed = 0;
    this._lastLocSpeed = 0;
    this._speedMeter = [];
    this._powerStatus = 1;
    this._locDir = DsairConst.dirFWD;
    console.log('initialize');
};

inherits(DsairCabControlMock, DsairCabControl);

DsairCabControlMock.prototype._meterMaxSpeed = 240;

DsairCabControlMock.prototype.handleEvent = function(e) {
    switch (e.type) {
        case 'load':
            this.onLoad();
            break;
        default:
            break;
    }
};

DsairCabControlMock.prototype.onChangeSpeed = function (inSpeed) {
    console.info('ChangeSpeed %d', inSpeed);
    this._currentLocSpeed = inSpeed;
    for (let meter of this._speedMeter) {
        meter.onDrawMeter(this._currentLocSpeed, this._locDir);
    }
};

DsairCabControlMock.prototype.setMeterMaxSpeed = function (inMeterMaxSpeed) {
    console.log("Meter max speed = %d", inMeterMaxSpeed);
    for (let meter of this._speedMeter) {
        meter.setMeterMaxValue(inMeterMaxSpeed, this._locDir);
    }
    //this._speedControl.setMeterMaxValue(inMeterMaxSpeed);
};

DsairCabControlMock.prototype.onLoad = function () {
    this.setMeterMaxSpeed(this._meterMaxSpeed);
    if (this._configControl != null) {
        this._configControl.setMeterMaxSpeed(this._meterMaxSpeed);
    }
};

DsairCabControlMock.prototype.onDataLoad = function () {
    // プロトコル設定
    let aLocProtocol = this._storage.getLocProtocol();
    this._configControl.setLocProtocol(aLocProtocol);
};
