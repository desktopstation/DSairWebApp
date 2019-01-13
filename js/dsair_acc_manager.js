var DsairAccManager = function () {
    var i;
    this._command = null;
    this._storage = null;
    this._configControl = null;
    this._accChangeCallbackList = [];
    this._accStatusLoaded = false;
    this._accProtocol = this._accProtocolList[DsairConst.protocolDCC];
    this._AccStatus = []; 
    for (i = 0; i < DsairConst.maxAccessories; i++) {
        this._AccStatus.push(DsairAccManager.accOff);
    }
    this._accDistStatus = [];
    this._accStatusUpdateCount = [];
    for (i = 0; i < this._accDistLen; i++) {
        this._accDistStatus.push(DsairAccManager.accOff);
        this._accStatusUpdateCount.push(0);
    }
};

DsairAccManager.accOn = 1;
DsairAccManager.accOff = 0;

DsairAccManager.prototype._accProtocolList = [];
DsairAccManager.prototype._accProtocolList[DsairConst.protocolMM2] = 12287;
DsairAccManager.prototype._accProtocolList[DsairConst.protocolDCC] = 14335;
DsairAccManager.prototype._accDistInfoLen = 32;
DsairAccManager.prototype._accDistLen = DsairAccManager.prototype._accDistInfoLen * 8;
DsairAccManager.prototype._intervalUpdateLimitValue = 4;

DsairAccManager.prototype._defaultAccProtocol = DsairConst.protocolDCC;

DsairAccManager.prototype.addDsairCommand = function (inCommand) {
    this._command = inCommand;
};

DsairAccManager.prototype.addStorage = function (inStorage) {
    this._storage = inStorage;
    this._storage.addStorageLoadCallback(this);
};

DsairAccManager.prototype.addCfgControl = function (inConfig) {
    this._configControl = inConfig;
};

DsairAccManager.prototype.addAccChangeCallback = function (inCallback) {
    this._accChangeCallbackList.push(inCallback);
};

DsairAccManager.prototype.changeAcc = function (inNo) {
    if (this._command.getPowerStatus() == DsairConst.powerOff) {
        return false;
    }

    var aOnOff = this._AccStatus[inNo];

    if (aOnOff == DsairAccManager.accOn) {
        aOnOff = DsairAccManager.accOff;
    } else {
        aOnOff = DsairAccManager.accOn;
    }

    this._AccStatus[inNo] = aOnOff;
    this._command.setAccessory(inNo + this._accProtocol + 1, this._AccStatus[inNo]);
    this.callAccChangeCallback(inNo, this._AccStatus[inNo]);
    this._accStatusUpdateCount[inNo] = this._intervalUpdateLimitValue;
    return true;
};

DsairAccManager.prototype.getAccStatus = function (inNo) {
    return this._AccStatus[inNo];
};

DsairAccManager.prototype.callAccChangeCallback = function(inNo, inStatus) {
    for (var cb of this._accChangeCallbackList) {
        cb.onAccValueChange(inNo, inStatus);
    }
};

// アクセサリプロトコル設定
DsairAccManager.prototype.setAccProtocol = function(inAccProtocol) {
    if (!(inAccProtocol in this._accProtocolList)) {
        // 認識できない場合はデフォルトに戻す
        inAccProtocol = this._defaultLocProtocol;
    }
    this._accProtocol = this._accProtocolList[inAccProtocol];
    return inAccProtocol;
};

// 保存していた値を復旧する
DsairAccManager.prototype.onDataLoad = function () {
    // プロトコル設定
    var aAccProtocol = this._storage.getAccProtocol();
    aAccProtocol = this.setAccProtocol(aAccProtocol);
    this._configControl.setAccProtocol(aAccProtocol);
};

DsairAccManager.prototype.getStatusCallback = function (inData, inFirmVer) {
    var l = Math.floor(inData.length / 2);
    var accStatus = [];
    var i;
    var j;

    for (i = 0; i < l; i++) {
        var byte;
        if (inFirmVer == '0') {
            var revstr = inData.substr(i * 2 + 1, 1) + inData.substr(i * 2, 1);
            byte = parseInt(revstr, 16);
        } else {
            byte = parseInt(inData.substr(i * 2, 2), 16);
        }
        for (j = 0; j < 8; j++) {
            accStatus[i * 8 + j] = ((byte & (1 << j)) != 0) ? DsairAccManager.accOn : DsairAccManager.accOff;
        }
    }
    if (!this._accStatusLoaded) {
        this._accStatusLoaded = true;
        this._AccStatus = accStatus;
        return;
    }
    l *= 8;
    for (i = 0; i < l; i++) {
        if (this._accStatusUpdateCount[i] > 0) {
            this._accStatusUpdateCount[i].count--;
        }
        if (this._accStatusUpdateCount[i] == 0) {
            if (accStatus[i] != this._AccStatus[i]) {
                this._AccStatus[i] = accStatus[i];
                this.callAccChangeCallback(i, this._AccStatus[i]);
            }
        }
    }
    this._accDistStatus = accStatus;
};
