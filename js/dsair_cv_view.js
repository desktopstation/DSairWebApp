//
var DsairCVView= function () {
    this._controller = null;
    this._CVNo = 0;
    this._CVVal = 0;
    this._loaded = false;
    window.addEventListener('load', this);
};

DsairCVView.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'load':
            this.onLoad();
            break;
        default:
            break;
    }
};

DsairCVView.prototype.onLoad = function () {
    var self = this;
    $("#CVList").change(function () {
        self._controller.ChangeCVDescription();
    });
    this._loaded = true;
    $('#CVList').val(this._CVNo.toString());
    $('#CVValue').val(this._CVVal.toString());
};

DsairCVView.prototype.addControl = function (inController) {
    this._controller = inController;
};

DsairCVView.prototype.getCVNo = function () {
    if (this._loaded) {
        this._CVNo = parseInt($('#CVList').val());
    }
    return this._CVNo;
};

DsairCVView.prototype.getCVValue = function () {
    this._CVVal = parseInt($('#CVValue').val());
    return this._CVVal;
};

DsairCVView.prototype.setCVNo = function (inCVNo) {
    this._CVNo = inCVNo;
    if (this._loaded) {
        $('#CVList').val(this._CVNo.toString());
    }
};

DsairCVView.prototype.appendCVList = function (str) {
    $('#CVList').append(str);
};

DsairCVView.prototype.setCVValue = function (inCVValue) {
    //console.log('inCVValue', inCVValue);
    this._CVVal = inCVValue;
    if (this._loaded) {
        $('#CVValue').val(this._CVVal.toString());
    }
};

DsairCVView.prototype.setReadCVValue = function (inCVValue) {
    if (inCVValue == -1) {
        $('#ReadCVValue').val('---');
    } else {
        $('#ReadCVValue').val(inCVValue.toString());
    }
};

DsairCVView.prototype.setDescription = function (inDescription) {
    //console.log('set ', inDescription);
    $('#CVDescription').text(inDescription);
};

