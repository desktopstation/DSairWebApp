//
var DsairMapControl = function () {
    this._mapToolView = null;
    this._mapPanelView = null;
    this._storage = null;
    this._accManager = null;
    this._msgDialog = null;
    this._addressInputDialog = null;
    this._command = null;
    this._toast = null;

    this._ChipToolIndex = 0;
    this._ChipIndex = 0;
    this._mapAccAddr = [];
    this._mapImage = [];
    this._mapWidth = this._defaultMapWidth;
    this._mapHeight = this._defaultMapHeight;
    let len = this._MaxWidth * this._MaxHeight;
    for (let i = 0; i <  len; i++) {
        this._Map_AccAddr.push(0);
        this._Map_Image.push(0);
    }
};

DsairMapControl.prototype._defaultMapWidth = 100;
DsairMapControl.prototype._defaultMapHeight = 50;
DsairMapControl.prototype._chipSize = 48;
DsairMapControl.prototype._chipToolAddressable = 10;
DsairMapControl.prototype._mapFilename = 'mapdata.json'; 

DsairMapControl.prototype.addStorage = function (inStorage) {
    this._storage = inStorage;
    this._storage.addStorageLoadCallback(this);
};

DsairMapControl.prototype.addToolView = function (inView) {
    this._mapToolView = inView;
    this._mapToolView.addController(this);
    this._mapToolView.setSize(this._chipSize, this._mapWidth, this._mapHeight);
};

DsairMapControl.prototype.addPanelView = function (inView) {
    this._mapPanelView = inView;
    this._mapPanelView.addController(this);
    this._mapPanelView.setSize(this._chipSize, this._mapWidth, this._mapHeight);
};

DsairMapControl.prototype.addAccManager = function (inManager) {
    this._accManager = inManager;
};

DsairMapControl.prototype.addMsgDialog = function (inDialog) {
    this._msgDialog = inDialog;
};

DsairMapControl.prototype.addAddressInputDialog = function (inDialog) {
    this._addressInputDialog = inDialog;
};

DsairMapControl.prototype.addDsairCommand = function (inCommand) {
    this._dsairCommand = inCommand;
};

DsairMapControl.prototype.addToast = function (inToast) {
    this._toast = inToast;
};

//

DsairMapControl.prototype.onClickSaveMaps = function () {
    this._storage.SaveMapDatas(this._mapAccAddr, this._mapImage, this._mapWidth, this._mapHeight);
    this._msgDialog.open('<b>Map data saved!</b>', false, null, '');
};

DsairMapControl.prototype.setToolIndex = function (inChipToolIndex) {
    this._ChipToolIndex = inChipToolIndex;
    let msg = null;
    switch (this._ChipToolIndex) {
        case 0:
            msg = 'Accessory operation mode';
            break;
        case 1:
            msg = 'Accessory address edit mode';
            break;
        default:
            break;
    }
    if (msg != null) {
        this._toast.show(msg);
    }
    this._mapToolView.DrawLayoutTool();
    this._mapPanelView.DrawLayoutPanel();
};

DsairMapControl.prototype.onClickLayoutPanel = function (inChipIndex) {
    this._ChipIndex = inChipIndex;
    //console.log(inChipIndex);
    if (this._ChipToolIndex == 0) {
        // 操作モード
        if (this._mapImage[this._ChipIndex] < this._chipToolAddressable) {
            this._toast.show('This chip has no functions.');
        } else {
            if (this._mapAccAddr[this._ChipIndex] > 0) {
                let ret = this._accManager.changeAcc(this._mapAccAddr[inChipIndex] - 1);
                if (!ret) {
                    this._toast.show('The power is off.');
                }
            } else {
                this._toast.show('The accessory address do not assigned.');
            }
        }
    } else if (this._ChipToolIndex == 1) {
        // アドレス設定モード
        if (this._mapImage[this._ChipIndex] < this._chipToolAddressable) {
            this._toast.show('Can not assign accessory addres on this chip .');
        } else {
            this._addressInputDialog.open(this._mapAccAddr[this._ChipIndex], this, 'addressInputCallback', null);
            // 再描画はcallbackで実施するので、returnする
            return;
        }
    } else {
        // 線路描画モード
        this._mapImage[this._ChipIndex] = this._ChipToolIndex;
    }
    this._mapToolView.DrawLayoutTool();
    this._mapPanelView.DrawLayoutPanel();
};

DsairMapControl.prototype.addressInputCallback = function (arg) {
    this._mapAccAddr[this._ChipIndex] = arg.addr;
    this._mapToolView.DrawLayoutTool();
    this._mapPanelView.DrawLayoutPanel();
};

DsairMapControl.prototype.onClickClearMaps = function ()  {
    this.ClearMaps();
    this._mapToolView.DrawLayoutTool();
    this._mapPanelView.DrawLayoutPanel();
    this._msgDialog.open('Layout data cleared!', false, null, '');
};

DsairMapControl.prototype.ClearMaps = function () {
    let len = this._mapWidth * this._mapHeight;
    for (let i = 0; i < len; i++) {
        this._mapAccAddr[i] = 0;
        this._mapImage[i] = 0;
    }
};

DsairMapControl.prototype.getMapAccAddr = function (inIndex) {
    return this._mapAccAddr[inIndex];
};

DsairMapControl.prototype.getMapImage = function (inIndex) {
    return this._mapImage[inIndex];
};

DsairMapControl.prototype.changeAcc = function (inIndex) {
    this._accManager.changeAcc(inIndex);
};

DsairMapControl.prototype.getAccStatus = function (inIndex) {
    return this._accManager.getAccStatus(inIndex);
};

DsairMapControl.prototype.getChipToolIndex = function () {
    return this._ChipToolIndex;
};

// 保存していた値を復旧する
DsairMapControl.prototype.onDataLoad = function () {
    this._onDataLoad(this._storage.getMapInfo());
};

DsairMapControl.prototype._onDataLoad = function (inMapInfo) {
    if (inMapInfo == null || inMapInfo.width == 0 || inMapInfo.height == 0) {
        let n = this._mapWidth * this._mapHeight;
        this._mapAccAddr = [];
        this._mapImage = [];
        for (let i = 0; i < n; i++) {
            this._mapAccAddr.push(0);
            this._mapImage.push(0);
        }
    } else {
        this._mapWidth = inMapInfo.width;
        this._mapHeight = inMapInfo.height;
        this._mapAccAddr = inMapInfo.accAddrs;
        this._mapImage = inMapInfo.images;
    }
    this._mapPanelView.DrawLayoutPanel();
};

DsairMapControl.prototype.download = function () {
    let mapinfo = {
        width: this._mapWidth,
        height: this._mapHeight,
        accAddrs: this._mapAccAddr,
        images: this._mapImage
    };
    let jsonObj = JSON.stringify(mapinfo);
    this._dsairCommand.download(this._mapFilename, jsonObj);
};

DsairMapControl.prototype.upload = function () {
    console.log('upload');
    this._dsairCommand.upload(this, 'uploadCallback', '.json, text/plain');
};

DsairMapControl.prototype.uploadCallback = function (data, filename) {
    this._mapFilename = filename;
    let parsedObj = null;
    try {
        parsedObj = JSON.parse(data);
        console.log(parsedObj);
    } catch (e) {
        console.info(e);
    }
    this._onDataLoad(parsedObj);
};

DsairMapControl.prototype.onActivate = function () {
    this._mapPanelView.DrawLayoutPanel();
};
