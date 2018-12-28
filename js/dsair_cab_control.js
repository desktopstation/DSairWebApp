//
// for r2f
//
var DsairCabControl = function () {

    this._device = null;
    this._storage = null;
    this._dsairCommand = null;
    this._speedMeter = [];  // meterは複数登録可能
    this._dsairCabView = null;
    this._dsairCabDialog = null;
    this._configControl = null;
    this._powerArbitor = null;
    this._toast = null;
    this._powerStateChangeCallback = [];
    this._distStateNotifyCallback = [];
    this._intervalTimeout = 0;

    // 機関車関係
    this._locAddr = 3;
    this._locSpeed = [0, 0, 0, 0];
    this._lastLocSpeed = [0, 0, 0, 0];
    this._locDirReverse = [false, false, false, false];
    this._dblLocArray = [this._locAddr, 0, 0, 0];
    this._locProtocol = this._locProtocolList[this._defaultLocProtocol];
    this._locSpeedStep = 2;
    this._locFuncStatus = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    this._locDir = [DsairConst.dirFWD, DsairConst.dirFWD, DsairConst.dirFWD, DsairConst.dirFWD];

    this._lastSpeed = 0;
    this._powerStatus = DsairConst.powerOff;
    this._meterMaxSpeed = this._defaultLocMeterMaxSpeed;

    this._modeLocIndex = 0;
    this._modeDblHeading = false;
    this._readCVNo = 0;     // r2f
    this._readCVVal = 0;    // r2f

    this._LastUpdateTime = 0;
    this._intervalUpdateLimit = 0; // r2f
    this._distStatusVolt = 0; // r2f
    this._distStatusCurrent = 0; // r2f
    this._distStatusPower = 0; // r2f
    this._distStatusFirmver = 0; // r2f
    this._distStatusError = 0; // r2f
    this._distStatusHardver = 0; // r2f
    this._distStatusSeqNo = 0; // r2f
    this._distStatusReplyMsg = 0; // r2f
    this._statusReplyAcc = 0; // r2f
    this._locDistInfo = [];

    window.addEventListener('load', this);
};

//
DsairCabControl.prototype._locProtocolList = [];
DsairCabControl.prototype._locProtocolList[DsairConst.protocolMM2] = 0;
DsairCabControl.prototype._locProtocolList[DsairConst.protocolDCC] = 49152;

DsairCabControl.prototype._defaultLocProtocol = DsairConst.protocol;
DsairCabControl.prototype._defaultLocMeterMaxSpeed = 240;
DsairCabControl.prototype._cmdInterval = 500;
DsairCabControl.prototype._statusInterval = 900;
DsairCabControl.prototype._numAddresses = 4;    // 同時に管理するアドレス数
DsairCabControl.prototype._numFunctions = 29;
DsairCabControl.prototype._maxInternalSpeed = 1024;
DsairCabControl.prototype._intervalUpdateLimitValue = 4;
DsairCabControl.prototype._name = 'DCC controller';

//

DsairCabControl.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'load':
            this.onLoad();
            break;
        default:
            break;
    }
};

DsairCabControl.prototype.onLoad = function () {
    this.startPeriodicProcess();
};

//

DsairCabControl.prototype.addDevice = function (inDevice) {
    this._device = inDevice;
};

DsairCabControl.prototype.addStorege = function (inStorege) {
    this._storage = inStorege;
    this._storage.addStorageLoadCallback(this);
};

DsairCabControl.prototype.addDsairCommand = function (inCommand) {
    this._dsairCommand = inCommand;
    this._dsairCommand.addStatusCallback(this);
};

// 速度表示オブジェクトを追加
DsairCabControl.prototype.addSpeedMeter = function (inSpeedMeter) {
    this._speedMeter.push(inSpeedMeter);
};

// 
DsairCabControl.prototype.addCabView = function (inDsairCabView) {
    this._dsairCabView = inDsairCabView;
    this._dsairCabView.addController(this);
};

DsairCabControl.prototype.addCabDialog = function (inDsairCabDialog) {
    this._dsairCabDialog = inDsairCabDialog;
    //this._dsairCabDialog.addController(this);
};

DsairCabControl.prototype.addCfgControl = function (inCfgControl) {
    this._configControl = inCfgControl;
};

DsairCabControl.prototype.addPowerArbitor = function (inArbitor) {
    this._powerArbitor = inArbitor;
    this._powerArbitor.addPowerStateChangeCallback(this);
};

DsairCabControl.prototype.addDistStateNotifyCallback = function (inCallback) {
    this._distStateNotifyCallback.push(inCallback);
};

DsairCabControl.prototype.addToast = function (inToast) {
    this._toast = inToast;
};

//

DsairCabControl.prototype.onClickFunction = function (inFuncNo) {
    if (this._powerStatus == DsairConst.powerOff) {
        this._toast.show('Click "PowerOn" button.');
        this._dsairCabView.UpdateFunctionButtonsAll();
        return;
    }
    let aOnOff = this._locFuncStatus[this._modeLocIndex][inFuncNo];

    if (aOnOff == 1) {
        aOnOff = 0;
    } else {
        aOnOff = 1;
    }

    this._locFuncStatus[this._modeLocIndex][inFuncNo] = aOnOff;
    var selectVal = this._modeLocIndex;

    if (selectVal >= this._numAddresses) {
        selectVal = 0;
    }

    let aLocAddr = this._locProtocol + this._dblLocArray[selectVal];
    // データ配信によるアップデートを一時抑制
    this._intervalUpdateLimit = this._intervalUpdateLimitValue;
    this._dsairCommand.setFunction([aLocAddr], inFuncNo, aOnOff);
};

DsairCabControl.prototype.onClickStop = function () {
    let aTempDblHead = this._modeDblHeading;
    this._modeDblHeading = true;

    // 強制停止
    console.log('speed -> 0');
    this._locSpeed[0] = 0;
    this._locSpeed[1] = 0;
    this._locSpeed[2] = 0;
    this._locSpeed[3] = 0;

    this.onChangeSpeed(0, true);

    // 重連モードを戻す
    this._modeDblHeading = aTempDblHead;
    // データ配信によるアップデートを一時抑制
    this._intervalUpdateLimit = this._intervalUpdateLimitValue;
    this._toast.show('Stop');
};

DsairCabControl.prototype.onClickFwd = function (inFwd) {

    let aLocAddr = [];
    let aLocAddr_rev = [];
    let aFWD = inFwd;
    let aFWD_rev = this.reverseDir(inFwd);

    if (!this._modeDblHeading) {
        //1
        if (this._dblLocArray[this._modeLocIndex] != 0) {
            aLocAddr.push(this._locProtocol + this._dblLocArray[this._modeLocIndex]);

            if (this._locDirReverse[this._modeLocIndex]) {
                aFWD = aFWD_rev;
            }
        }
    } else {
        //重連
        for (var i = 0; i < this._numAddresses; i++) {
            if (this._dblLocArray[i] != 0) {
                var aTempLocAddr = this._locProtocol + this._dblLocArray[i];

                if (this._locDirReverse[i]) {
                    aLocAddr_rev = aLocAddr_rev + aTempLocAddr;

                    aLocAddr_rev.push(aTempLocAddr);
                } else {
                    aLocAddr.push(aTempLocAddr);
                }
            }
        }
    }
    if ((aLocAddr.length == 0) && (aLocAddr_rev.length == 0)) {
        return;
    }
    //データ配信によるアップデートを一時抑制
    this._intervalUpdateLimit = this._intervalUpdateLimitValue;  // r2f

    /*ゼロ速にしてから送信*/
    let aDir;
    let aDirRev;
    if (aFWD == 1) {
        aDir = DsairConst.dirFWD;
        aDirRev = DsairConst.dirREV;
    } else {
        aDir = DsairConst.dirREV;
        aDirRev = DsairConst.dirFWD;
    }
    if (aLocAddr.length > 0) {
        this._dsairCommand.setDirection(aDir, aLocAddr);
    }
    var self = this;
    if (aLocAddr_rev.length > 0) {
        setTimeout(function () {
            self._dsairCommand.setDirection(aDirRev, aLocAddr_rev);
        }, this._cmdInterval);
    }

    // 速度強制停止＆表示切り替え
    if ((inFwd == DsairConst.dirREV) && (this._locDir[this._modeLocIndex] == DsairConst.dirFWD)) {
        this._locDir[this._modeLocIndex] = DsairConst.dirREV;
        this._locSpeed[this._modeLocIndex] = 0;
        this.onDrawMeter(this._locSpeed[this._modeLocIndex], this._locDir[this._modeLocIndex]);
    } else if ((inFwd == DsairConst.dirFWD) && (this._locDir[this._modeLocIndex] == DsairConst.dirREV)) {
        this._locDir[this._modeLocIndex] = DsairConst.dirFWD;
        this._locSpeed[this._modeLocIndex] = 0;
        this.onDrawMeter(this._locSpeed[this._modeLocIndex], this._locDir[this._modeLocIndex]);
    }
};

DsairCabControl.prototype.onChangeSpeed = function (inSpeed, inForceUpdate) {

    if ((this._powerStatus == DsairConst.powerOff) && (inSpeed > 0)) {
        this._toast.show('Click "PowerOn" button.');
        return;
    }
    if (inSpeed < 0) {
        console.info('Invalid speed %d', inSpeed);
        inSpeed = 0;
    } else if (inSpeed >= this._maxInternalSpeed) {
        console.info('Invalid speed %d', inSpeed);
        inSpeed = this._maxInternalSpeed - 1;
    }
    //console.log('change speed %d', inSpeed);
    let aLocAddr = [];

    if (!this._modeDblHeading) {
        // 単機
        if (this._dblLocArray[this._modeLocIndex] != 0) {
            aLocAddr.push(this._locProtocol + this._dblLocArray[this._modeLocIndex]);
        }
    } else {
        // 重連
        for (let addr of this._dblLocArray) {
            if (addr != 0) {
                aLocAddr.push(this._locProtocol + addr);
            }
        }
    }

    if (aLocAddr.length > 0) {
        this._locSpeed[this._modeLocIndex] = inSpeed;
        if (!inForceUpdate) {
            // 送信が必要かを判断
            var date = new Date();

            if (Math.abs(date.getTime() - this._LastUpdateTime) < this._cmdInterval) {
                // 経過時間が短い→表示のみ更新
                this.onDrawMeter(inSpeed, this._locDir[this._modeLocIndex]);
                return;
            }
            // 前回より500ms以上経過時
            this._LastUpdateTime = date.getTime();
            if (this._lastLocSpeed[this._modeLocIndex] == inSpeed) {
                // 以前送信したスピードから変化なし
                return;
            }
        }

        // データ配信によるアップデートを一時抑制
        this._intervalUpdateLimit = this._intervalUpdateLimitValue;  // r2f
        this._dsairCommand.setSpeed(aLocAddr, inSpeed, this._locSpeedStep);

        this._lastLocSpeed[this._modeLocIndex] = inSpeed;
        // 表示切り替え
        this.onDrawMeter(inSpeed, this._locDir[this._modeLocIndex]);

        // 振動機能
        if ((inSpeed == 0) && (this._lastSpeed > 0)) {
            if (this._device != null) {
                this._device.Vibrate();
            }
        }
        this._lastSpeed = inSpeed;
    } else {
        // 表示切り替え
        this._toast.show('No valid loco addresses');
        inSpeed = 0;
        this.onDrawMeter(inSpeed, this._locDir[this._modeLocIndex]);
    }
};

DsairCabControl.prototype.onClickPon = function (inPon) {
    this._intervalTimeout = 8;
    //console.log('Power');
    if (inPon == 0) {
        console.log('Off');
        //this.onClickStop();
        this._powerArbitor.powerOff(this._name);
    } else {
        console.log('On');
        if (!this._powerArbitor.tryPowerOn(this._name)) {
            this._toast.show('Please turn off analog mode.');
        }
    }
    if (this._device != null) {
        this._device.Vibrate();
    }
};

DsairCabControl.prototype.onSetDoubleHeading = function () {
    if (!this._modeDblHeading) {
        this._modeDblHeading = true;
    } else {
        this._modeDblHeading = false;
    }
};

DsairCabControl.prototype.onSetDirReverse = function () {

    if (!this._locDirReverse[this._modeLocIndex]) {
        this._locDirReverse[this._modeLocIndex] = true;
    } else {
        this._locDirReverse[this._modeLocIndex] = false;
    }
};

DsairCabControl.prototype.reverseDir = function (inDir) {
    if (inDir == DsairConst.dirFWD) {
        return DsairConst.dirREV;
    } else if (inDir == DsairConst.dirREV) {
        return DsairConst.dirFWD;
    }
    console.info('Invalid direction "%s"', inDir);
    return DsairConst.dirFWD;
};

DsairCabControl.prototype.onClickAddLoc = function () {
    // 重連編集画面
    // Set DblAddr to LocEditForm
    this._dsairCabDialog.open(this._dblLocArray[this._modeLocIndex], this, 'setLocAddr', null);
};

DsairCabControl.prototype.startPeriodicProcess = function () {
    var self = this;
    setInterval(function () {
        // 定周期状態確認
        self._dsairCommand.getStatus();
    }, this._statusInterval);
};

DsairCabControl.prototype.getStatusCallback = function (inData) {
    let cbArg = {
        cvNo: 0,
        cvValue: 0,
        statusVolt: 0,
        statusCurrent: 0,
        statusPower: '',
        statusFirmVer: '',
        statusError: 0,
        statusHardVer: '',
        statusSeqNo: 0,
        statusReplyMsg: '',
        statusReplyAcc: ''
    };
    //console.log('"%s"', inData);
    let aReplyStrArray = inData.split(';');
    //DSairの共有メモリ・応答フレームデータ
    if (aReplyStrArray.length <= 1) {
        console.info('Invalid status "%s"', inData);
        return;
    }

    let aPrmStrArray = aReplyStrArray[0].split(',');

    if (aPrmStrArray.length == 0) {
        console.info('Invalid status[0]');
        return;
    }
    
    if (this._intervalTimeout > 0) {
        this._intervalTimeout--;
    } else {
        let aPower = aPrmStrArray[0];

        if (aPower != '') {
            //console.log('aPower = %s', aPower);
            let aPower_Num = DsairConst.powerOff;

            if (aPower == 'Y') {
                aPower_Num = DsairConst.powerOn;
            }

            if (aPower_Num != this._powerStatus) {
                if (aPower_Num == DsairConst.powerOff) {
                    this._powerArbitor.powerOff(this._name);
                }
                else
                {
                    console.log('(Remoted)On');
                    if (!this._powerArbitor.tryPowerOn(this._name)) {
                        this._toast.show('Please turn off analog mode.');
                    }                
                }
            }
        }
    }
    // N,2,0,0,043,06,0
    // 画面に表示 -> 変数に保存
    this._distStatusVolt = parseInt(aPrmStrArray[4]);
    this._distStatusCurrent = parseInt(aPrmStrArray[5]);
    this._distStatusPower = aPrmStrArray[0];
    this._statusFirmVer = aPrmStrArray[2];
    this._distStatusError = parseInt(aPrmStrArray[1]);
    this._statusHardVer = parseInt(aPrmStrArray[6]);
    this._distStatusSeqNo = aPrmStrArray[7];

    this._distStatusReplyMsg = aReplyStrArray[1];
    this._statusReplyAcc = aReplyStrArray[2];

    cbArg.statusVolt = this._distStatusVolt;
    cbArg.statusCurrent = this._distStatusCurrent;
    cbArg.statusPower = this._distStatusPower;
    cbArg.statusFirmVer = this._statusFirmVer;
    cbArg.statusError = this._distStatusError;
    cbArg.statusHardVer = this._statusHardVer;
    cbArg.statusSeqNo = this._distStatusSeqNo;
    cbArg.statusReplyMsg = this._distStatusReplyMsg;
    cbArg.statusReplyAcc = this._statusReplyAcc;
    //読み出したCV値

    let aCvStrArray = aReplyStrArray[1].split(',');

    if ((parseInt(aCvStrArray[1]) != 0) && (aCvStrArray.length > 2)) {
        this._readCVNo = parseInt(aCvStrArray[1]);
        this._readCVVal = parseInt(aCvStrArray[2]);
        cbArg.cvNo = this._readCVNo;
        cbArg.cvValue = this._readCVVal;
    } else {
        cbArg.cvNo = -1;
        cbArg.cvValue = -1;
    }
    
    // if (this._powerStatus == DsairConst.powerOff) {
    //     return;
    // }
    //機関車の配信データ取得

    let aLocDistArrayRaw = aReplyStrArray[3].split('/');

    for (let i = 0; i < aLocDistArrayRaw.length; i++) {
        let aLocDistArrayList = aLocDistArrayRaw[i].split(',');
        let aLocAddr = parseInt('0x' + aLocDistArrayList[0]);
        let aLocSpd = parseInt('0x' + aLocDistArrayList[1]);
        let aLocDir = (aLocDistArrayList[2] == '0') ? DsairConst.dirFWD : DsairConst.dirREV;
        let aLocFunc = parseInt('0x' + aLocDistArrayList[3]);

        if (aLocAddr == 0) {
            break;
        }

        this._locDistInfo[aLocAddr] = {
            locSpd: aLocSpd,
            locDir: aLocDir,
            locFunc: aLocFunc
        };

        for (let j = 0; j < 4; j++) {
            if (aLocAddr == this._locProtocol + this._dblLocArray[j]) {
                if (j == this._modeLocIndex) {
                    // 操作中で操作した直後は、4回空回しする
                    if (this._intervalUpdateLimit > 0) {
                        this._intervalUpdateLimit--;
                        break;
                    }
                }

                var aMeterChanged = false;
                var aFuncChanged = false;

                if (this._locDir[j] != aLocDir) {
                    aMeterChanged = true;
                    this._locDir[j] = aLocDir;
                }

                if ((this._locSpeed[j] / 4) != aLocSpd) {
                    aMeterChanged = true;
                    if (this._powerStatus == DsairConst.powerOff) {
                        this._locSpeed[j] = 0;
                    } else {
                        this._locSpeed[j] = aLocSpd * 4;
                    }
                }

                for (let k = 0; k < this._numFunctions; k++) {
                    if (this._powerStatus == DsairConst.powerOff) {
                        if (this._locFuncStatus[j][k] != 0) {
                            this._locFuncStatus[j][k] = 0;
                            aFuncChanged = true;
                        }
                    } else {
                        if (this._locFuncStatus[j][k] != (aLocFunc >> k) & 1) {
                            this._locFuncStatus[j][k] = (aLocFunc >> k) & 1;
                            aFuncChanged = true;
                        }
                    }
                }

                // 表示中の場合は更新
                if (j == this._modeLocIndex) {
                    if (aFuncChanged) {
                        this._dsairCabView.UpdateFunctionButtonsAll();
                    }

                    if (aMeterChanged) {
                        this.onDrawMeter(this._locSpeed[this._modeLocIndex], this._locDir[this._modeLocIndex]);
                    }
                }
                break;
            }
        }
    }
    this.callDistStateNotifyCallback(cbArg);
};

DsairCabControl.prototype.onSelectLoc = function () {
    let oldIndex = this._modeLocIndex;
    // checkされているインデックスを取得
    this._modeLocIndex = this._dsairCabView.getModeLocIndex();
    if (oldIndex != this._modeLocIndex) {
        // Function表示を更新
        this._dsairCabView.UpdateFunctionButtonsAll();

        // メーター表示を更新
        this.onChangeSpeed(this._locSpeed[this._modeLocIndex], true);
    }
}

//

DsairCabControl.prototype.onDrawMeter = function (inSpeed, inDirection) {
    //console.info('speed = %d', inSpeed);
    for (let meter of this._speedMeter) {
        meter.onDrawMeter(inSpeed, inDirection);
    }
};

// 保存していた値を復旧する
DsairCabControl.prototype.onDataLoad = function () {
    let aDblLocArray = this._storage.getLocAddr();
    if (aDblLocArray != null && aDblLocArray.length != 0) {
        if (aDblLocArray.length > this._numAddresses) {
            aDblLocArray = aDblLocArray.slice(0, this._numAddresses);
        } else if (aDblLocArray.length < this._numAddresses) {
            for (let i = aDblLocArray.length; i < this._numAddresses; i++) {
                aDblLocArray.push(0);
            }
        }
        this._dblLocArray = aDblLocArray;
    }

    this._dsairCabView.initLocAddress(this._dblLocArray);

    // プロトコル設定
    let aLocProtocol = this._storage.getLocProtocol();
    //console.log(aLocProtocol);
    aLocProtocol = this.setLocProtocol(aLocProtocol);
    this._configControl.setLocProtocol(aLocProtocol);

    // 最高速度を設定
    // set maximum speed
    let aLocMaxSpeed = this._storage.getMaxSpeed();
    this.setMeterMaxSpeed(aLocMaxSpeed);

    // Function表示を初期化
    this._dsairCabView.UpdateFunctionButtonsAll();
};

// 
DsairCabControl.prototype.setMeterMaxSpeed = function (inMeterMaxSpeed) {
    if (inMeterMaxSpeed == 0) {
        inMeterMaxSpeed = this._defaultLocMeterMaxSpeed;
    }
    this._meterMaxSpeed = inMeterMaxSpeed;
    for (let meter of this._speedMeter) {
        meter.setMeterMaxValue(this._meterMaxSpeed);
    }
    this._configControl.setMeterMaxSpeed(this._meterMaxSpeed);
};

DsairCabControl.prototype.setLocProtocol = function (inLocProtocol) {
    if (!(inLocProtocol in this._locProtocolList)) {
        // 認識できない場合はデフォルトに戻す
        inLocProtocol = this._defaultLocProtocol;
    }
    this._locProtocol = this._locProtocolList[inLocProtocol];
    return inLocProtocol;
};

// DsairCabViewから呼ばれる

DsairCabControl.prototype.getLocAddrByIndex = function (inIndex) {
    return this._dblLocArray[inIndex];
};

DsairCabControl.prototype.setLocAddr = function (inVal) {
    let aLocAddr = inVal.addr;
    if (aLocAddr != 0) {
        //console.log(aLocAddr);
        let found = false;
        for (let addr of this._dblLocArray) {
            if (addr == aLocAddr) {
                found = true;
                break;
            }
        }
        if (found) {
            // 選択したアドレスは登録済み
            this._distStatusVolt.show('Loco address [' + aLocAddr.toString() + '] is already registered.');
            return;
        }
    }
    this._dblLocArray[this._modeLocIndex] = aLocAddr;
    let distAddr = this._locProtocol + aLocAddr;
    let aLocFunc = 0;
    if (aLocAddr != 0 && distAddr in this._locDistInfo) {
        // 以前に配信された値を設定
        this._locSpeed[this._modeLocIndex] = this._locDistInfo[distAddr].locSpd;
        this._locDir[this._modeLocIndex] = this._locDistInfo[distAddr].locDir;
        aLocFunc = this._locDistInfo[distAddr].locFunc;
        console.log(this._locDistInfo[distAddr]);
    } else {
        this._locSpeed[this._modeLocIndex] = 0;
        this._locDir[this._modeLocIndex] = DsairConst.dirFWD;
    }
    for (let k = 0; k < this._numFunctions; k++) {
        this._locFuncStatus[this._modeLocIndex][k] = (aLocFunc >> k) & 1;
    }
    // 表示に反映
    this._dsairCabView.setLocAddr(this._modeLocIndex);
    this._dsairCabView.UpdateFunctionButtonsAll();
    this.onDrawMeter(this._locSpeed[this._modeLocIndex], this._locDir[this._modeLocIndex]);
    // 設定を保存
    this._storage.SaveLocAddr(this._dblLocArray);
};

DsairCabControl.prototype.getLocDir = function () {
    return this._locDirReverse[this._modeLocIndex];
};

DsairCabControl.prototype.getLocFuncStatus = function (inFuncNo) {
    return this._locFuncStatus[this._modeLocIndex][inFuncNo];
};

DsairCabControl.prototype.getPowerStatus = function () {
    return this._powerStatus;
};

DsairCabControl.prototype.callDistStateNotifyCallback = function (inArg) {
    for (let cb of this._distStateNotifyCallback) {
        cb.onDistStateNotify(inArg);
    }
};

//

DsairCabControl.prototype.onPowerStateChange = function (inName, inPower) {
    //console.log(inName);
    if (inName == this._name) {
        this._powerStatus = inPower;
        this._dsairCommand.setPower(this._powerStatus);
    } else {
        this._powerStatus = DsairConst.powerOff;
    }
    if (this._powerStatus == DsairConst.powerOff) {
        //this.onClickStop(); 
        this._powerStatus = DsairConst.powerOff;       
        //this.initFuncStatus();
        this._dsairCabView.UpdateFunctionButtonsAll();
        //this._locDistInfo = [];
    }
    //console.log('status = %d', this._powerStatus);
    this._dsairCabView.setVisibleItems(this._powerStatus);
};

DsairCabControl.prototype.initFuncStatus = function () {
    for (let i = 0; i < this._numAddresses; i++) {
        for (let j = 0; j < this._numFunctions; j++) {
            if (this._locFuncStatus[i][j] != 0) {
                this._locFuncStatus[i][j] = 0;
            }
        }
    }
};

DsairCabControl.prototype.onActivate = function () {

};
