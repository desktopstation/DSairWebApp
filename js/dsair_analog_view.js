//
var DsairAnalogView = function() {
    this._controller = null;
    this._loaded = false;
    this._powerStatus = DsairConst.powerOff;
    this._isActive = false;
    this._needUpdateVisibleItems = false;

    window.addEventListener('DOMContentLoaded', this);
    window.addEventListener('load', this);
};

DsairAnalogView.prototype.setController = function (inController) {
    this._controller = inController;
};

DsairAnalogView.prototype.handleEvent = function (e) {
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

DsairAnalogView.prototype.onLoad = function () {
    if (this._loaded) {
        return;
    }
    this._loaded = true;
    $('#ANA_SPEED-value').val(0);
    $('#ANA_SPEED-option').val("%");
    var self = this;
    $("#ANA_MaxVoltage").slider({
        orientation: 'vertical',
        animate: 'slow',
        value: 100,
        min: 50,
        max: 100,
        step: 1,
        range: "min",
        slide: function (event, ui) {
            $('#ANA_MaxVoltage-value').val(ui.value);
            self._controller.onChangeMaxVoltage(ui.value);
            //ANA_MaxSpeed = ui.value;
        }
    });
    $('#ANA_MaxVoltage-value').val(jQuery('#ANA_MaxVoltage').slider('value'));

    $("#ANA_LightThred").slider({
        orientation: 'vertical',
        animate: 'slow',
        value: 7,
        min: 1,
        max: 40,
        step: 1,
        range: "min",
        slide: function (event, ui) {
            $('#ANA_LightThred-value').val(ui.value);
            self._controller.onChangeLightThreshold(ui.value);
            //ANA_LightThreshold = Math.round(ui.value * 1023 / 100);
        }
    });
    $('#ANA_LightThred-value').val(jQuery('#ANA_LightThred').slider('value'));
    this._loaded = true;
    if (this._needUpdateVisibleItems) {
        this._setVisibleItems();
    }
};

DsairAnalogView.prototype.setLightMode = function (inLightMode) {
    $('#btnAnaLight').prop('checked', inLightMode).change();
};

DsairAnalogView.prototype.setSpeedDelay = function (inSpeedDelayOn) {
    $('#btnAnaSlow').prop('checked', inSpeedDelayOn).change();
};

DsairAnalogView.prototype.setSpeedMode = function (inMode) {
    switch (inMode) {
        case 1:
            $('#btnModeC1').prop('checked', true).change();
            $('#btnModeC2').prop('checked', false).change();
            $('#btnModeC3').prop('checked', false).change();
            break;
        case 2:
            $('#btnModeC1').prop('checked', false).change();
            $('#btnModeC2').prop('checked', true).change();
            $('#btnModeC3').prop('checked', false).change();
            break;
        case 3:
            $('#btnModeC1').prop('checked', false).change();
            $('#btnModeC2').prop('checked', false).change();
            $('#btnModeC3').prop('checked', true).change();
            break;
        default:
            console.info('Unknowd mode ', inMode);
            break;
    }
};

DsairAnalogView.prototype.setDirection = function (inDirection) {
    if (inDirection == DsairConst.dirREV) {
        //REV
        $('#btnAnaFwd').prop('checked', false).change();
        $('#btnAnaRev').prop('checked', true).change();
    } else if (inDirection == DsairConst.dirFWD){
        //FWD
        $('#btnAnaFwd').prop('checked', true).change();
        $('#btnAnaRev').prop('checked', false).change();
    } else {
        console.info('Unknowd direction ', inDirection);
    }
};

DsairAnalogView.prototype.setPowerStatus = function (inPowerStatus) {
    if (!this._loaded) {
        return;
    }
    if (inPowerStatus == DsairConst.powerOn) {
        $('#ANA_PowerIcon').animate({
            color: '#aa0000'
        }, 500);
    } else if (inPowerStatus == DsairConst.powerOff) {
        $('#ANA_PowerIcon').animate({
            color: '#aaaaaa'
        }, 500);
    } else {
        console.info('Unknown power status ', inPowerStatus);
    }
};

DsairAnalogView.prototype.setVisibleItems = function (inIsActive) {
    this._isActive = inIsActive;
    if (this._loaded) {
        this._setVisibleItems();
    } else {
        // onLoad時に描画
        this._needUpdateVisibleItems = true;
    }
};

DsairAnalogView.prototype._setVisibleItems = function () {
    if (!this._isActive) {
        // Another mode is active
        $('#btnAnaFwd').attr('disabled', true);
        $('#btnAnaRev').attr('disabled', true);
        $('#AnaStopButton').attr('disabled', true);
        $('#btnModeC1').attr('disabled', true);
        $('#btnModeC2').attr('disabled', true);
        $('#btnModeC3').attr('disabled', true);
    } else {
        // Analog modes
        $('#btnAnaFwd').removeAttr('disabled');
        $('#btnAnaRev').removeAttr('disabled');
        $('#AnaStopButton').removeAttr('disabled');
        $('#btnModeC1').removeAttr('disabled');
        $('#btnModeC2').removeAttr('disabled');
        $('#btnModeC3').removeAttr('disabled');
    }
};

// TODO: create new class ?
DsairAnalogView.prototype.setSpeed = function (inSpeed) {
    $('#ANA_SPEED-value').val(Math.round(inSpeed * 100 / 1023));
};

