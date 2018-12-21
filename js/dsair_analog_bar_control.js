//
var DsairAnalogBarControl = function () {
    DsairSpeedControl.call(this);
    this.super = DsairSpeedControl.prototype;
    this._width = 0;
    this._height = 0;
    this._zeroSpeedThreshold = 0;
    this._range = 0;
}

inherits(DsairAnalogBarControl, DsairSpeedControl);

DsairAnalogBarControl.prototype.onClickCanvasDown = function (e) {
    e.preventDefault();

    let rect = e.target.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (y > this._zeroSpeedThreshold) {
        y = this._height;
    } else {
        y = ((y - (this._height - this._zeroSpeedThreshold)) * this._height) / this._zeroSpeedThreshold;
    }
    let aCalcLocSpeed = this.CalcSpeedMeter(x, y);
    this._controller.onChangeSpeed(aCalcLocSpeed, false);
};

DsairAnalogBarControl.prototype.onTouchCanvasUp = function (e) {
    e.preventDefault();

    if (e.changedTouches[0] != null) {

        let touchObject = e.changedTouches[0];
        let touchX = touchObject.pageX;
        let touchY = touchObject.pageY;

        // 要素の位置を取得
        let clientRect = e.target.getBoundingClientRect();
        let positionX = clientRect.left + window.pageXOffset;
        let positionY = clientRect.top + window.pageYOffset;

        // 要素内におけるタッチ位置を計算
        let x = touchX - positionX;
        let y = touchY - positionY;

        let aCalcLocSpeed = this.CalcSpeedMeter(x, y);
        this._controller.onChangeSpeed(aCalcLocSpeed, true);
    }
};

DsairAnalogBarControl.prototype.onTouchCanvasMove = function (e) {

    if (e.changedTouches[0] != null) {

        let touchObject = e.changedTouches[0];
        let touchX = touchObject.pageX;
        let touchY = touchObject.pageY;

        // 要素の位置を取得
        let clientRect = e.target.getBoundingClientRect();
        let positionX = clientRect.left + window.pageXOffset;
        let positionY = clientRect.top + window.pageYOffset;

        // 要素内におけるタッチ位置を計算
        let x = touchX - positionX;
        let y = touchY - positionY;

        let aCalcLocSpeed = this.CalcSpeedMeter(x, y);
        this._controller.onChangeSpeed(aCalcLocSpeed, false);
    }
};

DsairAnalogBarControl.prototype.onTouchCanvasDown = function (e) {
    this.onTouchCanvasMove(e);
};

DsairAnalogBarControl.prototype.CalcSpeedMeter = function (x, y) {
    if (y < 0) {
        y = 0;
    }

    if (y > this._height) {
        y = this._height;
    }
    let aCalcLocSpeed = Math.round(this._height - y) * (this._speedRange - 1) / this._height;
    return aCalcLocSpeed;
};

DsairAnalogBarControl.prototype.setControlInfo = function (meterInfo) {
    this._canvas = meterInfo.canvas;

    this._canvas.addEventListener('mousedown', this);
    this._canvas.addEventListener('touchstart', this);
    this._canvas.addEventListener('touchmove', this);
    this._canvas.addEventListener('touchend', this);

    this._width = meterInfo.width;
    this._height = meterInfo.height;
    this._zeroSpeedThreshold = this._height * .975;
    this._range = this._zeroSpeedThreshold;
};
