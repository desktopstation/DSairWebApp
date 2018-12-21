//
//
let DsairCommand = function() {
    this._flashairUtil = null;
	this._SHRAM_LocRawData = '';
	this._SHRAM_Power = DsairConst.powerOff;

	this._getStatusCbList = [];
	this._getMasterCodeCbList = [];
	this._getSSIDCbList = [];
    this._getAppNetworkKeyCbList = [];
    this._input = null;
    this._downloadLink = null;
    this._uploadFilename = '';
    window.addEventListener('load', this);
};

DsairCommand.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'load':
            this.onLoad();
            break;
        default:
            break;
    }
};


DsairCommand.prototype.onLoad = function () {
    this._input = document.createElement('input');
    this._input.type = 'file';
    this._downloadLink = document.createElement('a');
};


DsairCommand.prototype.addUtil = function (inUtil) {
	this._flashairUtil = inUtil;
};

DsairCommand.prototype.addStatusCallback = function (inCbObj) {
	this._getStatusCbList.push(inCbObj);
};

DsairCommand.prototype.addMasterCodeCallback = function (inCbObj) {
	this._getMasterCodeCbList.push(inCbObj);
};

DsairCommand.prototype.addSSIDCallback = function (inCbObj) {
	this._getSSIDCbList.push(inCbObj);
};
DsairCommand.prototype.addNetworkKeyCallback = function (inCbObj) {
	this._getAppNetworkKeyCbList.push(inCbObj);
};

//

DsairCommand.prototype.getStatus = function () {
	let self = this;
	this._flashairUtil.readShmem(128, 264, function (data) {
        self._SHRAM_Power = (data.substr(0,1) == 'Y') ? DsairConst.powerOn : DsairConst.powerOff;
        for (let cbObj of self._getStatusCbList) {
            if ('getStatusCallback' in cbObj) {
                cbObj.getStatusCallback(data);
            }
        }
	}, null);
};

DsairCommand.prototype.getPowerStatus = function() {
	return this._SHRAM_Power;
};

DsairCommand.prototype.getMasterCode = function () {
    let self = this;
    this._flashairUtil.requestSimpleCommand(106, null, function (data) {
        for (let cbObj of self._getMasterCodeCbList) {
            if ('getMasterCodeCallback' in cbObj) {
                cbObj.getMasterCodeCallback(data);
            }
        }
	}, null);
};

DsairCommand.prototype.getSSID = function () {
    let self = this;
    this._flashairUtil.requestSimpleCommand(104, null, function (data) {
        for (let cbObj of self._getSSIDCbList) {
            if ('getSSIDCallback' in cbObj) {
                cbObj.getSSIDCallback(data);
            }
        }
	}, null);
};

DsairCommand.prototype.getAppNetworoKey = function () {

    let self = this;
    this._flashairUtil.requestSimpleCommand(105, null, function (data) {
        for (let cbObj of self._getAppNetworkKeyCbList) {
            if ('getAppNetworkKeyCallback' in cbObj) {
                cbObj.getAppNetworkKeyCallback(data);
            }
        }
	}, null);
};

DsairCommand.prototype.setParams = function (mastercode, appssid, appnetworkkey) {
    this._flashairUtil.setParams(mastercode, appssid, appnetworkkey);
};

//
DsairCommand.prototype.setDirection = function (inDir, inLocAddr) {
    let aDir;
    if (inDir == DsairConst.dirFWD) {
        aDir = 'FWD';
    } else {
        aDir = 'REV';
    }
    //console.log(inLocAddr);
    let aLocAddr = inLocAddr.join('/');
    let arg = 'DI(' + aLocAddr + ',' + aDir + ')';
    this._flashairUtil.sendCommand(arg);
};

DsairCommand.prototype.setSpeed = function (inLocAddr, inSpeed, inLocSpeedStep) {
    //console.log(inLocAddr);
	let aLocAddr = inLocAddr.join('/');
    let arg = 'SP(' + aLocAddr + ',' + inSpeed + ',' + inLocSpeedStep + ')';
    this._flashairUtil.sendCommand(arg);
};

DsairCommand.prototype.setPower = function (inPon) {
    let pon;
    if (inPon == DsairConst.powerOn) {
        pon = '1';
    } else {
        pon = '0';
    }
    let arg = 'PW(' + pon + ')';
    this._flashairUtil.sendCommand(arg);
};

DsairCommand.prototype.setFunction = function (inLocAddr, inFuncNo, inOnOff) {
    let aLocAddr = inLocAddr.join('/');
    let arg = 'FN(' + aLocAddr + ',' + inFuncNo + ',' + inOnOff + ')';
    this._flashairUtil.sendCommand(arg);
};

DsairCommand.prototype.setAccessory = function (inAccAddr, inOnOff) {
    let arg = 'TO(' + inAccAddr + ',' + inOnOff + ')';
    this._flashairUtil.sendCommand(arg);
};

DsairCommand.prototype.writePing = function () {
    let arg = 'PG()';
    this._flashairUtil.sendCommand(arg);
};

DsairCommand.prototype.setCV = function (inCVNo, inCVValue) {
    let arg = 'SV(0,' + inCVNo + ',' + inCVValue + ')';
    this._flashairUtil.sendCommand(arg);
};

DsairCommand.prototype.getCV = function (inCVNo) {
    let arg = 'GV(0,' + inCVNo  + ')';
    this._flashairUtil.sendCommand(arg);
};

DsairCommand.prototype.setAnalogSpeed = function (inSpeed, inDir) {
    let arg = 'DC(' + inSpeed +',' + inDir + ')';
    this._flashairUtil.sendCommand(arg);
};

DsairCommand.prototype.getFileList = function (inDirName, callbackObj, callbackMethod) {
    let arg = 'DIR=' + inDirName;
    this._flashairUtil.requestSimpleCommand(100, arg,
        function (data) {
            callbackObj[callbackMethod](data);
        }, null);
};

DsairCommand.prototype.getJson = function (filename, callbackObj, callbackMethod) {
    this._flashairUtil.getJson(filename, callbackObj, callbackMethod);
};

DsairCommand.prototype.download = function (filename, content) {
    this._downloadLink.download = filename;
    this._downloadLink.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
    this._downloadLink.dataset.downloadurl = ['text/plain',
        this._downloadLink.download, this._downloadLink.href].join(':');
    this._downloadLink.click();
};

DsairCommand.prototype.upload = function (callbackObj, callbackMethod, acceptFileType) {
    let self = this;
    let reader = new FileReader();
    reader.onload = function () {
        // 読み込み完了
        // console.log('complete');
        callbackObj[callbackMethod](reader.result, self._uploadFilename);
    };
    //console.log('upload');
    this._input.accept = acceptFileType;
    this._input.onchange = function (event) {
        //console.log('onchange');
        self._uploadFilename = event.target.files[0];
        reader.readAsText(self._uploadFilename);
    };
    this._input.click();
};

DsairCommand.prototype.saveFileToFlashair = function (filename, content) {
    let form = new FormData();
    let blob = new Blob([content], { type: 'text/plain'});
    form.append('file', blob, filename);
};

