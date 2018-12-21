let DsairCircularMeter = function (inCanvasName) {

    DsairMeterBase.call(this, inCanvasName);
    this.circularMeterSuper = DsairMeterBase.prototype;

    this._cv = null;
    this._CachedImage = false;
    this._stateMeterMoving = 0;
    this._canvas = null;
    this._locSpeed = 0;
    this._locDir = DsairConst.dirFWD;

    this._width = 0;
    this._height = 0;
    this._scale = 0;
    this._center = null;
    this._hLen = 0;
    this._fSize = 0;
    this._rLen = 0;
    this._CacheMeterBG = null;  //メーター背景のキャッシュ

    //window.addEventListener('load', this);
};

inherits(DsairCircularMeter, DsairMeterBase);

// 以下の属性は変更可能
// メータ背景描画パラメータ
DsairCircularMeter.prototype._meterMaxSpeed = 240;
DsairCircularMeter.prototype._unit = 'km/h';
DsairCircularMeter.prototype._meterStartDeg = 135;
DsairCircularMeter.prototype._meterRangeDeg = 270;

DsairCircularMeter.prototype._defaultCharProp = {
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
DsairCircularMeter.prototype._scaleColor = '#9F9F9F'
DsairCircularMeter.prototype._canvasBackgroundFillProp = {
    fillStyle: "#FFFFFF",
    shadowColor: 'none',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0
};
DsairCircularMeter.prototype._scaleCharProp = {
    size: 0.55
};
DsairCircularMeter.prototype._unitCharProp = {
    size: 0.5
};
DsairCircularMeter.prototype._gradationColorTable1 = [
    { offset: 0.00, color: '#202020' },
    { offset: 0.92, color: '#404040' }, 
    { offset: 0.92, color: '#0A0A0A' }, 
    { offset: 0.95, color: '#707070' },
    { offset: 1.00, color: '#8A8A8A' }
];

// メータ描画パラメータ  
DsairCircularMeter.prototype._valueCharProp = {
    fontSize: 0.7,
    shadowColor: 'none',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0
};
DsairCircularMeter.prototype._directionCharProp = {
    fontSize: 0.7,
    shadowColor: 'none',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0
};
DsairCircularMeter.prototype._triangleFillProp = {
    fillStyle: DsairCircularMeter.prototype._defaultCharProp.color,
    shadowColor: 'none',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0
};
DsairCircularMeter.prototype._handShadowFillProp = {
    strokeStyle: "#550000",
    shadowColor: 'none',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    divisor: 50
};
DsairCircularMeter.prototype._handFillProp = {
    strokeStyle: "#FF5555",
    fillStyle: "#FF5555",
    shadowColor: 'none',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    divisor: 100
};
DsairCircularMeter.prototype._gradationColorTable2 = [
    { offset: 0.00, color: '#505050' },
    { offset: 0.95, color: '#515151' },
    { offset: 1.00, color: '#707070' }
];
DsairCircularMeter.prototype._enableGross = true;
DsairCircularMeter.prototype._grossFillStyle = 'rgba(255, 255, 255, 0.07)';

//
DsairCircularMeter.prototype._directionMessage = [];
DsairCircularMeter.prototype._directionMessage[DsairConst.dirFWD] = 'FWD';
DsairCircularMeter.prototype._directionMessage[DsairConst.dirREV] = 'REV';

DsairCircularMeter.prototype._hLenCoefficient = 0.8 / 2;
DsairCircularMeter.prototype._fSizeCoefficient = 1 / 8;
DsairCircularMeter.prototype._rLenCoefficient = 1 / 2;
DsairCircularMeter.prototype._unitCharCoefficient = 1 / 3.8;
DsairCircularMeter.prototype._meterValueYOffsetCoefficient = 1 / 5;
DsairCircularMeter.prototype._meterDirectionYCoefficient = 2.5;
DsairCircularMeter.prototype._meterCenterCoefficient = 1 / 20;
//

DsairCircularMeter.prototype.onLoad = function() {
    this._updateScales();
    this._CacheMeterBG = new Image();
    this._drawMeterBackground();
    this._drawMeter();
    this.circularMeterSuper.onLoad.call(this);
};

// scale変更時の処理
DsairCircularMeter.prototype._updateScales = function () {
    let canvas = document.getElementById(this._canvasName);
    this._width = canvas.width;
    this._height = canvas.height;
    if (this._width < this._height) {
        this._scale = this._width;
    } else {
        this._scale = this._height;
    }
    this._center = {
        x: this._width / 2,
        y: this._height / 2
    };
    this._hLen = this._scale * this._hLenCoefficient; // 針の長さ
    this._fSize = this._scale * this._fSizeCoefficient; // フォントサイズ
    this._rLen = this._scale * this._rLenCoefficient;
};

//

DsairCircularMeter.prototype._setCharProp = function (cv, prop) {
    let fontProp = {
        fontStyle: '',
        fontSize: 1,
        fontName: ''
    };

    for (let key of Object.keys(this._defaultCharProp)) {
        if (key in prop) {
            if (key in fontProp) {
                //console.log('%s %s', key, prop[key]);
                if (key == 'fontSize') {
                    fontProp[key] = this._fSize * prop[key];
                } else {
                    fontProp[key] = prop[key];
                }
            } else {
                cv[key] = prop[key];
            }
        } else {
            if (key in fontProp) {
                //console.log('%s %s', key, this._defaultCharProp[key]);
                if (key == 'fontSize') {
                    fontProp[key] = this._fSize * this._defaultCharProp[key];
                } else {
                    fontProp[key] = this._defaultCharProp[key];
                }
                //console.log(fontProp[key]);
            } else {
                cv[key] = this._defaultCharProp[key];
            }
        }
    }
    let font = fontProp.fontStyle + ' ' + fontProp.fontSize + 'px \'' + fontProp.fontName + '\'';
    //console.log(font);
    cv.font = font;
};

DsairCircularMeter.prototype._setFillProp = function (cv, prop) {
    for (let key of ['strokeStyle', 'fillStyle', 'shadowColor',
        'shadowOffsetX', 'shadowOffsetY', 'shadowBlur', 'divisor']) {
        if (key in prop) {
            if (key == 'divisor') {
                cv.lineWidth = this._scale / prop[key];
            } else {
                cv[key] = prop[key];
            }
        }
    }
};

// 背景を描画
DsairCircularMeter.prototype._drawMeterBase = function () {

    this._setFillProp(this._cv, this._canvasBackgroundFillProp);
    this._cv.fillRect(0, 0, this._width, this._height);

    //Draw meter
    this._cv.beginPath();
    this._cv.arc(this._center.x, this._center.y, this._scale / 2, 0, Math.PI * 2, false);
    // グラデーション指定
    let grad = this._cv.createRadialGradient(this._center.x / 1, this._center.y / 1, 0, this._center.x, this._center.y, this._scale / 2);

    for (let gradinfo of this._gradationColorTable1) {
        grad.addColorStop(gradinfo.offset, gradinfo.color);
    }
    this._cv.fillStyle = grad;
    this._cv.fill();
};

// 目盛表示
DsairCircularMeter.prototype._drawMeterScale = function () {
};

// 文字盤表示
DsairCircularMeter.prototype._drawMeterScaleChar = function () {
};

// 速度単位表示
DsairCircularMeter.prototype._drawMeterUnitChar = function () {
    this._setCharProp(this._cv, this._unitCharProp);
    let aMetrics2 = this._cv.measureText(this._unit);
    this._cv.fillText(this._unit, 
        this._center.x - (aMetrics2.width / 2), 
        this._center.y + this._scale * this._unitCharCoefficient)
};

DsairCircularMeter.prototype._drawMeterBackground = function () {

    if (this._canvas == null) {
        this._canvas = document.getElementById(this._canvasName);
        this._cv = this._canvas.getContext("2d");
    }
    // メーター背景の描画
    this._drawMeterBase();
    // 目盛表示
    this._drawMeterScale();

    // 文字盤表示
    this._drawMeterScaleChar();

    // 速度単位表示
    this._drawMeterUnitChar();

    this._CacheMeterBG.src = this._canvas.toDataURL('image/png');
    this._CachedImage = true;
};

// 値表示
DsairCircularMeter.prototype._drawMeterValue = function (inSpeed) {
    this._setCharProp(this._cv, this._valueCharProp);
    let aLocMeterMaxSpeed = this._meterMaxSpeed;
    let aMetrics = this._cv.measureText(Math.round(inSpeed * aLocMeterMaxSpeed / this._internalMeterRange));
    this._cv.fillText(Math.round(inSpeed * aLocMeterMaxSpeed / this._internalMeterRange),
        this._center.x - (aMetrics.width / 2),
        this._center.y + this._scale * this._meterValueYOffsetCoefficient);
};

DsairCircularMeter.prototype._getMeterDirectionString =function(inDir) {
    if (inDir in this._directionMessage) {
        return this._directionMessage[inDir];
    }
    console.info('Invalid direction type ', inDir);
    return '???';
}

// 進行方向表示
DsairCircularMeter.prototype._drawMeterDirection = function () {
    let yFactor = this._meterDirectionYCoefficient;
    let aDirStr = this._getMeterDirectionString(this._locDir);
    this._setCharProp(this._cv, this._directionCharProp);
    let aMetrics3 = this._cv.measureText(aDirStr);
    this._cv.fillText(aDirStr,
        this._center.x - (aMetrics3.width / 2),
        this._center.y + this._scale / yFactor);

    // 三角形を描く
    this._setFillProp(this._cv, this._triangleFillProp);
    this._cv.beginPath();

    if (this._locDir == DsairConst.dirFWD) {
        this._cv.moveTo(this._center.x + 10, this._center.y + (this._scale / yFactor) - 30);
        this._cv.lineTo(this._center.x +  0, this._center.y + (this._scale / yFactor) - 40);
        this._cv.lineTo(this._center.x - 10, this._center.y + (this._scale / yFactor) - 30);
    } else if (this._locDir == DsairConst.dirREV) {
        this._cv.moveTo(this._center.x + 10, this._center.y + (this._scale / yFactor) + 10);
        this._cv.lineTo(this._center.x +  0, this._center.y + (this._scale / yFactor) + 20);
        this._cv.lineTo(this._center.x - 10, this._center.y + (this._scale / yFactor) + 10);
    }
    this._cv.closePath();
    // 三角形を塗りつぶす
    this._cv.fill();
};

// 針描画
DsairCircularMeter.prototype._drawMeterHand = function (inValue) {
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

// メータの中心円を書く
DsairCircularMeter.prototype._drawMeterCenter = function () {
    // グラデーション指定
    let grad2 = this._cv.createRadialGradient(this._center.x / 1, this._center.y / 1, 0, 
        this._center.x, this._center.y, this._scale / 20);
    for (let gradinfo of this._gradationColorTable2)    {
        grad2.addColorStop(gradinfo.offset, gradinfo.color);
    }
    this._cv.fillStyle = grad2;
    this._cv.beginPath();
    this._cv.arc(this._center.x, this._center.y,
        this._scale * this._meterCenterCoefficient, 0, Math.PI * 2, false);
    this._cv.closePath();
    this._cv.fill();
};

DsairCircularMeter.prototype._drawMeterGross = function () {
};

DsairCircularMeter.prototype._drawMeter = function () {
    if (!this._CachedImage) {
        this._drawMeterBackground();
        this._CachedImage = true;
    }
   
    // let inValue = Math.round((inSpeed * 270) / 1023);
    let inValue = Math.round((this._locSpeed * this._meterRangeDeg) / (this._internalMeterRange - 1));
    if (this._canvas == null) {
        this._canvas = document.getElementById(this._canvasName);
    }

    // this._setFillProp(this._cv, this._canvasBackgroundFillProp);
    // cv.fillRect(0,0, cvSize, cvSize);

    // 画像描画
    this._cv.drawImage(this._CacheMeterBG, 0, 0);

    // 値表示
    this._drawMeterValue(this._locSpeed);

    // 進行方向表示 
    this._drawMeterDirection();

    // 針描画
    this._drawMeterHand(inValue);

    // メータの中心円を書く
    this._drawMeterCenter();

    // 光沢を付ける（半透明の円描画）
    if (this._enableGross) {
        this._drawMeterGross();
    }
};

// 針先端の座標取得
DsairCircularMeter.prototype._cPoint = function (center, hookLength, radian) {
    return {
        x: center.x + hookLength * Math.cos(radian),
        y: center.y + hookLength * Math.sin(radian)
    };
};

//

DsairCircularMeter.prototype.onDrawMeter = function (inValue, inLocDir) {
    if (inValue < 0) {
        inValue = 0;
    } else if (inValue > (this._internalMeterRange - 1)) {
        inValue = this._internalMeterRange - 1;
    }
    this._locSpeed = inValue;
    this._locDir = inLocDir;
    this._drawMeter();
};

DsairCircularMeter.prototype.setMeterMaxValue = function (inMeterMaxValue) {
    this._meterMaxSpeed = inMeterMaxValue;
    if (this._canvas == null) {
        return;
    }

    //Background readraw
    this._drawMeterBackground();

    // Pin readraw
    this._drawMeter();
};

DsairCircularMeter.prototype._setControlInfo = function () {
    if (this._meterController == null) {
        return;
    } 
    this._meterController.setControlInfo({
        canvas: this._canvas,
        meterStartDeg: this._meterStartDeg,
        meterRangeDeg: this._meterRangeDeg,
        hLen: this._hLen,
        center: this._center
    });
};
