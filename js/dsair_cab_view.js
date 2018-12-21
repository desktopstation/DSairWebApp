var DsairCabView = function () {
    this._controller = null;
    this._loaded = false;
    this._onSwitch = DsairConst.powerOff;
    this._needUpdateVisibleItems = false;
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
        case 'load':
            this.onLoad();
			break;
		default:
			break;
	}
};

DsairCabView.prototype.onLoad = function () {
    $('#funcbox1').buttonset();
    $('#addrselector').buttonset();
    $("button").button();
    $('input[type="checkbox"]').button();
    $('input[type="radio"]').button();
    this._loaded = true;
    if (this._needUpdateVisibleItems) {
        this._setVisibleItems();
    }
};

//

DsairCabView.prototype.addController = function (inController) {
	this._controller = inController;
};

//

DsairCabView.prototype.addrToStr = function (inAddr) {
    let addrStr;
    if (inAddr == 0) {
        addrStr = '-';
    } else {
        addrStr = inAddr.toString();
    }
    return addrStr;
};

DsairCabView.prototype.initLocAddress = function(inAddrList) {
    let len = inAddrList.length;
    for (let i = 0; i < len; i++) {
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
    this._onSwitch = inOnSwitch;
    if (this._loaded) {
        this._setVisibleItems();
    } else {
        // onLoad時に描画
        this._needUpdateVisibleItems = true;
    }
};

DsairCabView.prototype.setLocAddr = function (inModeLocIndex) {
    let aLocAddess = this._controller.getLocAddrByIndex(inModeLocIndex);
    console.log(aLocAddess);

    $(this._addrLabelList[inModeLocIndex]).text(this.addrToStr(aLocAddess));
};

DsairCabView.prototype.getModeLocIndex = function () {
    return parseInt($("[name=radio_adr]:checked").val());
}

DsairCabView.prototype.UpdateFunctionButtonsAll = function () {
    //ファンクションボタンを全て変更する

    $('#check0').prop('checked',  (this._controller.getLocFuncStatus(0)  == 1)).change();
    $('#check1').prop('checked',  (this._controller.getLocFuncStatus(1)  == 1)).change();
    $('#check2').prop('checked',  (this._controller.getLocFuncStatus(2)  == 1)).change();
    $('#check3').prop('checked',  (this._controller.getLocFuncStatus(3)  == 1)).change();
    $('#check4').prop('checked',  (this._controller.getLocFuncStatus(4)  == 1)).change();
    $('#check5').prop('checked',  (this._controller.getLocFuncStatus(5)  == 1)).change();
    $('#check6').prop('checked',  (this._controller.getLocFuncStatus(6)  == 1)).change();
    $('#check7').prop('checked',  (this._controller.getLocFuncStatus(7)  == 1)).change();
    $('#check8').prop('checked',  (this._controller.getLocFuncStatus(8)  == 1)).change();
    $('#check9').prop('checked',  (this._controller.getLocFuncStatus(9)  == 1)).change();
    $('#check10').prop('checked', (this._controller.getLocFuncStatus(10) == 1)).change();
    $('#check11').prop('checked', (this._controller.getLocFuncStatus(11) == 1)).change();
    $('#check12').prop('checked', (this._controller.getLocFuncStatus(12) == 1)).change();
    $('#check13').prop('checked', (this._controller.getLocFuncStatus(13) == 1)).change();
    $('#check14').prop('checked', (this._controller.getLocFuncStatus(14) == 1)).change();
    $('#check15').prop('checked', (this._controller.getLocFuncStatus(15) == 1)).change();
    $('#check16').prop('checked', (this._controller.getLocFuncStatus(16) == 1)).change();
    $('#check17').prop('checked', (this._controller.getLocFuncStatus(17) == 1)).change();
    $('#check18').prop('checked', (this._controller.getLocFuncStatus(18) == 1)).change();
    $('#check19').prop('checked', (this._controller.getLocFuncStatus(19) == 1)).change();
    $('#check20').prop('checked', (this._controller.getLocFuncStatus(20) == 1)).change();
    $('#check21').prop('checked', (this._controller.getLocFuncStatus(21) == 1)).change();
    $('#check22').prop('checked', (this._controller.getLocFuncStatus(22) == 1)).change();
    $('#check23').prop('checked', (this._controller.getLocFuncStatus(23) == 1)).change();
    $('#check24').prop('checked', (this._controller.getLocFuncStatus(24) == 1)).change();
    $('#check25').prop('checked', (this._controller.getLocFuncStatus(25) == 1)).change();
    $('#check26').prop('checked', (this._controller.getLocFuncStatus(26) == 1)).change();
    $('#check27').prop('checked', (this._controller.getLocFuncStatus(27) == 1)).change();
    $('#check28').prop('checked', (this._controller.getLocFuncStatus(28) == 1)).change();

    $('#checkDirReverse').prop('checked', this._controller.getLocDir()).change();
};
