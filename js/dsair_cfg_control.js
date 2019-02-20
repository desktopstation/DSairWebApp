var DsairConfigControl = function () {
    this._dsairCabControl = null;
    this._dsairAccControl = null;
    this._dsairConfigView = null;
    this._dsairCommand = null;
    this._storage = null;
    this._LocProtocol = 0;
    this._LocSpeedStep = 0;
    this._AccProtocol = 0;
    this._meterMaxSpeed = 0;
    this._masterCode = null;
    this._appSSID = null;
    this._appNetworkKey = null;

    window.addEventListener('load', this);
};

DsairConfigControl.prototype._speedFactor = 60;

DsairConfigControl.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'load':
            this.onLoad();
            break;
        default:
            break;
    }
};

DsairConfigControl.prototype.onLoad = function () {
    this._dsairCommand.getMasterCode(this, 'getMasterCodeCallback');
    this._dsairCommand.getSSID(this, 'getSSIDCallback');
    this._dsairCommand.getAppNetworoKey(this, 'getAppNetworkKeyCallback');
};

DsairConfigControl.prototype.addDsairCommand = function (inCommand) {
    this._dsairCommand = inCommand;
};

DsairConfigControl.prototype.addStorage = function (inStorage) {
    this._storage = inStorage;
};

DsairConfigControl.prototype.addCabControl = function (inCabControl) {
    this._dsairCabControl = inCabControl;
};

DsairConfigControl.prototype.addAccControl = function (inAccControl) {
    this._dsairAccControl = inAccControl;
};

DsairConfigControl.prototype.addView = function (inView) {
    this._dsairConfigView = inView;
    this._dsairConfigView.addController(this);
};
//

DsairConfigControl.prototype.onSelectProtocol = function () {
    if (this._dsairConfigView.getLocProtocol() == 1) {
        //DCC
        this._LocProtocol = DsairConst.protocolDCC;
        this._LocSpeedStep = 2;
    } else {
        //MM2
        this._LocProtocol = DsairConst.protocolMM2;
        this._LocSpeedStep = 0;
    }
    this._dsairCabControl.setLocProtocol(this._LocProtocol);
    this._storage.SaveProtcolLoc(this._LocProtocol);
};

DsairConfigControl.prototype.onSelectAccProtocol = function () {
    if (this._dsairConfigView.getAccProtocol() == 1) {
        //DCC
        this._AccProtocol = DsairConst.protocolDCC; // 14335;
    } else {
        //MM2
        this._AccProtocol = DsairConst.protocolMM2; // 12287;
    }
    this._dsairAccControl.setAccProtocol(this._AccProtocol);
    this._storage.SaveProtcolAcc(this._AccProtocol);
};

DsairConfigControl.prototype.onConfigMaxSpeed = function () {
    var aMaxSpeed = this._dsairConfigView.getSliderValue() * this._speedFactor;
    if (this._meterMaxSpeed == aMaxSpeed) {
        return;
    }
    this._dsairCabControl.setMeterMaxSpeed(aMaxSpeed);
};

DsairConfigControl.prototype.setParams = function () {
    this._appSSID = this._dsairConfigView.setAppSSID();
    this._appNetworkKey = this._dsairConfigView.getAppMetworkKey();
    this._dsairCommand.setParams(this._masterCode, this._appSSID, this._appNetworkKey);
};

//

DsairConfigControl.prototype.setLocProtocol = function (inLocProtocol) {
    if (inLocProtocol == DsairConst.protocolMM2) {
        this._LocProtocol = inLocProtocol;
        this._dsairConfigView.setLocProtocolMM2();
    } else if (inLocProtocol == DsairConst.protocolDCC) {
        this._LocProtocol = inLocProtocol;
        this._dsairConfigView.setLocProtocolDCC();
    } else {
        console.info('Unknown loco protocol "%s"', inLocProtocol);
    }
};

DsairConfigControl.prototype.setMeterMaxSpeed = function (inMaxSpeed) {
    //console.log(inMaxSpeed);
    this._meterMaxSpeed = inMaxSpeed;
    this._dsairConfigView.setSliderValue(this._meterMaxSpeed / this._speedFactor);
    this._dsairConfigView.setSliderLabelValue(this._meterMaxSpeed);
    this._storage.SaveMaxSpeed(this._meterMaxSpeed);
};

DsairConfigControl.prototype.setAccProtocol = function (inAccProtocol) {
    if (inAccProtocol == DsairConst.protocolMM2) {
        this._AccProtocol = inAccProtocol;
        this._dsairConfigView.setAccProtocolMM2();
    } else if (inAccProtocol == DsairConst.protocolDCC) {
        this._AccProtocol = inAccProtocol;
        this._dsairConfigView.setAccProtocolDCC();
    } else {
        console.info('Unknown accessory protocol "%s"', inAccProtocol);
    }
};
//

DsairConfigControl.prototype.getMasterCode = function () {
    return this._masterCode;
};

DsairConfigControl.prototype.getAppSSID = function () {
    return this._appSSID;
};

DsairConfigControl.prototype.getAppMetworkKey = function () {
    return this._appNetworkKey;
};

DsairConfigControl.prototype.setSliderValueCb = function(data) {
    this._dsairConfigView.setSliderValue(data);
};

// Flashairからデータ取得時に呼ばれるコールバック関数

DsairConfigControl.prototype.getMasterCodeCallback = function (data) {
    this._masterCode = data;
    this._dsairConfigView.setMasterCode(data);
};

DsairConfigControl.prototype.getSSIDCallback = function (data) {
    this._appSSID = data;
    this._dsairConfigView.setAppSSID(data);
};

DsairConfigControl.prototype.getAppNetworkKeyCallback = function (data) {
    this._appNetworkKey = data;
    this._dsairConfigView.setAppMetworkKey(data);
};

//

DsairConfigControl.prototype.setLocProtocol = function(inLocProtocol) {
    if (inLocProtocol == DsairConst.protocolMM2) {
        this._dsairConfigView.setLocProtocolMM2();
    } else if (inLocProtocol == DsairConst.protocolDCC) {
        this._dsairConfigView.setLocProtocolDCC();
    } else {
        console.info(inLocProtocol);
    }
};

DsairConfigControl.prototype.setAccProtocol = function(inAccProtocol) {
    if (inAccProtocol == DsairConst.protocolMM2) {
        this._dsairConfigView.setAccProtocolMM2();
    } else if (inAccProtocol == DsairConst.protocolDCC) {
        this._dsairConfigView.setAccProtocolDCC();
    } else {
        console.info(inAccProtocol);
    }
};

