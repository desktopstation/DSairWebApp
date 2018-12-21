// 速度指令
var DsairMeterControl = function () {

    DsairSpeedControl.call(this);
    this.super = DsairSpeedControl.prototype;
    //
    this._canvas = null;
    this._meterStartDeg = 135;
    this._meterRangeDeg = 270;
    this._hLen = 0;
    this._center = null;
    this._forceUpdate = false;
    //
    this._stateMeterMoving = false;
};

inherits(DsairMeterControl, DsairSpeedControl);

DsairMeterControl.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'load':
            break;
        case 'mousedown':
            this.onClickCanvasDown(e);
            break;
        case 'mousemove':
            this.onClickCanvasMove(e);
            break;
        case 'mouseup':
            this.onClickCanvasUp(e);
            break;
        case 'touchstart':
            this.onTouchCanvasDown(e);
            break;
        case 'touchmove':
            this.onTouchCanvasMove(e);
            break;
        case 'touchend':
            this.onTouchCanvasUp(e);
            break;
        default:
            break;
    }
};

//

DsairMeterControl.prototype.onTouchCanvas = function (e) {

    e.preventDefault();

    var touchObject = e.changedTouches[0];
    var touchX = touchObject.pageX;
    var touchY = touchObject.pageY;

    // 要素の位置を取得
    var clientRect = e.target.getBoundingClientRect();
    var positionX = clientRect.left + window.pageXOffset;
    var positionY = clientRect.top + window.pageYOffset;

    // 要素内におけるタッチ位置を計算
    var x = touchX - positionX;
    var y = touchY - positionY;

    var rx = x - this._center.x;
    var ry = y - this._center.y;

    var aLocSpeed = this.CalcSpeedMeter(rx, ry);
    if (aLocSpeed == null) {
        return;
    }
    if (this._controller != null) {
        this._controller.onChangeSpeed(aLocSpeed, this._forceUpdate);
    }
    this._forceUpdate = false;
};

DsairMeterControl.prototype.onTouchCanvasDown = function (e) {

    this._forceUpdate = true;
    this._stateMeterMoving = true;
    this.onTouchCanvas(e);
}

DsairMeterControl.prototype.onTouchCanvasMove = function (e) {
    if (!this._stateMeterMoving) {
        return;
    } else {
        this.onTouchCanvas(e);
    }
};

DsairMeterControl.prototype.onTouchCanvasUp = function (e) {

    this._forceUpdate = true;
    this._stateMeterMoving = false;
    this.onTouchCanvas(e);
    this._forceUpdate = false;
};

DsairMeterControl.prototype.onClickCanvas = function (e) {

    e.preventDefault();

    var rect = e.target.getBoundingClientRect();

    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    var rx = x - this._center.x;
    var ry = y - this._center.x;

    var aLocSpeed = this.CalcSpeedMeter(rx, ry);
    if (aLocSpeed == null) {
        return;
    }
    //console.log("speed = %d", aLocSpeed);
    if (this._controller != null) {
        this._controller.onChangeSpeed(aLocSpeed, this._forceUpdate);
    }
    this._forceUpdate = false;
 };

DsairMeterControl.prototype.onClickCanvasDown = function (e) {

    this._forceUpdate = true;
    this._stateMeterMoving = true;
    this.onClickCanvas(e);
};

DsairMeterControl.prototype.onClickCanvasMove = function (e) {
    //console.log('_stateMeterMoving %d', this._stateMeterMoving);

    if (!this._stateMeterMoving) {
        return;
    } else {
        this.onClickCanvas(e);
    }
};

DsairMeterControl.prototype.onClickCanvasUp = function (e) {

    this._forceUpdate = true;
    this._stateMeterMoving = false;
    this.onClickCanvas(e);
    this._forceUpdate = false;
};

DsairMeterControl.prototype.CalcSpeedMeter = function (rx, ry) {

    var aR = Math.sqrt(rx * rx + ry * ry);

    //if ((aR < 40) || (aR > 200)) {
    // _scaleが40の時、_hLen = 160
    // TODO:
    if ((aR < (this._hLen / 4)) || (aR > (this._hlen * 1.25))) {
        /* 円の内側および外側は無視する */
        return null;
    }

    var aTheta = Math.atan2(ry, rx) + Math.PI;
    var aTheta_r = (aTheta * 180 / Math.PI);

    var MeterStartDeg2 = 180 + this._meterStartDeg; //180 + 135 = 315
    var MeterEndDeg2 = 180 + this._meterStartDeg + this._meterRangeDeg - 360; // 180 + 135 + 270 - 360= 225
    var MeterRemain = 180 - this._meterStartDeg;

    /* 10deg以上ずれている場合は無視する処理とする */
    if ((aTheta_r < (MeterStartDeg2 - 15)) && (aTheta_r > (MeterEndDeg2 + 15))) {
        return null;
    }

    /* 225deg - 315degは無効範囲。 */

    /* 許容範囲の調整(0speed) */
    /* 許容範囲の調整(0speed) 320,300 315*/
    if ((aTheta_r <= (MeterStartDeg2 + 5)) && (aTheta_r >= (MeterStartDeg2 - 15))) {
        aTheta_r = MeterStartDeg2;
    }

    /* 許容範囲の調整(max speed) */
    /* 許容範囲の調整(max speed) 220,240 225*/
    if ((aTheta_r >= (MeterEndDeg2 - 5)) && (aTheta_r <= (MeterEndDeg2 + 15))) {
        aTheta_r = MeterEndDeg2;
    }

    /* 正規化 */
    if (aTheta_r > 300) {
        //aTheta_r = aTheta_r - 360 + 45;
        aTheta_r = aTheta_r - 360 + MeterRemain;
    } else {
        //aTheta_r = aTheta_r + 45;
        aTheta_r = aTheta_r + MeterRemain;
    }

    //alert(aTheta_r);

    /* 角度から速度値に換算（精度を32dずつにわざと落として処理軽量化） */
   return(Math.round((aTheta_r) * (this._speedRange - 1) / this._meterRangeDeg));
};

//

DsairMeterControl.prototype.setControlInfo = function (meterInfo) {
    this._canvas = meterInfo.canvas;

    this._canvas.addEventListener('mousedown', this);
    this._canvas.addEventListener('mouseup', this);
    this._canvas.addEventListener('mousemove', this);
    this._canvas.addEventListener('touchstart', this);
    this._canvas.addEventListener('touchmove', this);
    this._canvas.addEventListener('touchend', this);

    this._meterStartDeg = meterInfo.meterStartDeg;
    this._meterRangeDeg = meterInfo.meterRangeDeg;
    this._hLen = meterInfo.hLen;
    this._center = meterInfo.center;
};
