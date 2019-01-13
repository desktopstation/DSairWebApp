var DsairMapPanelView = function (inCanvasName) {
    this._canvasName = inCanvasName;
    this._controller = null;
    this._chipIndex = 0;
    this._canvas = null;
    this._cv = null;
    this._canvasWidth = 0;
    this._canvasHeight = 0;
    this._chipSize = 0;
    this._mapWidth = 0;
    this._mapHeight = 0;
    this._imagMapData = new Image();
    this._imagMapData.src = this._imageFile;
    this._loaded = false;

    window.addEventListener('DOMContentLoaded', this);
    window.addEventListener('load', this);
};

DsairMapPanelView.prototype._imageFile = DsairConst.documentRootDir + '/c/acc/RAILMAP.png';

DsairMapPanelView.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'DOMContentLoaded':
            this.onLoad();
            break;
        case 'load':
            this.onLoad();
            break;
        case 'mousedown':
            this.onClickLayoutCanvas(e);
            break;
        default:
            break;
    }
};

DsairMapPanelView.prototype.onLoad = function() {
    if (this._loaded) {
        return;
    }
    this._loaded = true;
    if (this._canvas == null) {
        this._canvas = document.getElementById(this._canvasName);
        this._cv = this._canvas.getContext('2d');
        this._canvasWidth = this._canvas.getAttribute('width');
        this._canvasHeight = this._canvas.getAttribute('height');
    }
    this._canvas.addEventListener('mousedown', this);
    var self = this;
    $('#mapboxMain').scroll(function() {
        self.DrawLayoutPanel();
    });
    this.DrawLayoutPanel();
};

DsairMapPanelView.prototype.addController = function (inController) {
    this._controller = inController;
};

DsairMapPanelView.prototype.setSize = function (inChipSize, inWidth, inHeight) {
    this._chipSize = inChipSize;
    this._mapWidth = inWidth;
    this._mapHeight = inHeight;
};

DsairMapPanelView.prototype.onClickLayoutCanvas = function (e) {

    e.preventDefault();

    var rect = e.target.getBoundingClientRect();

    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var xx = Math.floor(x / this._chipSize);
    var yy = Math.floor(y / this._chipSize);

    this._chipIndex = (yy * this._mapWidth) + xx;

    this._controller.onClickLayoutPanel(this._chipIndex);
};

DsairMapPanelView.prototype.DrawLayoutPanel = function () {
    if (!this._loaded) {
        return;
    }
    if (this._canvas == null) {
        this._canvas = document.getElementById(this._canvasName);
        this._cv = this._canvas.getContext('2d');
        this._canvasWidth = this._canvas.getAttribute('width');
        this._canvasHeight = this._canvas.getAttribute('height');
    }
    var aTileImageOffset = 26;

    this._cv.clearRect(0, 0, this._canvasWidth, this._canvasHeight);

    this._cv.shadowBlur = 0;
    this._cv.fillStyle = '#000000';
    this._cv.strokeStyle = '#202020';
    this._cv.beginPath();
    this._cv.moveTo(0, 0);
    this._cv.lineTo(0 + this._mapWidth * this._chipSize, 0);
    this._cv.lineTo(0 + this._mapWidth * this._chipSize, 0 + this._mapHeight * this._chipSize);
    this._cv.lineTo(0, 0 + this._mapHeight * this._chipSize);
    this._cv.lineWidth = '1px';
    this._cv.lineCap = 'round';
    this._cv.closePath();
    this._cv.fill();
    this._cv.stroke();

    var aScrollY = Math.floor($('#mapboxMain').scrollTop() / this._chipSize);
    var aScrollX = Math.floor($('#mapboxMain').scrollLeft() / this._chipSize);

    this._cv.font = '14px \'arial\'';

    for (var y = aScrollY; y < aScrollY + 15; y++) {
        for (var x = aScrollX; x < aScrollX + 20; x++) {

            var xx = x * this._chipSize;
            var yy = y * this._chipSize;

            var aIndex = y * this._mapWidth + x;

            var aMapImage = this._controller.getMapImage(aIndex);
            var aMapAccAddr = this._controller.getMapAccAddr(aIndex);
            var aChipToolIndex = this._controller.getChipToolIndex();
            if (aMapImage > 1) {
                var aImageX = aMapImage % 4;
                var aImageY = Math.floor(aMapImage / 4);

                if ((aMapImage < 10) || (aChipToolIndex > 1)) {
                    this._cv.drawImage(this._imagMapData,
                        this._chipSize * aImageX, this._chipSize * aImageY, 
                        this._chipSize, this._chipSize,
                        xx, yy, this._chipSize, this._chipSize);
                } else if (aMapAccAddr > 0) {
                    var aAccStatus = this._controller.getAccStatus(aMapAccAddr - 1);

                    if (aMapImage >= 20) {
                        aTileImageOffset = 24;
                    } else {
                        //Nothig to do
                        aTileImageOffset = 26;
                    }

                    var aImageX2 = Math.floor((Math.floor(aMapImage) + aTileImageOffset) % 4);
                    var aImageY2 = Math.floor((Math.floor(aMapImage) + aTileImageOffset) / 4);

                    aImageY2 += (aAccStatus == 0 ? 6 : 0);
                    this._cv.drawImage(this._imagMapData,
                        this._chipSize * aImageX2, this._chipSize * aImageY2,
                        this._chipSize, this._chipSize,
                        xx, yy, this._chipSize, this._chipSize);
                        
                    if (aAccStatus == 0) {
                        this._cv.beginPath();
                        this._cv.arc(xx + 5, yy + 5, 4, 0, Math.PI * 2, false);
                        this._cv.lineWidth = '0px';
                        this._cv.fillStyle = 'red';
                        this._cv.fill();
                    } else {
                        this._cv.beginPath();
                        this._cv.arc(xx + 5, yy + 5, 4, 0, Math.PI * 2, false);
                        this._cv.lineWidth = '0px';
                        this._cv.fillStyle = 'green';
                        this._cv.fill();
                    }

                    // Address 

                    if (aChipToolIndex == 1) {
                        this._cv.fillStyle = '#FF00FF';
                        this._cv.fillText(aMapAccAddr, xx + 5, yy + 14);
                    }
                } else {
                    //
                    this._cv.drawImage(this._imagMapData,
                        this._chipSize * aImageX, this._chipSize * aImageY, 
                        this._chipSize, this._chipSize, 
                        xx, yy, this._chipSize, this._chipSize);
                }
            }
        }
    }

    this._cv.lineWidth = '1px';

    // grid
    for (var ay = aScrollY; ay < aScrollY + 15; ay++) {
        this._cv.moveTo(aScrollX * this._chipSize, ay * this._chipSize);
        this._cv.lineTo((aScrollX + 20) * this._chipSize, ay * this._chipSize);
        this._cv.closePath();
        this._cv.stroke();
    }

    for (var ax = aScrollX; ax < aScrollX + 20; ax++) {
        this._cv.moveTo(ax * this._chipSize, aScrollY * this._chipSize);
        this._cv.lineTo(ax * this._chipSize, (aScrollY + 15) * this._chipSize);
        this._cv.closePath();
        this._cv.stroke();
    }

    //selected item
    this._cv.strokeStyle = '#F02020';
    this._cv.beginPath();
    this._cv.rect((this._chipIndex % this._mapWidth) * this._chipSize, Math.floor(this._chipIndex / this._mapWidth) * this._chipSize, this._chipSize, this._chipSize);
    this._cv.closePath();
    this._cv.stroke();
};

