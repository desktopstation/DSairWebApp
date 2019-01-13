var DsairCVControl = function () {
    this._command = null;
    this._view = null;
    this._msgDialog = null;
    this._cvEditDialog = null;
    this._CVNo = 1;
    this._CVVal = 3;
    window.addEventListener('load', this);
};

DsairCVControl.prototype.cvdataDefault = 'cvdata/default.json';

DsairCVControl.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'load':
            this.onLoad();
            break;
        default:
            break;
    }
};

DsairCVControl.prototype.onLoad = function () {
    this._view.setCVNo(this._CVNo);
    this._view.setCVValue(this._CVVal);
    this.RegisterCVList();
    this.ChangeCVDescription();
};

//

DsairCVControl.prototype.addDsairCommand = function (inCommand) {
    this._command = inCommand;
};

DsairCVControl.prototype.addView = function (inView) {
    this._view = inView;
    this._view.addControl(this);
};

DsairCVControl.prototype.addMsgDialog = function (inDialog) {
    this._msgDialog = inDialog;
};

DsairCVControl.prototype.addEditDialog = function (inDialog) {
    this._cvEditDialog = inDialog;
};

//

DsairCVControl.prototype.onClickCVWrite = function () {
    var aCVNo = this._view.getCVNo();
    var aCVValue = this._view.getCVValue();

    if (this._command.getPowerStatus() == DsairConst.powerOn) {
        this._msgDialog.open('Please <b>power off</b>.', false, null, '')
    } else {
        this._msgDialog.open('Would you write CV No.' + 
            aCVNo.toString() + '=' + aCVValue.toString() + '?',
            true, this, 'cvWriteCallback');
    }
};

DsairCVControl.prototype.onClickCVRead = function () {
    var aCVNo = this._view.getCVNo();

    if (this._command.getPowerStatus() == DsairConst.powerOn) {
        this._msgDialog.open('Please <b>power off</b>.', false, null, '')
    } else {
        this._msgDialog.open('Would you read CV No.' + aCVNo.toString() + '?',
            true, this, 'cvReadCallback');
    }
};

DsairCVControl.prototype.OpenCVValEdit = function () {
    this._cvEditDialog.open(this._CVVal, this, 'cvEditCallback', null);
};

DsairCVControl.prototype.cvWriteCallback = function (arg) {
    if (arg.isOK) {
        //console.log('setCV');
        this._command.setCV(this._CVNo, this._CVVal);
        var self = this;
        setTimeout(function () {
            self._command.writePing();
        }, 200);
    }
};

DsairCVControl.prototype.cvReadCallback = function (arg) {
    if (arg.isOK) {
        //console.log('getCV');
        this._command.getCV(this._CVNo);
        var self = this;
        setTimeout(function () {
            self._command.writePing();
        }, 200);
    }
};

DsairCVControl.prototype.cvEditCallback = function (cbArg) {
    //console.log(cbArg);
    this._CVVal = cbArg.cvval;
    this._view.setCVValue(this._CVNo);
};

DsairCVControl.prototype.onDistStateNotify = function(cbArg) {
    this._view.setReadCVValue(cbArg.cvValue);
};

DsairCVControl.prototype.ChangeCVDescription = function () {
    this._CVNo = this._view.getCVNo();
    //console.log('ChangeCVDescription', this._CVNo);
    var description = '';
    switch (this._CVNo) {
        case 1:
            description = 'Set 1 to 99(127).';
            break;
        case 8:
            description = 'Decoder factory reset. Set 8.';
            break;
        case 29:
            description = '1:Rev,2:128stps,4:DCope,8:Railcom,16:SpdCurve,32:ExAddr';
            break;
        default:
            description = 'Depend on decoder. See instruction.';
            break;
    }
    //console.log('desc ', description);
    this._view.setDescription(description);
};


DsairCVControl.prototype.RegisterCVList = function () {
    this._command.getJson(this.cvdataDefault, this, 'ReadCVListCallback');
};

DsairCVControl.prototype.ReadCVListCallback = function (jsonObj) {
    if (jsonObj != null) {
        var len = jsonObj.cvdata.length;

        for (var i = 0; i < len; i++) {
            this._view.appendCVList('<option value=' + jsonObj.cvdata[i].cvnum + '>' +
            jsonObj.cvdata[i].cvname + '</option>');
        }
    } else {
        for (var i = 0; i < 256; i++) {
            this._view.appendCVList('<option value=' + i.toString() + '>CV' + i.toString() + '     </option>');
        }
    }
};
