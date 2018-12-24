var DsairAccManager = function () {
    this._command = null;
    this._storage = null;
    this._configControl = null;
    this._accChangeCallbackList = []
    this._AccStatus = []; 
    for (let i = 0; i < DsairConst.maxAccessories; i++) {
        this._AccStatus.push(0);
    }
};

DsairAccManager.prototype._accProtocolList = [];
DsairAccManager.prototype._accProtocolList[DsairConst.protocolMM2] = 12287;
DsairAccManager.prototype._accProtocolList[DsairConst.protocolDCC] = 14335;

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

// DsairAccManager.prototype.addAccChangeCallback = function (inCallback) {
//     this._accChangeCallbackList.push(inCallback);
// };

DsairAccManager.prototype.changeAcc = function (inNo) {
    if (this._command.getPowerStatus() == DsairConst.powerOff) {
        return false;
    }

    let aOnOff = this._AccStatus[inNo];

    if (aOnOff == 1) {
        aOnOff = 0;
    } else {
        aOnOff = 1;
    }

    this._AccStatus[inNo] = aOnOff;
    this._command.setAccessory(inNo + this._accProtocol + 1, this._AccStatus[inNo]);
    //this.callAccChangeCallback(inNo, this._AccStatus[inNo]);
    return true;
};

DsairAccManager.prototype.getAccStatus = function (inNo) {
    return this._AccStatus[inNo];
};

DsairAccManager.prototype.callAccChangeCallback = function(inNo, inStatus) {
    for (let cb of this._accChangeCallbackList) {
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
    let aAccProtocol = this._storage.getAccProtocol();
    aAccProtocol = this.setAccProtocol(aAccProtocol);
    this._configControl.setAccProtocol(aAccProtocol);
};

DsairAccManager.prototype.onPowerStateChange = function (inOwnerName, inPowerStatus) {
    if (inPowerStatus == DsairConst.powerOff) {
        for (let i = 0; i < DsairConst.maxAccessories; i++) {
            this._AccStatus[i] = 0;
        }
    }
};
