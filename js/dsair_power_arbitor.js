//
var DsairPowerArbitor = function () {
    this._powerStatus = DsairConst.powerOff;
    this._powerStateChangeCallback = [];
    this._ownerName = '';
    window.addEventListener('load', this);
};

DsairPowerArbitor.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'load':
            this.onLoad();
            break;
        default:
            break;
    }
};

// 初期化
DsairPowerArbitor.prototype.onLoad = function() {
    this.callPowerStateChangeCallback();
};

DsairPowerArbitor.prototype.addPowerStateChangeCallback = function (inCallback) {
    this._powerStateChangeCallback.push(inCallback);
};

DsairPowerArbitor.prototype.tryPowerOn = function (inOwnerName) {
    if (this._powerStatus == DsairConst.powerOff) {
        this._powerStatus = DsairConst.powerOn;
        this._ownerName = inOwnerName;
        this.callPowerStateChangeCallback();
        return true;
    }
    console.info('Owner is "%s"', this._ownerName);
    return false;
};

DsairPowerArbitor.prototype.powerOff = function (inOwnerName) {
    if (inOwnerName != this._ownerName) {
        console.info('Invalid owner "%s"', this._ownerName);
        return;
    }
    this._powerStatus = DsairConst.powerOff;
    this.callPowerStateChangeCallback();
    this._ownerName = '';
};

DsairPowerArbitor.prototype.getPowerOwner = function () {
    return this._ownerName;
};

DsairPowerArbitor.prototype.callPowerStateChangeCallback = function () {
    for (let cb of this._powerStateChangeCallback) {
        cb.onPowerStateChange(this._ownerName, this._powerStatus);
    }
};

