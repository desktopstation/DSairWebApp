var DsairAnalogBar = function (inCanvasName) {
    DsairMeterBase.call(this, inCanvasName);
    this.super = DsairMeterBase.prototype;
    this._canvas = null;
    this._ctx = null;
    this._barWidth = 0;
    this._barHeight = 0;
    this._imgBarMask = new Image();
    this._imgBarMask.src = this.imageFilename;
    window.addEventListener('load', this);
};

inherits(DsairAnalogBar, DsairMeterBase);

DsairAnalogBar.prototype.imageFilename = DsairConst.documentRootDir + '/img/speedobar_mask.png';

DsairAnalogBar.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'load':
            this.onLoad();
            break;
        default:
            break;
    }
};

DsairAnalogBar.prototype.onLoad = function () {
    this._canvas = document.getElementById(this._canvasName);
    this._ctx = this._canvas.getContext('2d');
    this._barWidth = this._canvas.width;
    this._barHeight = this._canvas.height;
    this.onDrawMeter(0, DsairConst.dirFWD);
    this.super.onLoad.call(this);
};

DsairAnalogBar.prototype.onDrawMeter = function (inSpeed/*, inDir*/) {
    if ((this._canvas == null) || (this._ctx == null)) {
        return;
    }
    if (inSpeed < 0) {
        inSpeed = 0;
    } else if (inSpeed > (this._internalMeterRange - 1)) {
        inSpeed = this._internalMeterRange - 1;
    }
    var bar_val = (inSpeed * this._barHeight) / (this._internalMeterRange - 1);

    //灰色に描画
    this._ctx.fillStyle = 'lightgray';
    this._ctx.fillRect(0, 0, this._canvas.width, this._barHeight - bar_val);

    /* 描画 */
    this._ctx.beginPath();
    /* グラデーション領域をセット */
    var grad = this._ctx.createLinearGradient(0, 0, 0, this._barHeight);
    /* グラデーション終点のオフセットと色をセット */
    grad.addColorStop(1, 'rgb(255, 180, 177)'); // 赤
    grad.addColorStop(0, 'rgb(192, 80, 100)'); // 紫
    /* グラデーションをfillStyleプロパティにセット */
    this._ctx.fillStyle = grad;


    this._ctx.rect(0, this._barHeight - bar_val, this._canvas.width, this._barHeight);
    /* 描画 */
    this._ctx.fill();

    this._ctx.drawImage(this._imgBarMask, 0, 0, this._canvas.width, this._canvas.height);
};

DsairAnalogBar.prototype.setMeterMaxValue = function (/*inMeterMaxValue*/) {
    
};

DsairAnalogBar.prototype._setControlInfo = function() {
    if (this._meterController == null) {
        return;
    } 
    this._meterController.setControlInfo({
        canvas: this._canvas,
        width: this._barWidth,
        height: this._barHeight
    });
};

