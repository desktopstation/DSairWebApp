let DsairMapToolView = function (inCanvasName) {
    this._canvasName = inCanvasName;
    this._controller = null;
    this._toolIndex = 0;
    this._canvas = null;
    this._cv = null;
    this._canvasWidth = 0;
    this._canvasHeight = 0;
    this._chipSize = 0;
    this._mapWidth = 0;
    this._mapHeight = 0;
    this._imagMapData = new Image();
    this._imagMapData.src = this._imageFile;
    window.addEventListener('load', this);
};

DsairMapToolView.prototype._imageFile = DsairConst.documentRootDir + '/c/acc/RAILMAP.png';

DsairMapToolView.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'load':
            this.onLoad();
            break;
        case 'mousedown':
            this.onClickLayoutTool(e);
            break;
        default:
            break;
    }
};

DsairMapToolView.prototype.onLoad = function() {
    this._canvas = document.getElementById(this._canvasName);
    this._cv = this._canvas.getContext('2d');
    this._cvWidth = this._canvas.getAttribute('width');
    this._cvHeigt = this._canvas.getAttribute('height');
    this._canvas.addEventListener('mousedown', this);
    this.DrawLayoutTool();
};

DsairMapToolView.prototype.addController = function (inController) {
    this._controller = inController;
};

DsairMapToolView.prototype.setSize = function (inChipSize, inWidth, inHeight) {
    this._chipSize = inChipSize;
    this._mapWidth = inWidth;
    this._mapHeight = inHeight;
};

DsairMapToolView.prototype.onClickLayoutTool = function (e) {

    e.preventDefault(); 

    let rect = e.target.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let xx = Math.floor(x / this._chipSize);
    let yy = Math.floor(y / this._chipSize);

    this._toolIndex = (yy * 2) + xx;

    this._controller.setToolIndex(this._toolIndex);
};

DsairMapToolView.prototype.DrawLayoutTool = function () {

    this._cv.clearRect(0, 0, this._canvasWidth, this._canvusHeigt);

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

    for (let y = 0; y < 12; y++) {
        for (let x = 0; x < 2; x++) {

            let aIndex = y * 2 + x;

            let xx = x * this._chipSize;
            let yy = y * this._chipSize;

            let aImageX = aIndex % 4;
            let aImageY = Math.floor(aIndex / 4);
            
            this._cv.drawImage(this._imagMapData, this._chipSize * aImageX, this._chipSize * aImageY, this._chipSize, this._chipSize, xx, yy, this._chipSize, this._chipSize);
        }
    }

    this._cv.lineWidth = '1px';
    this._cv.strokeStyle = '#202020';

    // grid
    for (let ay = 0; ay < 12; ay++) {
        this._cv.moveTo(0, ay * this._chipSize);
        this._cv.lineTo(this._mapWidth * this._chipSize, ay * this._chipSize);
        this._cv.closePath();
        this._cv.stroke();
    }

    for (let ax = 0; ax < 2; ax++) {
        this._cv.moveTo(ax * this._chipSize, 0);
        this._cv.lineTo(ax * this._chipSize, this._mapHeight * this._chipSize);
        this._cv.closePath();
        this._cv.stroke();

    }

    //selected item
    this._cv.strokeStyle = '#F02020';
    this._cv.beginPath();
    this._cv.rect((this._toolIndex % 2) * this._chipSize, Math.floor(this._toolIndex / 2) * this._chipSize, this._chipSize, this._chipSize);
    this._cv.closePath();
    this._cv.stroke();
};
