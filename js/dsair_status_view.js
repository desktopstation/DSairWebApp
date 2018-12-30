// 
var DsairStatusView = function () {
    this._device = null;
};

DsairStatusView.prototype.setDevice = function (inDevice) {
    this._device = inDevice;
};

DsairStatusView.prototype.formatNumber = function (n) {
    let intPart = Math.trunc(n / 10);
    let tenthPart = n - (intPart * 10);
    return intPart.toString() + '.' + tenthPart.toString();
};

DsairStatusView.prototype.setStatus = function (arg) {

    $('#status_volt').text('Track Voltage: ' + this.formatNumber(arg.statusVolt) + '[V]');
    $('#status_current').text('Out Current: ' + this.formatNumber(arg.statusCurrent) + '[A]');
    $('#status_power').text('Track Power: ' + (arg.statusPower == 'Y' ? 'ON' : 'OFF'));
    $('#status_firmver').text('Firmware: ver.' + arg.statusFirmVer);
    $('#status_error').text('Error: ' + this._device.ErrorString(arg.statusError));
    $('#status_hardver').text('Hardware: ' + this._device.HWnameString(arg.statusHardVer));
    $('#status_seqno').text('Alive Seq: ' + arg.statusSeqNo);

    $('#status_replymsg').text('Reply Msg: ' + arg.statusReplyMsg);
    $('#status_replyacc').text('Acc Datas: ' + arg.statusReplyAcc);
};
