// Flashair interfaces
var FlashairUtil = function () {
	this._uploadArgs = null;
	this._mkdirArgs = null;
	this._writable = false;
};

//

FlashairUtil.prototype._httpMethodGet = 'GET';
FlashairUtil.prototype._httpMethodPost = 'POST';
FlashairUtil.prototype._commandBase = '/command.cgi';
FlashairUtil.prototype._commandOp = '?op='
FlashairUtil.prototype._commandAddr = '&ADDR=';
FlashairUtil.prototype._commandLen = '&LEN=';
FlashairUtil.prototype._commandData = '&DATA=';
FlashairUtil.prototype._configBase = '/configure.cgi';
FlashairUtil.prototype._configMasterCode = '?MASTERCODE=';
FlashairUtil.prototype._configUrlAppSSID = '&APPSSID=';
FlashairUtil.prototype._configNetworkKey = '&APPNETWORKKEY=';
FlashairUtil.prototype._configUrlTIMEZONE = '&TIMEZONE=';
FlashairUtil.prototype._uploadBase = '/upload.cgi';
FlashairUtil.prototype._uploadDir = '?UPDIR=';
FlashairUtil.prototype._uploadSystemTime = '?FTIME=';
FlashairUtil.prototype._uploadWriteProtect = '?WRITEPROTECT=';
FlashairUtil.prototype._timeZone = 36;

//

FlashairUtil.prototype.httpRequest = function (httpMethod, url, respCb, errCb, content) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status != 200) {
				if (errCb != null) {
					errCb(xhr.status);
				} else {
					console.info(xhr.status);
				}
			}
		}
	}
	if (respCb != null) {
		xhr.onload = function() {
			respCb(xhr.responseText);
		}
	}
	xhr.open(httpMethod, url);
	if (content == null) {
		xhr.send();
	} else {
		xhr.send(content);
	}
};

FlashairUtil.prototype.requestCommand = function (op, arg, respCb, errCb) {
	var url = this._commandBase + this._commandOp + op.toString() + arg;
	this.httpRequest(this._httpMethodGet, url, respCb, errCb, null);
};

FlashairUtil.prototype.requestSimpleCommand = function (op, optarg, respCb, errCb) {
	var url = this._commandBase + this._commandOp + op.toString();
	if (optarg != null) {
		url += '&' + optarg;
	}
	this.httpRequest(this._httpMethodGet, url, respCb, errCb, null);
};

FlashairUtil.prototype.requestConfig = function(mastercode, args) {
	var url = this._configBase + this._configMasterCode + mastercode + args
	this.httpRequest(this._httpMethodGet, url,
		null, null, null);
};

FlashairUtil.prototype.setParams = function (mastercode, appssid, appnetworkkey) {
	var arg = this._configUrlAppSSID + appssid +
	this._configNetworkKey + appnetworkkey +
	this._configUrlTIMEZONE + this._timeZone.toString();
	this.requestConfig(mastercode, arg);
};

FlashairUtil.prototype.readShmem = function (start, length, respCb, errCb) {
	var arg = this._commandAddr + start.toString() + this._commandLen + length.toString();
	this.requestCommand(130, arg, respCb, errCb);
};

FlashairUtil.prototype.writeShmem = function (start, length, data, respCb, errcb) {
	var arg = this._commandAddr + start.toString() + this._commandLen + length.toString() + this._commandData + data;
	this.requestCommand(131, arg, respCb, errcb);
};

FlashairUtil.prototype.sendCommand = function (arg) {
	this.writeShmem(0, 64, arg, null, null);
};

FlashairUtil.prototype.getJson = function (filename, callbackObject, callbackMethod) {
	var jsonURL = filename;
	console.log(jsonURL);
	var getJsonArgs = {
		callbackObject: callbackObject,
		callbackMethod: callbackMethod
	};
	this.httpRequest(this._httpMethodGet, jsonURL,
		function (data) {
			var parsedObj = null;
			try {
				parsedObj = JSON.parse(data);
			} catch (e) {
				console.info(e);
				console.info('request = "%s"', jsonURL);
				console.info(data);
			}
			getJsonArgs.callbackObject[getJsonArgs.callbackMethod](parsedObj);
		},
		function (status) {
			console.info(status);
			console.info('request = "%s"', jsonURL);
			getJsonArgs.callbackObject[getJsonArgs.callbackMethod](null);
		}
	);
};

FlashairUtil.prototype.postFileRequest = function (dirname, filename, content,
	callbackObject, callbackMethod) {
	if (this._uploadArgs != null) {
		callbackObject[callbackMethod](false, 'busy');
	}
	this._uploadArgs = {
		dir: dirname,
		file: filename,
		content: content,
		callbackObject: callbackObject,
		callbackMethod: callbackMethod
	};
	if (this._writable) {
		this.setUploadDir();
	} else {
		this.setWritable();
	}
};

FlashairUtil.prototype.setWritable = function () {
	var self = this;
	var url = this._uploadBase + this._uploadWriteProtect + 'ON';
	this.httpRequest(this._httpMethodGet, url,
	function (data) {
		if (data != 'SUCCESS') {
			self._uploadArgs.callbackObject[self._uploadArgs.callbackMethod](false, 'write protect');
			self._uploadArgs = null;
		} else {
			self._writable = true;
			self.setUploadDir();
		}
	},
	null);
};

FlashairUtil.prototype.setUploadDir = function () {
	var url = this._uploadBase + this._uploadDir + this._uploadArgs.dir;
	this.httpRequest(this._httpMethodGet, url,
		function (data) {
			if (data != 'SUCCESS') {
				self._uploadArgs.callbackObject[self._uploadArgs.callbackMethod](false, 'upload directory');
				self._uploadArgs = null;
			} else {
				self.setUploadTime();
			}
		},
		null);
};

FlashairUtil.prototype.setUploadTime = function () {
	var timeStamp = this.getTimeStampForFAT();
	var url = this._uploadBase + this._uploadSystemTime + '0x' + timeStamp.toString(16);
	this.httpRequest(this._httpMethodGet, url,
		function (data) {
			if (data != 'SUCCESS') {
				self._uploadArgs.callbackObject[self._uploadArgs.callbackMethod](false, 'set sysyem time');
				self._uploadArgs = null;
			} else {
				self.uploadTime();
			}
		},
		null);
};

FlashairUtil.prototype.uploadFile = function () {
	var url = this._uploadBase;
	this.httpRequest(this._httpMethodPost, url,
		function (data) {
			if (data != 'SUCCESS') {
				self._uploadArgs.callbackObject[self._uploadArgs.callbackMethod](false, 'upload file');
			} else {
				self._uploadArgs.callbackObject[self._uploadArgs.callbackMethod](true, 'upload file');
			}
			self._uploadArgs = null;
		},
		null, self._uploadArgs.content);
};

FlashairUtil.prototype.getTimeStampForFAT = function () {
	var now = new Date();

	var year = now.getFullYear() - 1980;
	var month = now.getMonth() + 1;
	var day = now.getDate();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var second = now.getSeconds() / 2;
	var timeStamp = (year << 25) | (month << 21) | (day << 16) |
		(hour << 11) | (minute << 5) | second;
	return timeStamp;
};

FlashairUtil.prototype.makeDirectoryRequest = function (dirbase, dirname,
	callbackObject, callbackMethod) {

	if (this._mkdirArgs != null) {
		callbackObject[callbackMethod](false, 'busy');
	}
	this._mkdirArgs = {
		dirbase: dirbase,
		dirname: dirname,
		callbackObject: callbackObject,
		callbackMethod: callbackMethod
	};
	if (this._writable) {
		this.setMakeDir();
	} else {
		this.setWritableDir();
	}
};

FlashairUtil.prototype.setWritableDir = function () {
	var self = this;
	var url = this._uploadBase + this._uploadWriteProtect + 'ON';
	this.httpRequest(this._httpMethodGet, url,
	function (data) {
		if (data != 'SUCCESS') {
			self._mkdirArgs.callbackObject[self._mkdirArgs.callbackMethod](false, 'write protect');
			self._mkdirArgs = null;
		} else {
			self._writable = true;
			self.makeDirectory();
		}
	},
	null);
};

FlashairUtil.prototype.makeDirectory = function () {
	var url = this._uploadBase + this._uploadDir + this._mkdirArgs.dirbase + '/' +  this._mkdirArgs.dirname;
	this.httpRequest(this._httpMethodGet, url,
		function (data) {
			if (data != 'SUCCESS') {
				self._mkdirArgs.callbackObject[self._mkdirArgs.callbackMethod](false, 'make directory');
			} else {
				self._mkdirArgs.callbackObject[self._mkdirArgs.callbackMethod](true, 'make directory');
			}
			self._mkdirArgs = null;
		},
		null);
};
