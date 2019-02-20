//
//
var DsairCommand = function() {
    this._flashairUtil = null;
	this._SHRAM_LocRawData = '';
	this._SHRAM_Power = DsairConst.powerOff;

	this._getStatusCbList = [];
	this._getMasterCodeCbList = [];
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

DsairCommand.prototype.getStatus = function (cbObj, method) {
    var self = this;
    this._flashairUtil.readShmem(128, 264, function (data) {
        self._SHRAM_Power = (data.substr(0, 1) == 'Y') ? DsairConst.powerOn : DsairConst.powerOff;
        cbObj[method](data);
    }, null);
};

DsairCommand.prototype.getPowerStatus = function() {
	return this._SHRAM_Power;
};

DsairCommand.prototype.getMasterCode = function (cbObj, method) {
    this._flashairUtil.requestSimpleCommand(106, null, function (data) {
        cbObj[method](data);
	}, null);
};

DsairCommand.prototype.getSSID = function (cbObj, method) {
    this._flashairUtil.requestSimpleCommand(104, null, function (data) {
        cbObj[method](data);
	}, null);
};

DsairCommand.prototype.getAppNetworoKey = function (cbObj, method) {
    this._flashairUtil.requestSimpleCommand(105, null, function (data) {
        cbObj[method](data);
	}, null);
};

DsairCommand.prototype.getFirmwareVersion = function (cbObj, method) {
    this._flashairUtil.requestSimpleCommand(108, null, function (data) {
        cbObj[method](data);
	}, null);
};

DsairCommand.prototype.getWLANMode = function (cbObj, method) {
    this._flashairUtil.requestSimpleCommand(110, null, function (data) {
        cbObj[method](data);
	}, null);
};
DsairCommand.prototype.setParams = function (mastercode, appssid, appnetworkkey) {
    this._flashairUtil.setParams(mastercode, appssid, appnetworkkey);
};

//
DsairCommand.prototype.setDirection = function (inDir, inLocAddr) {
    var aDir;
    if (inDir == DsairConst.dirFWD) {
        aDir = '1';
    } else {
        aDir = '2';
    }
    //console.log(inLocAddr);
    var aLocAddr = inLocAddr.join('/');
    var arg = 'DI(' + aLocAddr + ',' + aDir + ')';
    this._flashairUtil.sendCommand(arg);
};

DsairCommand.prototype.setSpeed = function (inLocAddr, inSpeed, inLocSpeedStep) {
    //console.log(inLocAddr);
	var aLocAddr = inLocAddr.join('/');
    var arg = 'SP(' + aLocAddr + ',' + inSpeed + ',' + inLocSpeedStep + ')';
    this._flashairUtil.sendCommand(arg);
};

DsairCommand.prototype.setPower = function (inPon) {
    var pon;
    if (inPon == DsairConst.powerOn) {
        pon = '1';
    } else {
        pon = '0';
    }
    var arg = 'PW(' + pon + ')';
    this._flashairUtil.sendCommand(arg);
};

DsairCommand.prototype.setFunction = function (inLocAddr, inFuncNo, inOnOff) {
    var aLocAddr = inLocAddr.join('/');
    var arg = 'FN(' + aLocAddr + ',' + inFuncNo + ',' + inOnOff + ')';
    this._flashairUtil.sendCommand(arg);
};

DsairCommand.prototype.setAccessory = function (inAccAddr, inOnOff) {
    var arg = 'TO(' + inAccAddr + ',' + inOnOff + '9 {})';
    this._flashairUtil.sendCommand(arg);
};

DsairCommand.prototype.writePing = function () {
    var arg = 'PG()';
    this._flashairUtil.sendCommand(arg);
};

DsairCommand.prototype.setCV = function (inCVNo, inCVValue) {
    var arg = 'SV(0,' + inCVNo + ',' + inCVValue + ')';
    this._flashairUtil.sendCommand(arg);
};

DsairCommand.prototype.getCV = function (inCVNo) {
    var arg = 'GV(0,' + inCVNo  + ')';
    this._flashairUtil.sendCommand(arg);
};

DsairCommand.prototype.setAnalogSpeed = function (inSpeed, inDir) {
    var arg = 'DC(' + inSpeed +',' + inDir + ')';
    this._flashairUtil.sendCommand(arg);
};

DsairCommand.prototype.getFileList = function (inDirName, callbackObj, callbackMethod, optarg) {
    var arg = 'DIR=' + inDirName;
    this._flashairUtil.requestSimpleCommand(100, arg,
        function (data) {
            callbackObj[callbackMethod](data, optarg);
        }, null);
};

DsairCommand.prototype.getJson = function (filename, callbackObj, callbackMethod) {
    var cbArg = {
        cbObject: callbackObj,
        method: callbackMethod,
        filename: filename
    };
    this._flashairUtil.getFile(filename, this, 'getJsonCallback', cbArg);
};

DsairCommand.prototype.getJsonCallback = function (data, optarg) {
    var parsedObj = null;
    try {
        parsedObj = JSON.parse(data);
    } catch (e) {
        console.info(e);
        console.info('request = "%s"', optarg.filename);
        console.info(data);
    }
    optarg.cbObject[optarg.method](parsedObj);
};

DsairCommand.prototype.download = function (filename, content) {
    this._downloadLink.download = filename;
    this._downloadLink.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
    this._downloadLink.dataset.downloadurl = ['text/plain',
        this._downloadLink.download, this._downloadLink.href].join(':');
    this._downloadLink.click();
};

DsairCommand.prototype.upload = function (callbackObj, callbackMethod, acceptFileType) {
    var self = this;
    var reader = new FileReader();
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
    var form = new FormData();
    var blob = new Blob([content], { type: 'text/plain'});
    form.append('file', blob, filename);
};

