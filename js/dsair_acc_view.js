//
var DsairAccView = function (inCanvasName) {
    this._canvasName = inCanvasName;
    this._controller = null;
    //
    this._loaded = false;
    this._drawn = false;
    this._numColumns = 0;
    this._numRows = 0;
    //画像を事前にロード
    this._imageACC_LS = new Image();
    this._imageACC_LS.src = this._imageDir + '/TURNOUT_LEFT_1.png';
    this._imageACC_LD = new Image();
    this._imageACC_LD.src = this._imageDir + '/TURNOUT_LEFT_2.png';
    this._imageACC_RS = new Image();
    this._imageACC_RS.src = this._imageDir + '/TURNOUT_RIGHT_1.png';
    this._imageACC_RD = new Image();
    this._imageACC_RD.src = this._imageDir + '/TURNOUT_RIGHT_2.png';
    this._imageACC_DSSS = new Image();
    this._imageACC_DSSS.src = this._imageDir + '/DBLSLIPSWITCH_1.png';
    this._imageACC_DSSD = new Image();
    this._imageACC_DSSD.src = this._imageDir + '/DBLSLIPSWITCH_2.png';
    this._imageACC_371S = new Image();
    this._imageACC_371S.src = this._imageDir + '/SIGNAL_76371_BLACK.png';
    this._imageACC_371D = new Image();
    this._imageACC_371D.src = this._imageDir + '/SIGNAL_76371_RED.png';
    this._imageACC_391S = new Image();
    this._imageACC_391S.src = this._imageDir + '/SIGNAL_76391_GREEN.png';
    this._imageACC_391D = new Image();
    this._imageACC_391D.src = this._imageDir + '/SIGNAL_76391_RED.png';

    window.addEventListener('load', this);
};

DsairAccView.prototype._imageDir = DsairConst.documentRootDir + '/c/acc';

DsairAccView.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'load':
            this.onLoad();
            break;
        case 'mousedown':
            this.onClickAccCanvas(e);
            break;
        default:
            break;
    }
};

DsairAccView.prototype.onLoad = function() {
    this._canvas = document.getElementById(this._canvasName);
    this._cv = this._canvas.getContext('2d');
    this._canvas.addEventListener("mousedown", this);
    //this.DrawAccPanel();
    this._loaded = true;
    if (!this._drawn) {
        this.DrawAccPanel();
    }
};

DsairAccView.prototype.addController = function (inController) {
    this._controller = inController;
};

DsairAccView.prototype.setPageSize = function (cols, rows) {
    this._numColumns = cols;
    this._numRows = rows;
}

DsairAccView.prototype.DrawAccPanel = function () {
    if (!this._loaded) {
        return;
    }
    this._drawn = true;
    //cv.save();

    // メーター背景の円描画
    let cvSize = this._canvas.getAttribute('width');
    this._cv.clearRect(0, 0, cvSize, cvSize);

    // Canvasの色、フォント
    this._cv.font = '16px \'arial\'';

    // ポイント表示
    for (let y = 0; y < this._numRows; y++) {
        for (let x = 0; x < this._numColumns; x++) {

            var xx = x * 90 + 1;
            var yy = y * 91 + 1;
            let info = this._controller.getAccInfo(x, y);
            //var index = (y + AccPageNo * 4) * 10 + x;

            this._cv.shadowBlur = 0;
            this._cv.fillStyle = '#EFEFEF';
            this._cv.strokeStyle = '#8F8F8F';
            this._cv.beginPath();
            this._cv.moveTo(xx, yy);
            this._cv.lineTo(xx + 80, yy);
            this._cv.lineTo(xx + 80, yy + 88);
            this._cv.lineTo(xx, yy + 88);
            this._cv.lineWidth = '1px';
            this._cv.lineCap = 'round';
            this._cv.closePath();
            this._cv.fill();
            this._cv.stroke();

            // グラデーション指定
            //
            //
            this._cv.shadowColor = '#9F9F9F';
            this._cv.shadowOffsetX = 0;
            this._cv.shadowOffsetY = 0;
            this._cv.shadowBlur = 8;


            let aImageNo = info.type * 10 + info.status;
            //console.log(x, y, info.type, info.status, aImageNo);
            //異常系はデフォルト表示にする
            if (aImageNo > 51) {
                aImageNo = info.status;
            }

            switch (aImageNo) {
                case 0:
                    this._cv.beginPath();
                    this._cv.arc(xx + 40, yy + 55, 24, 0, Math.PI * 2, false);
                    this._cv.fillStyle = 'red';
                    this._cv.fill();
                    break;

                case 1:
                    this._cv.beginPath();
                    this._cv.arc(xx + 40, yy + 55, 24, 0, Math.PI * 2, false);
                    this._cv.fillStyle = 'green';
                    this._cv.fill();
                    break;
                case 10:
                    //left diverse
                    this._cv.drawImage(this._imageACC_LD, xx + 25, yy + 22, 32, 64);
                    break;
                case 11:
                    //left straight
                    this._cv.drawImage(this._imageACC_LS, xx + 25, yy + 22, 32, 64);
                    break;
                case 20:
                    //Right diverse
                    this._cv.drawImage(this._imageACC_RD, xx + 25, yy + 22, 32, 64);
                    break;
                case 21:
                    //Right straight
                    this._cv.drawImage(this._imageACC_RS, xx + 25, yy + 22, 32, 64);
                    break;
                case 30:
                    //Double slip diverse
                    this._cv.drawImage(this._imageACC_DSSD, xx + 25, yy + 22, 32, 64);
                    break;
                case 31:
                    //Double slip straight
                    this._cv.drawImage(this._imageACC_DSSS, xx + 25, yy + 22, 32, 64);
                    break;
                case 40:
                    //Signal diverse
                    this._cv.drawImage(this._imageACC_371D, xx + 25, yy + 22, 32, 64);
                    break;
                case 41:
                    //Signal straight
                    this._cv.drawImage(this._imageACC_371S, xx + 25, yy + 22, 32, 64);
                    break;
                case 50:
                    //Signal diverse
                    this._cv.drawImage(this._imageACC_391D, xx + 25, yy + 22, 32, 64);
                    break;
                case 51:
                    //Signal straight
                    this._cv.drawImage(this._imageACC_391S, xx + 25, yy + 22, 32, 64);
                    break;
            }

            this._cv.fillStyle = '#000000';
            this._cv.fillText((info.index + 1).toString(), xx + 5, yy + 20);
        }
    }
};

DsairAccView.prototype.onClickAccCanvas = function (e) {
    e.preventDefault();

    let rect = e.target.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let xx = Math.floor(x / 90);
    let yy = Math.floor(y / 91);

    let index = yy * this._numColumns + xx;
    this._controller.onClickAccCanvas(index);
}
