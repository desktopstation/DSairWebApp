// Flashair interfaces
var FlashairUtil = function () {
	this._writable = false;
};

//

FlashairUtil._httpMethodGet = 'GET';
FlashairUtil._httpMethodPost = 'POST';
FlashairUtil._commandBase = '/command.cgi';
FlashairUtil._commandOp = '?op='
FlashairUtil._commandAddr = '&ADDR=';
FlashairUtil._commandLen = '&LEN=';
FlashairUtil._commandData = '&DATA=';
FlashairUtil._configBase = '/configure.cgi';
FlashairUtil._configMasterCode = '?MASTERCODE=';
FlashairUtil._configUrlAppSSID = '&APPSSID=';
FlashairUtil._configNetworkKey = '&APPNETWORKKEY=';
FlashairUtil._configUrlTIMEZONE = '&TIMEZONE=';
FlashairUtil._uploadBase = '/upload.cgi';
FlashairUtil._uploadDir = '?UPDIR=';
FlashairUtil._uploadSystemTime = '?FTIME=';
FlashairUtil._uploadWriteProtect = '?WRITEPROTECT=';
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
	var url = FlashairUtil._commandBase + FlashairUtil._commandOp + op.toString() + arg;
	this.httpRequest(FlashairUtil._httpMethodGet, url, respCb, errCb, null);
};

FlashairUtil.prototype.requestSimpleCommand = function (op, optarg, respCb, errCb) {
	var url = FlashairUtil._commandBase + FlashairUtil._commandOp + op.toString();
	if (optarg != null) {
		url += '&' + optarg;
	}
	this.httpRequest(FlashairUtil._httpMethodGet, url, respCb, errCb, null);
};

FlashairUtil.prototype.requestConfig = function(mastercode, args) {
	var url = FlashairUtil._configBase + FlashairUtil._configMasterCode + mastercode + args
	this.httpRequest(FlashairUtil._httpMethodGet, url,
		null, null, null);
};

FlashairUtil.prototype.setParams = function (mastercode, appssid, appnetworkkey) {
	var arg = FlashairUtil._configUrlAppSSID + appssid +
	FlashairUtil._configNetworkKey + appnetworkkey +
	FlashairUtil._configUrlTIMEZONE + this._timeZone.toString();
	this.requestConfig(mastercode, arg);
};

FlashairUtil.prototype.readShmem = function (start, length, respCb, errCb) {
	var arg = FlashairUtil._commandAddr + start.toString() + FlashairUtil._commandLen + length.toString();
	this.requestCommand(130, arg, respCb, errCb);
};

FlashairUtil.prototype.writeShmem = function (start, length, data, respCb, errcb) {
	var arg = FlashairUtil._commandAddr + start.toString()
		+ FlashairUtil._commandLen + length.toString() + FlashairUtil._commandData + data;
	this.requestCommand(131, arg, respCb, errcb);
};

FlashairUtil.prototype.sendCommand = function (arg) {
	this.writeShmem(0, 64, arg, null, null);
};

FlashairUtil.prototype.getFile = function (filename, callbackObject, callbackMethod, optarg) {
	console.log(filename);
	this.httpRequest(FlashairUtil._httpMethodGet, filename,
		function (data) {
			callbackObject[callbackMethod](data, optarg);
		},
		function (status) {
			console.info(status);
			console.info('request = "%s"', filename);
			callbackObject[callbackMethod](null, optarg);
		}
	);
};

FlashairUtil.prototype.postFileRequest = function (dirname, filename, content,
	callbackObject, callbackMethod) {

	var uploadArgs = {
		dir: dirname,
		file: filename,
		content: content,
		callbackObject: callbackObject,
		callbackMethod: callbackMethod
	};
	if (this._writable) {
		this.setUploadDir(uploadArgs);
	} else {
		this.setWritable(uploadArgs);
	}
};

FlashairUtil.prototype.setWritable = function (uploadArgs) {
	var self = this;
	var url = FlashairUtil._uploadBase + FlashairUtil._uploadWriteProtect + 'ON';
	this.httpRequest(FlashairUtil._httpMethodGet, url,
		function (data) {
			if (data != 'SUCCESS') {
				uploadArgs.callbackObject[uploadArgs.callbackMethod](false, 'write protect');
			} else {
				self._writable = true;
				self.setUploadDir(uploadArgs);
			}
		},
		null);
};

FlashairUtil.prototype.setUploadDir = function (uploadArgs) {
	var url = FlashairUtil._uploadBase + FlashairUtil._uploadDir + uploadArgs.dir;
	this.httpRequest(FlashairUtil._httpMethodGet, url,
		function (data) {
			if (data != 'SUCCESS') {
				uploadArgs.callbackObject[uploadArgs.callbackMethod](false, 'upload directory');
			} else {
				self.setUploadTime(uploadArgs);
			}
		},
		null);
};

FlashairUtil.prototype.setUploadTime = function (uploadArgs) {
	var timeStamp = this.getTimeStampForFAT();
	var url = FlashairUtil._uploadBase + FlashairUtil._uploadSystemTime + '0x' + timeStamp.toString(16);
	this.httpRequest(FlashairUtil._httpMethodGet, url,
		function (data) {
			if (data != 'SUCCESS') {
				uploadArgs.callbackObject[uploadArgs.callbackMethod](false, 'set sysyem time');
			} else {
				self.uploadTime(uploadArgs);
			}
		},
		null);
};

FlashairUtil.prototype.uploadFile = function (uploadArgs) {
	var url = FlashairUtil._uploadBase;
	this.httpRequest(FlashairUtil._httpMethodPost, url,
		function (data) {
			if (data != 'SUCCESS') {
				uploadArgs.callbackObject[uploadArgs.callbackMethod](false, 'upload file');
			} else {
				uploadArgs.callbackObject[uploadArgs.callbackMethod](true, 'upload file');
			}
		},
		null, uploadArgs.content);
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

	var mkdirArgs = {
		dirbase: dirbase,
		dirname: dirname,
		callbackObject: callbackObject,
		callbackMethod: callbackMethod
	};
	if (this._writable) {
		this.setMakeDir(mkdirArgs);
	} else {
		this.setWritableDir(mkdirArgs);
	}
};

FlashairUtil.prototype.setWritableDir = function (mkdirArgs) {
	var self = this;
	var url = FlashairUtil._uploadBase + FlashairUtil._uploadWriteProtect + 'ON';
	this.httpRequest(FlashairUtil._httpMethodGet, url,
	function (data) {
		if (data != 'SUCCESS') {
			mkdirArgs.callbackObject[mkdirArgs.callbackMethod](false, 'write protect');
		} else {
			self._writable = true;
			self.makeDirectory();
		}
	},
	null);
};

FlashairUtil.prototype.makeDirectory = function (mkdirArgs) {
	var url = FlashairUtil._uploadBase + FlashairUtil._uploadDir + this._mkdirArgs.dirbase + '/' +  mkdirArgs.dirname;
	this.httpRequest(FlashairUtil._httpMethodGet, url,
		function (data) {
			if (data != 'SUCCESS') {
				mkdirArgs.callbackObject[mkdirArgs.callbackMethod](false, 'make directory');
			} else {
				mkdirArgs.callbackObject[mkdirArgs.callbackMethod](true, 'make directory');
			}
		},
		null);
};
