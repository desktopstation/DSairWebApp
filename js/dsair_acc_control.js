
//
var DsairAccControl = function () {

    // アクセサリ関係
    this._storage = null;
    this._accView = null;
    this._accManager = null;
    this._toast = null;

    this._AccPageNo = 0;
    this._AccTypes = [];
    for (var i = 0; i < DsairConst.maxAccessories; i++) {
        this._AccTypes.push(0);
    }
    this._CenterX = 0;
    this._CenterY = 0;
    this._modeAccEdit = this._operationMode;
};

DsairAccControl.prototype._defaultAccProtocol = DsairConst.protocolDCC;
DsairAccControl.prototype._numRows = 4;
DsairAccControl.prototype._numColumns = 10;
DsairAccControl.prototype._accPerPage = DsairAccControl.prototype._numRows * DsairAccControl.prototype._numColumns;
DsairAccControl.prototype._numPages = 50;
DsairAccControl.prototype._operationMode = 0;   // 操作モード
DsairAccControl.prototype._editMode = 1;        // アクセサリアイコン編集モード

//

DsairAccControl.prototype.addStorage = function (inStorage) {
    this._storage = inStorage;
    this._storage.addStorageLoadCallback(this);
};

// DsairAccControl.prototype.addManager = function (inManager) {
//     this._accManager = inManager;
// }; 

DsairAccControl.prototype.addView = function (inView) {
    this._accView = inView;
    this._accView.addController(this);
    this._accView.setPageSize(this._numColumns, this._numRows);
};

DsairAccControl.prototype.addAccManager = function (inManager) {
    this._accManager = inManager;
    this._accManager.addAccChangeCallback(this);
};

DsairAccControl.prototype.addToast = function (inToast) {
    this._toast = inToast;
};

DsairAccControl.prototype.onClickAccPage = function (inPageCmd) {
    if (inPageCmd == 1) {
        this._AccPageNo++;
        if (this._AccPageNo > this._numPages) {
            this._AccPageNo = 0;
        }
    } else {
        if (this._AccPageNo == 0) {
            this._AccPageNo = this._numPages;
        }
        else {
            this._AccPageNo--;
        }
    }
    this._accView.DrawAccPanel();
};

DsairAccControl.prototype.onSetAccEdit = function (){
    if (this._modeAccEdit == this._operationMode) {
        this._modeAccEdit = this._editMode;
    } else {
        this._modeAccEdit = this._operationMode;

        //操作モードに戻すときに保存
        this._storage.SaveTypeImagesAcc(this._AccTypes);
    }
};

DsairAccControl.prototype.onClickAccCanvas = function (index) {
    index += this._AccPageNo * this._accPerPage;
    console.log(index, this._modeAccEdit);
    switch (this._modeAccEdit) {
        case 0:
            //console.log(index);
            var ret = this._accManager.changeAcc(index);
            if (!ret) {
                this._toast.show('The power is off.');
            }
            break;
        case 1:
            if (this._AccTypes[index] < 5) {
                this._AccTypes[index]++;
            } else {
                this._AccTypes[index] = 0;
            }
            this._accView.DrawAccPanel();
            break;
        default:
            break;
    }
};

DsairAccControl.prototype.onAccValueChange = function (inNo/*, inStatus*/) {
    var base = this._AccPageNo * this._accPerPage;
    console.log(inNo);
    if (inNo < base) {
        return;
    }
    if (inNo >= base + this._accPerPage) {
        return;
    }
    this._accView.DrawAccPanel();
};

DsairAccControl.prototype.getIndex  = function (x, y) {
    return  this._AccPageNo * this._accPerPage + y * this._numColumns + x;
};

DsairAccControl.prototype.getAccInfo = function (x, y) {
    
    var index = this.getIndex(x, y);
    return {
        index: index,
        status: this._accManager.getAccStatus(index),
        type: this._AccTypes[index]
    };
};

// 初期化時に保存していた値を復旧する
DsairAccControl.prototype.onDataLoad = function () {
    var accType = this._storage.getTypeImagesAcc();
    if (accType == null) {
        this._AccType = accType;
    }
    this._accView.DrawAccPanel();
};

DsairAccControl.prototype.onActivate = function () {
    this._accView.DrawAccPanel();
};
