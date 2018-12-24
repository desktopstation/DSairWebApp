var DsairStatusControl= function () {
    this._view = null;
};

DsairStatusControl.prototype.addView = function (inView) {
    this._view = inView;
};

DsairStatusControl.prototype.onDistStateNotify = function(cbArg) {
    this._view.setStatus(cbArg);
};
