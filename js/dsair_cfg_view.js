var DsairConfigView = function ()  {
    this._controller = null;
    this._initialized = false;
    this._sliderValue = 0;
    this._needUpdateSlider = false;
    this._loaded = false;

    window.addEventListener('DOMContentLoaded', this);
    window.addEventListener('load', this);
};

//

DsairConfigView.prototype._sliderProp = {
    value: 4,
    min: 2,
    max: 6,
    step: 1
};

//

DsairConfigView.prototype.handleEvent = function (e) {
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

DsairConfigView.prototype.onLoad = function() {
    if (this._loaded) {
        return;
    }
    this._loaded = true;
    $('#protcolset').buttonset();
    $('#protcolset_acc').buttonset();

    var self = this;
    Object.assign(this._sliderProp, 
        {
            change: function (/*event, ui*/) {
                self._controller.onConfigMaxSpeed();
            }
        }
    );

    $('#maxspeed_slider').slider(
        this._sliderProp
    );
    $('#submit').click(function() {
        self._controller.setParams();
    });
    $('#formarea').controlgroup();
    this._initialized = true;
    if (this._needUpdateSlider) {
        $('#maxspeed_slider').slider('value', this._sliderValue);
        this._needUpdateSlider = false;
    }
    $('input[type="radio"]').button();
};

//

DsairConfigView.prototype.addController = function (inController) {
	this._controller = inController;
};

DsairConfigView.prototype.getSliderValue = function() {
    return $('#maxspeed_slider').slider('value');
};

DsairConfigView.prototype.setSliderValue = function(data) {
    if (data < this._sliderProp.min) {
        console.info('slider value too small %d', data);
    } else if (data > this._sliderProp.max) {
        console.info('slider value too big %d', data);
    }
    this._sliderValue = data;
    if (this._initialized) {
        $('#maxspeed_slider').slider('value', this._sliderValue);
    } else {
        this._needUpdateSlider = true;
    }
};

DsairConfigView.prototype.setSliderLabelValue = function (data) {
    $('#maxspeed_label').text(data);
}

DsairConfigView.prototype.getMasterCode = function () {
    return $('#mastercode').text();
};

DsairConfigView.prototype.getAppSSID = function () {
    return $('#appssid').val();
};

DsairConfigView.prototype.getAppMetworkKey = function () {
    return $('#appnetworkkey').val();
};

DsairConfigView.prototype.setMasterCode = function (data) {
    //console.log(data);
    $('#mastercode').text(data);
};

DsairConfigView.prototype.setAppSSID = function (data) {
    //console.log(data);console.log(data);
    $('#appssid').val(data);
};

DsairConfigView.prototype.setAppMetworkKey = function (data) {
    //console.log(data);
    $('#appnetworkkey').val(data);
};

//
DsairConfigView.prototype.getLocProtocol = function () {
    return $('[name=radio_loc]:checked').val();
};

DsairConfigView.prototype.getAccProtocol = function () {
    return $('[name=radio_acc]:checked').val();
};

DsairConfigView.prototype.setLocProtocolDCC = function () {
    $('#radio1').prop('checked', true).change();
};

DsairConfigView.prototype.setLocProtocolMM2 = function () {
    $('#radio2').prop('checked', true).change();
};

DsairConfigView.prototype.setAccProtocolDCC = function () {
    $('#radio1a').prop('checked', true).change();
};

DsairConfigView.prototype.setAccProtocolMM2 = function () {
    $('#radio2a').prop('checked', true).change();
};

