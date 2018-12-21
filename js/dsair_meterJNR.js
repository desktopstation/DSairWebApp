//
let DsairMeterJNR = function (inCanvasName) {
    DsairCircularMeter.call(this, inCanvasName);
    this.super = DsairCircularMeter.prototype;
};

inherits(DsairMeterJNR, DsairCircularMeter);

DsairMeterJNR.prototype._meterMaxSpeed = 120;
DsairMeterJNR.prototype._meterStartDeg = 36 * 4;
DsairMeterJNR.prototype._meterRangeDeg = 36 * 7;

DsairMeterJNR.prototype._defaultCharProp = {
    fillStyle: '#111111',
    fontStyle: 'normal',
    fontSize: 8.0 / 9.0,
    fontName: 'arial',
    shadowColor: 'none',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 16
};
//

DsairMeterJNR.prototype._scaleColor = '#111111';
DsairMeterJNR.prototype._canvasBackgroundFillProp = {
    fillStyle: '#3B6063',
    shadowColor: 'none',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0
};


DsairMeterJNR.prototype._scaleCharProp = {
    fontSize: 1.0
};

DsairMeterJNR.prototype._unitCharProp = {
    fontSize: 0.8
};

DsairMeterJNR.prototype._gradationColorTable1 = [
    { offset: 0.00, color: '#EEEEEE' },
    { offset: 0.80, color: '#EEEEEE' },
    { offset: 0.85, color: '#999999' },
    { offset: 0.87, color: '#AAAAAA' },
    { offset: 1.00, color: '#EEEEEE' }
];

// メータ描画パラメータ  

DsairMeterJNR.prototype._valueCharProp = {
    fontStyle: 'bold',
    fontSize: 0.75
};
DsairMeterJNR.prototype._directionCharProp = {
    fontStyle: 'bold',
    fontSize: .75
};

DsairMeterJNR.prototype._triangleFillProp = {
    fillStyle: DsairMeterJNR.prototype._defaultCharProp.color,
    shadowColor: 'none',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0
};

DsairMeterJNR.prototype._handShadowFillProp = {
    strokeStyle: "#000000",
    shadowColor: 'none',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    divisor: 100
};
DsairMeterJNR.prototype._handFillProp = {
    strokeStyle: "#222222",
    fillStyle: "#222222",
    shadowColor: 'none',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    divisor: 100
};
DsairMeterJNR.prototype._gradationColorTable2 = [
    { offset: 0.00, color: '#303030' },
    { offset: 0.30, color: '#404040' },
    { offset: 0.35, color: '#909090' },
    { offset: 1.00, color: '#BBBBBB' }
];
DsairMeterJNR.prototype._enableGross = false;

DsairMeterJNR.prototype._hLenCoefficient = 0.8 / 2;
DsairMeterJNR.prototype._fSizeCoefficient = 1 / 9;
DsairMeterJNR.prototype._rLenCoefficient = 1 / 2;
DsairMeterJNR.prototype._unitCharCoefficient = 1 / 3.0;
DsairMeterJNR.prototype._meterValueYOffsetCoefficient = 1 / 4.2;
DsairMeterJNR.prototype._meterDirectionYCoefficient = 2.25;
DsairMeterJNR.prototype._meterCenterCoefficient = 1 / 8;
//

DsairMeterJNR.prototype._drawMeterScale = function () {
    // Canvasの色、フォント
    this._cv.fillStyle = this._scaleColor;
    // 目盛表示
    for (let i = 0; i <= this._meterMaxSpeed; i++) {
        let radian = ((this._meterRangeDeg / this._meterMaxSpeed) * i + this._meterStartDeg) * Math.PI / 180;
        let radian2 = ((this._meterRangeDeg / this._meterMaxSpeed) * i + this._meterStartDeg + 1.5) * Math.PI / 180;
        let radian3 = ((this._meterRangeDeg / this._meterMaxSpeed) * i + this._meterStartDeg - 1.5) * Math.PI / 180;
        let pos_x = this._cPoint(this._center, this._rLen - 2, radian);//外側
        let pos_x2 = this._cPoint(this._center, this._rLen - 28, radian);//内側

        let aMemSize = 1;

        if (i % 20 == 0) {
            aMemSize = 5;
            // 三角形描画
            let pos_r2 = this._cPoint(this._center, this._rLen - 3, radian2);//外側
            let pos_r3 = this._cPoint(this._center, this._rLen - 3, radian3);//外側
            this._cv.beginPath();
            this._cv.moveTo(pos_x2.x, pos_x2.y);
            this._cv.lineTo(pos_r2.x, pos_r2.y);
            this._cv.lineTo(pos_r3.x, pos_r3.y);
            this._cv.lineTo(pos_x2.x, pos_x2.y);
            this._cv.fill();
        }
        else {
            if (i % 10 == 0) {
                aMemSize = 3;
                // ライン描画
                this._cv.lineWidth = aMemSize;
                this._cv.beginPath();
                this._cv.moveTo(pos_x.x, pos_x.y);
                this._cv.lineTo(pos_x2.x, pos_x2.y);
                this._cv.stroke();
            }
            else if (i % 2 == 0) {
                aMemSize = 1;
                // ライン描画
                this._cv.lineWidth = aMemSize;
                this._cv.beginPath();
                this._cv.moveTo(pos_x.x, pos_x.y);
                this._cv.lineTo(pos_x2.x, pos_x2.y);
                this._cv.stroke();
            }
        }
    }
};

// 文字盤表示
DsairMeterJNR.prototype._drawMeterScaleChar = function () {
    this._setCharProp(this._cv, this._scaleCharProp);
    let MeterNotch = 20;
    if ( this._meterMaxSpeed >= 200) {
        MeterNotch = 40;
    }
    for (let i = 0; i <= this._meterMaxSpeed; i++) {
        if(i % MeterNotch == 0) {
            let radian = ((this._meterRangeDeg / this._meterMaxSpeed) * i + this._meterStartDeg) * Math.PI / 180;
            let xx = this._center.x + (this._hLen - 30) * Math.cos(radian) ;
            let yy = this._center.y + (this._hLen - 30) * Math.sin(radian) + this._fSize / 4;
            let aSpeedMeterText = i;
            let aMetrics3 = this._cv.measureText(aSpeedMeterText);
            this._cv.fillText(aSpeedMeterText, xx - (aMetrics3.width * 0.8 / 2), yy,aMetrics3.width * 0.8);
        }
    }
};

// 針描画
DsairMeterJNR.prototype._drawMeterHand = function (inValue) {
    // 影は無効
    this._cv.shadowBlur = 0;
    this._cv.shadowColor = 'none';
    this._cv.shadowOffsetX = 0;
    this._cv.shadowOffsetY = 0;
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
    this._cv.fill();
};

DsairMeterJNR.prototype._drawMeterGross = function () {
};

