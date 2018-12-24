var DsairStatusView = function () {
    this._device = null;
};

DsairStatusView.prototype.setDevice = function (inDevice) {
    this._device = inDevice;
};

DsairStatusView.prototype.setStatus = function (arg) {

    $('#status_volt').text('Track Voltage: ' + (arg.statusVolt / 10).toString() + '[V]');
    $('#status_current').text('Out Current: ' + (arg.statusCurrent / 10).toString() + '[A]');
    $('#status_power').text('Track Power: ' + (arg.statusPower == 'Y' ? 'ON' : 'OFF'));
    $('#status_firmver').text('Firmware: ver.' + arg.statusFirmVerus);
    $('#status_error').text('Error: ' + this._device.ErrorString(arg.statusError));
    $('#status_hardver').text('Hardware: ' + this._device.HWnameString(arg.statusHardVer));
    $('#status_seqno').text('Alive Seq: ' + arg.statusSeqNo);

    $('#status_replymsg').text('Reply Msg: ' + arg.statusReplyMsg);
    $('#status_replyacc').text('Acc Datas: ' + arg.statusReplyAcc);
};
