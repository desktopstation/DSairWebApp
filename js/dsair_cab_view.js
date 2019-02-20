var DsairCabView = function () {
    this._controller = null;
    this._loaded = false;
    this._onSwitch = DsairConst.powerOff;
    window.addEventListener('DOMContentLoaded', this);
    window.addEventListener('load', this);
};

DsairCabView.prototype._addrLabelList = [
    '#radio_adr1_label',
    '#radio_adr2_label',
    '#radio_adr3_label',
    '#radio_adr4_label'
];

DsairCabView.prototype.handleEvent = function (e) {
	switch (e.type) {
        case 'DOMContentLoaded':
            this.onLoad();
            break;
        case 'load':
            this.onLoad();
			break;
		default:
			break;
	}
};

DsairCabView.prototype.onLoad = function () {
    if (this._loaded) {
        return;
    }
    this._loaded = true;
    $('#funcbox1').buttonset();
    $('#addrselector').buttonset();
    $("button").button();
    $('input[type="checkbox"]').button();
    $('input[type="radio"]').button();
    this._setVisibleItems();
    this.UpdateFunctionButtonsAll();
};

//

DsairCabView.prototype.addController = function (inController) {
	this._controller = inController;
};

//

DsairCabView.prototype.addrToStr = function (inAddr) {
    var addrStr;
    if (inAddr == 0) {
        addrStr = '-';
    } else {
        addrStr = inAddr.toString();
    }
    return addrStr;
};

DsairCabView.prototype.initLocAddress = function(inAddrList) {
    var len = inAddrList.length;
    for (var i = 0; i < len; i++) {
        //console.log('%d:%d', i, inAddrList[i])
        $(this._addrLabelList[i]).text(this.addrToStr(inAddrList[i]));
    }
};

DsairCabView.prototype._setVisibleItems = function () {
    if (this._onSwitch == DsairConst.powerOff) {
        //console.log('off');
        $('#powerOn').show('normal');
        $('#powerOff').hide('normal');
        $('#btnStop').attr('disabled', true);
        $('#btnRev').attr('disabled', true);
        $('#btnFwd').attr('disabled', true);
    } else {
        //console.log('On');
        $('#powerOn').hide('normal');
        $('#powerOff').show('normal');
        $('#btnStop').removeAttr('disabled');
        $('#btnRev').removeAttr('disabled');
        $('#btnFwd').removeAttr('disabled');
    }
};

DsairCabView.prototype.setVisibleItems = function (inOnSwitch) {
    //console.log('state = %s', inOnSwitch == DsairConst.powerOn ? 'On' : 'Off');
    this._onSwitch = inOnSwitch;
    if (!this._loaded) {
        return;
    }
    this._setVisibleItems();
};

DsairCabView.prototype.setLocAddr = function (inModeLocIndex) {
    var aLocAddess = this._controller.getLocAddrByIndex(inModeLocIndex);
    console.log(aLocAddess);

    $(this._addrLabelList[inModeLocIndex]).text(this.addrToStr(aLocAddess));
};

DsairCabView.prototype.getModeLocIndex = function () {
    return parseInt($('[name=radio_adr]:checked').val());
}

DsairCabView.prototype.UpdateFunctionButton = function (id, val) {
    $('#check' + id.toString()).prop('checked',  val).change();
};

DsairCabView.prototype.UpdateFunctionButtonsAll = function () {
    if (!this._loaded) {
        return;
    }
    //ファンクションボタンを全て変更する
    var i;
    for (i = 0; i < 29; i++) {
        this.UpdateFunctionButton(i, (this._controller.getLocFuncStatus(0)  == 1));
    }

    $('#checkDirReverse').prop('checked', this._controller.getLocDir()).change();
};
