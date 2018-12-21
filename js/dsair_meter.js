//
let DsairMeter = function (inCanvasName) {
    DsairCircularMeter.call(this, inCanvasName);
    this.super = DsairCircularMeter.prototype;
};

inherits(DsairMeter, DsairCircularMeter);

// 以下の属性は変更可能
// メータ背景描画パラメータ
DsairMeter.prototype._internalMeterRange = 1024;
DsairMeter.prototype._meterMaxSpeed = 240;
DsairMeter.prototype._unit = 'km/h';
DsairMeter.prototype._meterStartDeg = 135;
DsairMeter.prototype._meterRangeDeg = 270;

DsairMeter.prototype._defaultCharProp = {
    fillStyle: '#FFFFFF',
    fontStyle: 'bold',
    fontSize: 0.5,
    fontName: 'verdana',
    shadowColor: '#9F9F9F',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 16
};

// メータ背景描画パラメータ
DsairMeter.prototype._scaleColor = '#9F9F9F'
DsairMeter.prototype._canvasBackgroundFillProp = {
    fillStyle: "#FFFFFF",
    shadowColor: 'none',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0
};
DsairMeter.prototype._scaleCharProp = {
    size: 0.55
};
DsairMeter.prototype._unitCharProp = {
    size: 0.5
};
DsairMeter.prototype._gradationColorTable1 = [
    { offset: 0.00, color: '#202020' },
    { offset: 0.92, color: '#404040' }, 
    { offset: 0.92, color: '#0A0A0A' }, 
    { offset: 0.95, color: '#707070' },
    { offset: 1.00, color: '#8A8A8A' }
];

// メータ描画パラメータ  
DsairMeter.prototype._valueCharProp = {
    fontSize: 0.7,
    shadowColor: 'none',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0
};
DsairMeter.prototype._directionCharProp = {
    fontSize: 0.7,
    shadowColor: 'none',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0
};
DsairMeter.prototype._triangleFillProp = {
    fillStyle: DsairMeter.prototype._defaultCharProp.color,
    shadowColor: 'none',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0
};
DsairMeter.prototype._handShadowFillProp = {
    strokeStyle: "#550000",
    shadowColor: 'none',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    divisor: 50
};
DsairMeter.prototype._handFillProp = {
    strokeStyle: "#FF5555",
    fillStyle: "#FF5555",
    shadowColor: 'none',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    divisor: 100
};
DsairMeter.prototype._gradationColorTable2 = [
    { offset: 0.00, color: '#505050' },
    { offset: 0.95, color: '#515151' },
    { offset: 1.00, color: '#707070' }
];
DsairMeter.prototype._enableGross = true;
DsairMeter.prototype._grossFillStyle = 'rgba(255, 255, 255, 0.07)';

DsairCircularMeter.prototype._hLenCoefficient = 0.8 / 2;
DsairMeter.prototype._fSizeCoefficient = 1 / 8;
DsairMeter.prototype._rLenCoefficient = 1 / 2;
DsairMeter.prototype._unitCharCoefficient = 1 / 3.8;
DsairMeter.prototype._meterValueYOffsetCoefficient = 1 / 5;
DsairMeter.prototype._meterDirectionYCoefficient = 2.5;
DsairMeter.prototype._meterCenterCoefficient = 1 / 20;

// 目盛表示
DsairMeter.prototype._drawMeterScale = function () {
    // Canvasの色、フォント
    this._cv.fillStyle = this._scaleColor; //"#9F9F9F";
    for (let i = 0; i <= 60; i++) {
        let radian = ((this._meterRangeDeg / 60) * i +
            this._meterStartDeg) * Math.PI / 180;
        let xx = this._center.x + (this._rLen - 20) * Math.cos(radian);
        let yy = this._center.y + (this._rLen - 20) * Math.sin(radian);

        let aMemSize = 2;

        if (i % 10 == 0) {
            aMemSize = 6;
        }
        else if (i % 5 == 0) {
            aMemSize = 4;
        }
        else {
            //aMemSize = 2;
        }

        this._cv.beginPath();
        this._cv.arc(xx, yy, aMemSize, 0, Math.PI * 2, false);
        this._cv.fill();
    }
};

// 文字盤表示
DsairMeter.prototype._drawMeterScaleChar = function () {
    this._setCharProp(this._cv, this._scaleCharProp);
    for (let i = 0; i <= 6; i++) {
        let radian = ((this._meterRangeDeg / 6) * i + this._meterStartDeg) * Math.PI / 180;
        let xx = this._center.x + (this._hLen - 20) * Math.cos(radian);
        let yy = this._center.y + (this._hLen - 20) * Math.sin(radian) + this._fSize / 4;
        let aSpeedMeterText = Math.round(i * (this._meterMaxSpeed / 6));
        let aMetrics3 = this._cv.measureText(aSpeedMeterText);
        this._cv.fillText(aSpeedMeterText, xx - (aMetrics3.width / 2), yy);
    }
};

// 針描画
DsairMeter.prototype._drawMeterHand = function (inValue) {
    // 針(影)描画
    let hRadian = (inValue + this._meterStartDeg) * Math.PI / 180;
    let pos_x = this._cPoint(this._center, this._rLen - 25, hRadian);
    let a90deg = Math.PI / 2;
    this._setFillProp(this._cv, this._handShadowFillProp);
    this._cv.beginPath();
    this._cv.moveTo(this._center.x + 8 * Math.cos(hRadian - a90deg),
        this._center.y + 8 * Math.sin(hRadian - a90deg));
    this._cv.lineTo(pos_x.x, pos_x.y);
    this._cv.lineTo(this._center.x + 8 * Math.cos(hRadian + a90deg),
        this._center.y + 8 * Math.sin(hRadian + a90deg));
    this._cv.closePath();
    this._cv.stroke();

    // 針(中心)描画
    this._setFillProp(this._cv, this._handFillProp);
    this._cv.beginPath();
    this._cv.moveTo(this._center.x + 8 * Math.cos(hRadian - a90deg),
        this._center.y + 8 * Math.sin(hRadian - a90deg));
    this._cv.lineTo(pos_x.x, pos_x.y);
    this._cv.lineTo(this._center.x + 8 * Math.cos(hRadian + a90deg),
        this._center.y + 8 * Math.sin(hRadian + a90deg))
    this._cv.closePath();
    this._cv.stroke();
    this._cv.fill();
};

DsairMeter.prototype._drawMeterGross = function () {
    this._cv.fillStyle = this._grossFillStyle;
    this._cv.beginPath();
    this._cv.arc(this._center.x, this._center.y / 20, this._scale / 1.5, 0, Math.PI * 2, false);
    this._cv.closePath();
    this._cv.fill();
};
