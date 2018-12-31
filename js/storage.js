//
var Storage = function () {
	this._gEnableLoad = 0;
	this._gLoading = 0;
	this._dblLocArray = [];
	this._LocProtocol = this._defaultLocProtocol;
	this._AccProtocol = this._defaultAccProtocol;
	this._LocMeterMaxSpeed = 0;

	this._AccTypes = [];
	this._MapAccAddr = [];
	this._MapImage = [];
	this._MapWidth = 0;
	this._MapHeight = 0;

	this._onLoadCallbacks = [];
	window.addEventListener('load', this);
};

Storage.prototype._defaultLocProtocol = DsairConst.protocolDCC;	// MM2 or DCC
Storage.prototype._defaultAccProtocol = DsairConst.protocolDCC;	// MM2 or DCC
// Storageに保存する値
Storage.prototype._protocolList = [];
Storage.prototype._protocolList[DsairConst.protocolMM2] = 'MM2';
Storage.prototype._protocolList[DsairConst.protocolDCC] = 'DCC';

Storage.prototype._maxMapImages = 100 * 50;

Storage.prototype.handleEvent = function (e) {
	switch (e.type) {
		case 'load':
			this.Init();
			break;
		default:
			break;
	}
};

// データ読み込み完了コールバック登録
Storage.prototype.addStorageLoadCallback = function (obj) {
	this._onLoadCallbacks.push(obj);
};

//

Storage.prototype.Clear = function () {
	localStorage.clear();
};


Storage.prototype.Save = function () {
	if (this._gEnableLoad == 0) {
		localStorage.setItem('UNIQUEID', 'DSAIR0001');
	}
};

Storage.prototype.SaveLocAddr = function (dblLocArray) {
	if (this._gLoading == 1) {
		return;
	}
	this.Save();
	this._dblLocArray = dblLocArray;
	localStorage.setItem('LOCADDR', this._dblLocArray.join(','));
};

Storage.prototype.SaveProtcolLoc = function (inLocProtocol) {
	if (this._gLoading == 1) {
		return;
	}
	if (inLocProtocol in this._protocolList) {
		this.Save();
		this._LocProtocol = inLocProtocol;
		localStorage.setItem('PROTCOL_LOC', this._protocolList[this._LocProtocol]);
	} else {
		console.info('Invalid loco protocol "%s"', inLocProtocol);
	}
};

Storage.prototype.SaveProtcolAcc = function (inAccProtocol) {
	if (this._gLoading == 1) {
		return;
	}
	
	if (inAccProtocol in this._protocolList) {
		this.Save();
		this._AccProtocol = inAccProtocol;
		localStorage.setItem('PROTCOL_ACC', this._protocolList[this._AccProtocol]);
	} else {
		console.info('Invalid accessory protocol "%s"', inAccProtocol);
	}
};

Storage.prototype.SaveMaxSpeed = function (LocMeterMaxSpeed) {
	if (this._gLoading == 1) {
		return;
	}
	this.Save();
	this._LocMeterMaxSpeed = LocMeterMaxSpeed;
	localStorage.setItem('MAXSPEED_LOC', this._LocMeterMaxSpeed);
};

Storage.prototype.SaveTypeImagesAcc = function (AccTypes) {
	this.Save();
	this._AccTypes = AccTypes;
	localStorage.setItem('ACCTYPEIMAGES', this._AccTypes.join(','));
};

Storage.prototype.SaveMapDatas = function (MapAccAddr, MapImage, MapWidth, MapHeight) {
	this.Save();
	this._MapAccAddr = MapAccAddr;
	this._MapImage = MapImage;
	this._MapWidth = MapWidth;
	this._MapHeight = MapHeight;
	localStorage.setItem('MAPDAT-ACCADDR', this._MapAccAddr.join(','));
	localStorage.setItem('MAPDAT-IMAGE', this._MapImage.join(','));
	localStorage.setItem('MAPDAT-WIDTH', this._MapWidth);
	localStorage.setItem('MAPDAT-HEIGHT', this._MapHeight);
};

//

Storage.prototype.LoadLocAddr = function () {
	//console.log(this._AccProtocol);
	if (this._gEnableLoad == 0) {
		console.log('_gEnableLoad = 0');
		return;
	}

	var aLocArray = localStorage.getItem('LOCADDR');

	if (aLocArray != null) {
		this._dblLocArray = [];
		for (var addr of aLocArray.split(',')) {
			this._dblLocArray.push(parseInt(addr));
		}
	} else {
		console.info('aLocArray = null');
	}
};

Storage.prototype.LoadProtcol = function () {
	if (this._gEnableLoad == 0) {
		return;
	}

	var aLocProtocol = localStorage.getItem('PROTCOL_LOC');
	var aAccProtocol = localStorage.getItem('PROTCOL_ACC');

	if (aLocProtocol != null) {
		this._LocProtocol = aLocProtocol;
	}

	if (aAccProtocol != null) {
		this._AccProtocol = aAccProtocol;
	}
};

Storage.prototype.LoadMaxSpeed = function () {
	if (this._gEnableLoad == 0) {
		return;
	}

	var aLocMaxSpeed_str = localStorage.getItem('MAXSPEED_LOC');

	if (aLocMaxSpeed_str != null) {
		var aLocMaxSpeed = parseInt(aLocMaxSpeed_str);

		if (aLocMaxSpeed > 0) {
			this._LocMeterMaxSpeed = aLocMaxSpeed;
		}
	}
};

Storage.prototype.LoadTypeImagesAcc = function () {
	if (this._gEnableLoad == 0) {
		return;
	}

	var aAccImageArray_str = localStorage.getItem('ACCTYPEIMAGES');

	if (aAccImageArray_str != null) {

		var aAccImageArray_strarray = aAccImageArray_str.split(',');

		this._AccTypes = [];
		for (var accType of aAccImageArray_strarray) {
			this._AccTypes.push(parseInt(accType));
		}
		if (aAccImageArray_strarray.length > DsairConst.maxAccessories) {
			this._AccTypes = this._AccTypes.slice(0, DsairConst.maxAccessories);
		} else if (aAccImageArray_strarray.length < DsairConst.maxAccessories) {
			for (var i = aAccImageArray_strarray.length; i < DsairConst.maxAccessories; i++) {
				this._AccTypes.push(0);
			}
		}
	}
};

Storage.prototype.LoadMapDatas = function () {
	if (this._gEnableLoad == 0) {
		return;
	}

	var aAccAddrArray_str = localStorage.getItem('MAPDAT-ACCADDR');

	if (aAccAddrArray_str != null) {
		var aAccAddrArray_strarray = aAccAddrArray_str.split(',');

		for (var addr of aAccAddrArray_strarray) {
			this._MapAccAddr.push(parseInt(addr));
		}

		for (var i = aAccAddrArray_strarray.length; i < this._maxMapImages; i++) {
			this._MapAccAddr.push(0);
		}
	}

	var aMapImgArray_str = localStorage.getItem('MAPDAT-IMAGE');

	if (aMapImgArray_str != null) {

		var aMapImgArray_strarray = aMapImgArray_str.split(',');

		for (var image of aMapImgArray_strarray) {
			this._MapImage.push(parseInt(image));
		}
		
		for (var i = aMapImgArray_strarray.length; i < this._maxMapImages; i++) {
			this._MapImage.push(0);
		}
	}

	var aMapWidth = localStorage.getItem('MAPDAT-WIDTH');
	var aMapHeight = localStorage.getItem('MAPDAT-HEIGHT');

	console.log(aMapWidth, aMapHeight);
	if (aMapWidth != null) {
		this._MapWidth = aMapWidth;
	}

	if (aMapHeight != null) {
		this._MapHeight = aMapHeight;
	}
};

Storage.prototype.Load = function () {

	if (localStorage.getItem('UNIQUEID') == 'DSAIR0001') {
		// 成功
		this._gEnableLoad = 1;
	}
	else {
		console.log('Not found settings on your localStorage.');
		this._gEnableLoad = 0;
	}
};

//Document Ready
Storage.prototype.Init = function () {
	this._gLoading = 1;

	this.Load();
	this.LoadLocAddr();
	this.LoadProtcol();
	this.LoadMaxSpeed();
	this.LoadTypeImagesAcc();
	this.LoadMapDatas();

	this._gLoading = 0;

	// コールバック呼び出し
	for (var cbObj of this._onLoadCallbacks) {
		cbObj.onDataLoad();
	}
};

// CabControlから呼ばれるメソッド
Storage.prototype.getLocAddr = function () {
	//console.log(this._dblLocArray);
	return this._dblLocArray;
};

Storage.prototype.getMaxSpeed = function () {
	return this._LocMeterMaxSpeed;
};

// CfgControllから呼ばれるメソッド
Storage.prototype.getLocProtocol = function () {
	return this._LocProtocol;
};

Storage.prototype.getAccProtocol = function () {
	//console.log(this._AccProtocol);
	return this._AccProtocol;
};

//
Storage.prototype.getTypeImagesAcc = function () {
	return this._AccTypes;
};

Storage.prototype.getMapInfo = function () {
	return {
		accAddrs: this._MapAccAddr,
		images: this._MapImage,
		width: this._MapWidth,
		height: this._MapHeight
	};
};
