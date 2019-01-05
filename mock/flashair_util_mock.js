// 
// 
var FlashairUtilMock = function () {
	FlashairUtil.call(this);
	this.super = FlashairUtil.prototype;
	this._sharedMemory = this._initVal.repeat(512);
	this._isPowerOn = false;
	this._statusInfo = [ 'N', 1, 0, 0, 0, 0, 0, 0];
	this._replyMessage = [0, 0, 0];
	this._replyAcc = ['acc', 'reply'];	// TODO:
	this._locList = [];
	this._locListSeq = 0;
	this.updateShm();
};

inherits(FlashairUtilMock, FlashairUtil);

FlashairUtilMock.prototype._initVal = ' ';
FlashairUtilMock.prototype._masterCode = '9876543210';
FlashairUtilMock.prototype._appSSID = 'Flashair';
FlashairUtilMock.prototype._appNetworkKey = '12345678';
FlashairUtilMock.prototype._flashairFirmwareVersion = 'F15DBW3BW4.00.03';
FlashairUtilMock.prototype._responseTime = 50;// ms
FlashairUtilMock.prototype._responseLength = 264;
FlashairUtilMock.prototype._maxLocNo = 8;
FlashairUtilMock.prototype._jsonData = `
{
    "cvdata": [
    {"cvnum":"1","cvname":"CV1 ShortAddress"},
    {"cvnum":"2","cvname":"CV2 Vstart"},
    {"cvnum":"3","cvname":"CV3 Acceleration Rate"},
    {"cvnum":"4","cvname":"CV4 Deceleration Rate"},
    {"cvnum":"5","cvname":"CV5 Vhigh"},
    {"cvnum":"6","cvname":"CV6 Vmid"},
    {"cvnum":"7","cvname":"CV7 Decoder Version"},
    {"cvnum":"8","cvname":"CV8 Decoder Reset"},
    {"cvnum":"9","cvname":"CV9 Total PWM Period"},
    {"cvnum":"10","cvname":"CV10 EMF Feedback Cutout"},
    {"cvnum":"11","cvname":"CV11 Packet Time-Out Value"},
    {"cvnum":"12","cvname":"CV12 Power Source Conversion"},
    {"cvnum":"13","cvname":"CV13 AltMode FuncStatus F1-F8"},
    {"cvnum":"14","cvname":"CV14 AltMode FuncStatus FL,F9-F12"},
    {"cvnum":"15","cvname":"CV15 Decoder Lock"},
    {"cvnum":"16","cvname":"CV16 Decoder Lock"},
    {"cvnum":"17","cvname":"CV17 Extended Address(L)"},
    {"cvnum":"18","cvname":"CV18 Extended Address(H)"},
	{"cvnum":"19","cvname":"CV19 Consist Address"},
	{"cvnum":"20","cvname":"CV20 NMRA Reserved"},
	{"cvnum":"21","cvname":"CV21 ConsistAddr Active F1-F8"},
	{"cvnum":"22","cvname":"CV22 ConsistAddr Active FL-F9-F12"},
	{"cvnum":"23","cvname":"CV23 Acceleration Adjustment"},
	{"cvnum":"24","cvname":"CV24 Deceleration Adjustment"},
	{"cvnum":"25","cvname":"CV25 SpdTable/Mid-range SpdStep"},
	{"cvnum":"26","cvname":"CV26 NMRA Reserved"},
	{"cvnum":"27","cvname":"CV27 Automatic Stopping Config"},
	{"cvnum":"28","cvname":"CV28 BiDi Communication Config"},
    {"cvnum":"29","cvname":"CV29 Configuration Data"},
	{"cvnum":"30","cvname":"CV30 Error Information"},
	{"cvnum":"31","cvname":"CV31 Index High Byte"},
	{"cvnum":"32","cvname":"CV32 Index Low Byte"},
	{"cvnum":"33","cvname":"CV33 Output Loc.FL(front)"},
	{"cvnum":"34","cvname":"CV34 Output Loc.FL(rear)"},
	{"cvnum":"35","cvname":"CV35 Output Loc.F1"},
	{"cvnum":"36","cvname":"CV36 Output Loc.F2"},
	{"cvnum":"37","cvname":"CV37 Output Loc.F3"},
	{"cvnum":"38","cvname":"CV38 Output Loc.F4"},
	{"cvnum":"39","cvname":"CV39 Output Loc.F5"},
	{"cvnum":"40","cvname":"CV40 Output Loc.F6"},
	{"cvnum":"41","cvname":"CV41 Output Loc.F7"},
	{"cvnum":"42","cvname":"CV42 Output Loc.F8"},
	{"cvnum":"43","cvname":"CV43 Output Loc.F9"},
	{"cvnum":"44","cvname":"CV44 Output Loc.F10"},
	{"cvnum":"45","cvname":"CV45 Output Loc.F11"},
	{"cvnum":"46","cvname":"CV46 Output Loc.F12"},
	{"cvnum":"47","cvname":"CV47 Manufacturer Unique"},
	{"cvnum":"48","cvname":"CV48 Manufacturer Unique"},
	{"cvnum":"49","cvname":"CV49 Manufacturer Unique"},
	{"cvnum":"50","cvname":"CV50 Manufacturer Unique"},
	{"cvnum":"51","cvname":"CV51 Manufacturer Unique"},
	{"cvnum":"52","cvname":"CV52 Manufacturer Unique"},
	{"cvnum":"53","cvname":"CV53 Manufacturer Unique"},
	{"cvnum":"54","cvname":"CV54 Manufacturer Unique"},
	{"cvnum":"55","cvname":"CV55 Manufacturer Unique"},
	{"cvnum":"56","cvname":"CV56 Manufacturer Unique"},
	{"cvnum":"57","cvname":"CV57 Manufacturer Unique"},
	{"cvnum":"58","cvname":"CV58 Manufacturer Unique"},
	{"cvnum":"59","cvname":"CV59 Manufacturer Unique"},
	{"cvnum":"60","cvname":"CV60 Manufacturer Unique"},
	{"cvnum":"61","cvname":"CV61 Manufacturer Unique"},
	{"cvnum":"62","cvname":"CV62 Manufacturer Unique"},
	{"cvnum":"63","cvname":"CV63 Manufacturer Unique"},
	{"cvnum":"64","cvname":"CV64 Manufacturer Unique"},
	{"cvnum":"65","cvname":"CV65 Kick Start"},
	{"cvnum":"66","cvname":"CV66 Forward Trim"},
	{"cvnum":"67","cvname":"CV67 Speed Table"},
	{"cvnum":"68","cvname":"CV68 Speed Table"},
	{"cvnum":"69","cvname":"CV69 Speed Table"},
	{"cvnum":"70","cvname":"CV70 Speed Table"},
	{"cvnum":"71","cvname":"CV71 Speed Table"},
	{"cvnum":"72","cvname":"CV72 Speed Table"},
	{"cvnum":"73","cvname":"CV73 Speed Table"},
	{"cvnum":"74","cvname":"CV74 Speed Table"},
	{"cvnum":"75","cvname":"CV75 Speed Table"},
	{"cvnum":"76","cvname":"CV76 Speed Table"},
	{"cvnum":"77","cvname":"CV77 Speed Table"},
	{"cvnum":"78","cvname":"CV78 Speed Table"},
	{"cvnum":"79","cvname":"CV79 Speed Table"},
	{"cvnum":"80","cvname":"CV80 Speed Table"},
	{"cvnum":"81","cvname":"CV81 Speed Table"},
	{"cvnum":"82","cvname":"CV82 Speed Table"},
	{"cvnum":"83","cvname":"CV83 Speed Table"},
	{"cvnum":"84","cvname":"CV84 Speed Table"},
	{"cvnum":"85","cvname":"CV85 Speed Table"},
	{"cvnum":"86","cvname":"CV86 Speed Table"},
	{"cvnum":"87","cvname":"CV87 Speed Table"},
	{"cvnum":"88","cvname":"CV88 Speed Table"},
	{"cvnum":"89","cvname":"CV89 Speed Table"},
	{"cvnum":"90","cvname":"CV90 Speed Table"},
	{"cvnum":"91","cvname":"CV91 Speed Table"},
	{"cvnum":"92","cvname":"CV92 Speed Table"},
	{"cvnum":"93","cvname":"CV93 Speed Table"},
	{"cvnum":"94","cvname":"CV94 Speed Table"},
	{"cvnum":"95","cvname":"CV95 Reverse Trim"},
	{"cvnum":"96","cvname":"CV96 NMRA Reserved"},
	{"cvnum":"97","cvname":"CV97 NMRA Reserved"},
	{"cvnum":"98","cvname":"CV98 NMRA Reserved"},
	{"cvnum":"99","cvname":"CV99 NMRA Reserved"},
	{"cvnum":"100","cvname":"CV100 NMRA Reserved"},
	{"cvnum":"101","cvname":"CV101 NMRA Reserved"},
	{"cvnum":"102","cvname":"CV102 NMRA Reserved"},
	{"cvnum":"103","cvname":"CV103 NMRA Reserved"},
	{"cvnum":"104","cvname":"CV104 NMRA Reserved"},
	{"cvnum":"105","cvname":"CV105 UserIdentifier #1"},
	{"cvnum":"106","cvname":"CV106 UserIdentifier #2"},
	{"cvnum":"107","cvname":"CV107"},
	{"cvnum":"108","cvname":"CV108"},
	{"cvnum":"109","cvname":"CV109"},
	{"cvnum":"110","cvname":"CV110"},
	{"cvnum":"111","cvname":"CV111"},
	{"cvnum":"112","cvname":"CV112"},
	{"cvnum":"113","cvname":"CV113"},
	{"cvnum":"114","cvname":"CV114"},
	{"cvnum":"115","cvname":"CV115"},
	{"cvnum":"116","cvname":"CV116"},
	{"cvnum":"117","cvname":"CV117"},
	{"cvnum":"118","cvname":"CV118"},
	{"cvnum":"119","cvname":"CV119"},
	{"cvnum":"120","cvname":"CV120"},
	{"cvnum":"121","cvname":"CV121"},
	{"cvnum":"122","cvname":"CV122"},
	{"cvnum":"123","cvname":"CV123"},
	{"cvnum":"124","cvname":"CV124"},
	{"cvnum":"125","cvname":"CV125"},
	{"cvnum":"126","cvname":"CV126"},
	{"cvnum":"127","cvname":"CV127"},
	{"cvnum":"128","cvname":"CV128"},
	{"cvnum":"129","cvname":"CV129"},
	{"cvnum":"130","cvname":"CV130"},
	{"cvnum":"131","cvname":"CV131"},
	{"cvnum":"132","cvname":"CV132"},
	{"cvnum":"133","cvname":"CV133"},
	{"cvnum":"134","cvname":"CV134"},
	{"cvnum":"135","cvname":"CV135"},
	{"cvnum":"136","cvname":"CV136"},
	{"cvnum":"137","cvname":"CV137"},
	{"cvnum":"138","cvname":"CV138"},
	{"cvnum":"139","cvname":"CV139"},
	{"cvnum":"140","cvname":"CV140"},
	{"cvnum":"141","cvname":"CV141"},
	{"cvnum":"142","cvname":"CV142"},
	{"cvnum":"143","cvname":"CV143"},
	{"cvnum":"144","cvname":"CV144"},
	{"cvnum":"145","cvname":"CV145"},
	{"cvnum":"146","cvname":"CV146"},
	{"cvnum":"147","cvname":"CV147"},
	{"cvnum":"148","cvname":"CV148"},
	{"cvnum":"149","cvname":"CV149"},
	{"cvnum":"150","cvname":"CV150"},
	{"cvnum":"151","cvname":"CV151"},
	{"cvnum":"152","cvname":"CV152"},
	{"cvnum":"153","cvname":"CV153"},
	{"cvnum":"154","cvname":"CV154"},
	{"cvnum":"155","cvname":"CV155"},
	{"cvnum":"156","cvname":"CV156"},
	{"cvnum":"157","cvname":"CV157"},
	{"cvnum":"158","cvname":"CV158"},
	{"cvnum":"159","cvname":"CV159"},
	{"cvnum":"160","cvname":"CV160"},
	{"cvnum":"161","cvname":"CV161"},
	{"cvnum":"162","cvname":"CV162"},
	{"cvnum":"163","cvname":"CV163"},
	{"cvnum":"164","cvname":"CV164"},
	{"cvnum":"165","cvname":"CV165"},
	{"cvnum":"166","cvname":"CV166"},
	{"cvnum":"167","cvname":"CV167"},
	{"cvnum":"168","cvname":"CV168"},
	{"cvnum":"169","cvname":"CV169"},
	{"cvnum":"170","cvname":"CV170"},
	{"cvnum":"171","cvname":"CV171"},
	{"cvnum":"172","cvname":"CV172"},
	{"cvnum":"173","cvname":"CV173"},
	{"cvnum":"174","cvname":"CV174"},
	{"cvnum":"175","cvname":"CV175"},
	{"cvnum":"176","cvname":"CV176"},
	{"cvnum":"177","cvname":"CV177"},
	{"cvnum":"178","cvname":"CV178"},
	{"cvnum":"179","cvname":"CV179"},
	{"cvnum":"180","cvname":"CV180"},
	{"cvnum":"181","cvname":"CV181"},
	{"cvnum":"182","cvname":"CV182"},
	{"cvnum":"183","cvname":"CV183"},
	{"cvnum":"184","cvname":"CV184"},
	{"cvnum":"185","cvname":"CV185"},
	{"cvnum":"186","cvname":"CV186"},
	{"cvnum":"187","cvname":"CV187"},
	{"cvnum":"188","cvname":"CV188"},
	{"cvnum":"189","cvname":"CV189"},
	{"cvnum":"190","cvname":"CV190"},
	{"cvnum":"191","cvname":"CV191"},
	{"cvnum":"192","cvname":"CV192"},
	{"cvnum":"193","cvname":"CV193"},
	{"cvnum":"194","cvname":"CV194"},
	{"cvnum":"195","cvname":"CV195"},
	{"cvnum":"196","cvname":"CV196"},
	{"cvnum":"197","cvname":"CV197"},
	{"cvnum":"198","cvname":"CV198"},
	{"cvnum":"199","cvname":"CV199"},
	{"cvnum":"200","cvname":"CV200"},
	{"cvnum":"201","cvname":"CV201"},
	{"cvnum":"202","cvname":"CV202"},
	{"cvnum":"203","cvname":"CV203"},
	{"cvnum":"204","cvname":"CV204"},
	{"cvnum":"205","cvname":"CV205"},
	{"cvnum":"206","cvname":"CV206"},
	{"cvnum":"207","cvname":"CV207"},
	{"cvnum":"208","cvname":"CV208"},
	{"cvnum":"209","cvname":"CV209"},
	{"cvnum":"210","cvname":"CV210"},
	{"cvnum":"211","cvname":"CV211"},
	{"cvnum":"212","cvname":"CV212"},
	{"cvnum":"213","cvname":"CV213"},
	{"cvnum":"214","cvname":"CV214"},
	{"cvnum":"215","cvname":"CV215"},
	{"cvnum":"216","cvname":"CV216"},
	{"cvnum":"217","cvname":"CV217"},
	{"cvnum":"218","cvname":"CV218"},
	{"cvnum":"219","cvname":"CV219"},
	{"cvnum":"220","cvname":"CV220"},
	{"cvnum":"221","cvname":"CV221"},
	{"cvnum":"222","cvname":"CV222"},
	{"cvnum":"223","cvname":"CV223"},
	{"cvnum":"224","cvname":"CV224"},
	{"cvnum":"225","cvname":"CV225"},
	{"cvnum":"226","cvname":"CV226"},
	{"cvnum":"227","cvname":"CV227"},
	{"cvnum":"228","cvname":"CV228"},
	{"cvnum":"229","cvname":"CV229"},
	{"cvnum":"230","cvname":"CV230"},
	{"cvnum":"231","cvname":"CV231"},
	{"cvnum":"232","cvname":"CV232"},
	{"cvnum":"233","cvname":"CV233"},
	{"cvnum":"234","cvname":"CV234"},
	{"cvnum":"235","cvname":"CV235"},
	{"cvnum":"236","cvname":"CV236"},
	{"cvnum":"237","cvname":"CV237"},
	{"cvnum":"238","cvname":"CV238"},
	{"cvnum":"239","cvname":"CV239"},
	{"cvnum":"240","cvname":"CV240"},
	{"cvnum":"241","cvname":"CV241"},
	{"cvnum":"242","cvname":"CV242"},
	{"cvnum":"243","cvname":"CV243"},
	{"cvnum":"244","cvname":"CV244"},
	{"cvnum":"245","cvname":"CV245"},
	{"cvnum":"246","cvname":"CV246"},
	{"cvnum":"247","cvname":"CV247"},
	{"cvnum":"248","cvname":"CV248"},
	{"cvnum":"249","cvname":"CV249"},
	{"cvnum":"250","cvname":"CV250"},
	{"cvnum":"251","cvname":"CV251"},
	{"cvnum":"252","cvname":"CV252"},
	{"cvnum":"253","cvname":"CV253"},
	{"cvnum":"254","cvname":"CV254"},
	{"cvnum":"255","cvname":"CV255"},
	{"cvnum":"256","cvname":"CV256"}
	]
}
`;


FlashairUtilMock.prototype._fileListRoot = `WLANSD_FILELIST
,DCIM,0,16,19011,0
,hiddenFile,0,16,19011,0
,otherExt,0,16,19011,0
,vorbeifahrender Zug lang01.mp3,1016164,32,19846,14501
,BaustelleSignalhorn.mp3,116667,32,19846,14500
,Bhf - Pfiff65.mp3,24285,32,19846,14500
,Dampflock klein Abfahrt.mp3,495341,32,19846,14500
,Horn Diesellok.mp3,46837,32,19846,14500
,Pfeife gr_Dampflok.mp3,38060,32,19846,14500
,Pfeife mittlere_Dampflok.mp3,45583,32,19846,14500
,Pfiff E-Lok kurz.mp3,20506,32,19846,14500
,Pfiff E-Lok kurz2.mp3,20506,32,19846,14500
,Pfiff E-Lok.mp3,35134,32,19846,14500
,Typhon.mp3,61884,32,19846,14500
`;

FlashairUtilMock.prototype._fileListDCIM =  `WLANSD_FILELIST
/DCIM,100__TSB,0,16,9944,129
/DCIM,0126_1.jpg,70408,32,17071,28040
`;

FlashairUtilMock.prototype._fileListDCIM_TSB =  `WLANSD_FILELIST
/DCIM/100__TSB,subsubdir.mp3,70408,32,17071,28040
`;

FlashairUtilMock.prototype._fileListHiddenFile = `WLANSD_FILELIST
/hiddenFile,hidden1.mp3,1024,34,17071,28040
/hiddenFile,normal1.mp3,2048,32,17071,28040
/hiddenFile,hidden2.mp3,4096,2,17071,28040
/hiddenFile,normal2.mp3,8192,0,17071,28040
`;

FlashairUtilMock.prototype._fileListOtherExt = `WLANSD_FILELIST
/otherExt,noext,2048,32,17071,28040
/otherExt,.dot.dot,2048,32,17071,28040
/otherExt,wavefile.wav,2048,32,17071,28040
/otherExt,textfile.txt,2048,32,17071,28040
`;

FlashairUtilMock.prototype._fileListMP3Ext = `WLANSD_FILELIST
/MP3Ext,mp3file1.mp3,2048,32,17071,28040
/MP3Ext,mp3file2.mP3,2048,32,17071,28040
/MP3Ext,mp3file3.Mp3,2048,32,17071,28040
/MP3Ext,mp3file4.MP3,2048,32,17071,28040
`;

FlashairUtilMock.prototype._fileList = {
	'/': FlashairUtilMock.prototype._fileListRoot,
	'/DCIM': FlashairUtilMock.prototype._fileListDCIM,
	'/DCIM/100__TSB': FlashairUtilMock.prototype._fileListDCIM_TSB,
	'/hiddenFile': FlashairUtilMock.prototype._fileListHiddenFile,
	'/otherExt': FlashairUtilMock.prototype._fileListOtherext,
	'/MP3Ext': FlashairUtilMock.prototype._fileListMP3Ext
};


FlashairUtilMock.prototype.httpRequest = function (httpMethod, url/*, respCb, errCb*/) {
	console.info('request "%s %s"', httpMethod, url);
};

FlashairUtilMock.prototype.getFileList = function (args) {
	let argList = args.split('&');
	let fileList = null;
	for (let arg of argList) {
		let param = arg.split('=');
		if (param[0] == 'DIR') {
			if (param[1] in this._fileList) {
				fileList = this._fileList[param[1]];
			} else {
				console.info('unknown directory %s', param[1]);
			}
		} else {
			console.info('unknown parameter %s', arg);
		}
	}
	if (fileList == null) {
		fileList = this._fileList['/'];
	}
	return fileList;
};

FlashairUtilMock.prototype.requestSimpleCommand = function (op, option, respCb, errCb) {
	this.super.requestSimpleCommand.call(this, op, option, respCb, errCb);

	let respStr = '';
	switch (op) {
		case 100:	// file list
			respStr = this.getFileList(option);
			break;
		case 104:	// SSID
			respStr = this._appSSID;
			break;
		case 105:	// Network Key
			respStr = this._appNetworkKey;
			break;
		case 106:  // Master Code
			respStr = this._masterCode;
			break;
		case 108:	// Firmware version
			respStr = this._flashairFirmwareVersion;
			break;
		default:
			respStr = '???';
			console.info('Unknown requset %d', op);
			break;
	}
	setTimeout(function () {
		//console.log(respStr);
		respCb(respStr);
	}, this._responseTime);
};

FlashairUtilMock.prototype.requestConfig = function (mastercode, args) {
	this.super.requestConfig.call(this, mastercode, args);
	this._masterCode = mastercode;
	for (let arg of args.split('&')) {
		if (arg.length > 0) {
			let param = arg.split('=');
			switch (param[0]) {
				case 'APPSSID':
					this._appSSID = param[1];
					break;
				case 'APPNETWORKKEY':
				this._appNetworkKey = param[1];
					break;
				default:
					break;
			}
		}
	}
};

FlashairUtilMock.prototype.sendCommand = function (arg, obj, method) {
	if (obj === undefined) {
		this.writeShmem(0, 64, arg, null, null);
	} else {
		this.writeShmem(0, 64, arg, null, null);
		setTimeout(function () {
			obj[method]('SUCCESS');
		}, this._responseTime);
	}
};

FlashairUtilMock.prototype.readShmem = function (start, length, respCb, errCb) {
	this.super.readShmem.call(this, start, length, respCb, errCb);
	let self = this;
	// 指定時間経過後に応答を返す
	setTimeout(function () {
		respCb(self._sharedMemory.substr(start, length));
	}, this._responseTime);
};
//

FlashairUtilMock.prototype.findLocInfo = function (addr) {
	for (let loc of this._locList) {
		if (loc.addr == addr) {
			loc.lastAccess =  this._locListSeq++
			return loc;
		}
	}
	if (this._locList.length < this._maxLocNo) {
		this._locList.push({
			addr: addr,
			direction: 1,
			speed: 0,
			speedStep: 2,
			funcVal: 0,
			lastAccess: this._locListSeq++
		});
		//console.log(this._locList[this._locList.length - 1]);
		return this._locList[this._locList.length - 1];
	}
	let oldestSeq = this._locListSeq;
	let oldestLoc = null;
	for (let loc of this._locList) {
		if (loc.lastAccess < oldestSeq) {
			oldestSeq = loc.lastAccess;
			oldestLoc = loc;
		}
	}
	if (oldestLoc == null) {
		console.info('oldestLoc is null!');
		return null;
	}
	oldestLoc = {
		addr: addr,
		direction: 1,
		speed: 0,
		speedStep: 2,
		funcVal: 0,
		lastAccess: this._locListSeq++
	}
	return oldestLoc;
};


FlashairUtilMock.prototype.setDirection = function (args) {
	let locAddrList = args[0].split('/');
	let direction = (args[1] == '1' ? 0 : 1);
	for (let addr of locAddrList) {
		let loc = this.findLocInfo(addr);
		loc.direction = direction;
	}
};

FlashairUtilMock.prototype.setSpeed = function (args) {
	//console.log(args);
	if (args.length != 3) {
		console.info(args);
		return;
	}
	let locAddrList =  args[0].split('/');
	//console.log(locAddrList);
	let speed = args[1];
	let speedStep = args[2];
	for (let addrStr of locAddrList) {
		let addr = parseInt(addrStr);
		let loc = this.findLocInfo(addr);
		//console.log(loc);
		loc.speed = parseInt(speed) / 4;
		loc.speedStep = parseInt(speedStep);
	}
};

FlashairUtilMock.prototype.setPower = function (args) {
	if (args.length != 1) {
		console.info(args);
		return;
	}
	if (args[0] == '1') {
		this._statusInfo[0] = 'Y';
	} else if (args[0] == '0') {
		this._statusInfo[0] = 'N';
	}
};

FlashairUtilMock.prototype.setFunction = function (args) {
	//console.log(args);
	if (args.length != 3) {
		console.info(args);
		return;
	}
	let locAddrList =  args[0].split('/');
	let funcNo = args[1];
	let funcVal = args[2];
	console.log(funcVal);
	for (let addr of locAddrList) {
		let loc = this.findLocInfo(addr);
		if (funcVal == 0) {
			loc.funcVal &= ~(1 << funcNo);
		} else {
			loc.funcVal |= (1 << funcNo);
		}
	}
};

FlashairUtilMock.prototype.setAccessory = function (/*args*/) {

};

FlashairUtilMock.prototype.setCV = function (/*args*/) {

};

FlashairUtilMock.prototype.getCV = function (/*args*/) {

};

FlashairUtilMock.prototype.writeShmem = function (start, length, param, respCb, errCb) {
	this.super.writeShmem.call(this, start, length, param, respCb, errCb);
	let shmParam;
	if (param.length < length) {
		shmParam = param + this._initVal.repeat(length - param.length);
	} else if (param.length > length) {
		shmParam = param.substr(0, length);
	}
	this._sharedMemory = this._sharedMemory.substr(0, start) +
		shmParam + this._sharedMemory.substr(start + length);
	if (start != 0) {
		// コマンドではない
		return;
	}
	let cmd = param.substr(0, 2);
	let args = param.substr(2);
	if (args.substr(0,1) == '(') {
		args = args.substr(1);
	} else {
		console.info('missing "(" "%s"', args)
	}
	if (args.substr(-1,1) == ')') {
		args = args.substr(0, args.length - 1);
	} else {
		console.info('missing ")" "%s"', args)
	}
	console.info('cmd = "%s", args = "%s"', cmd, args);
	let argList = args.split(',');
	switch (cmd) {
		case 'DI':
			this.setDirection(argList);
			break;
		case 'SP':
			this.setSpeed(argList);
			break;
		case 'PW':
			this.setPower(argList);
			break;
		case 'FN':
			this.setFunction(argList);
			break;
		case 'TO':
			this.setAccessory(argList);
			break;
		case 'SV':
			this.setCV(argList);
			break;
		case 'GV':
			this.getCV(argList);
			break;
		default:
			break;
	}
	//
	this.updateShm();
};

FlashairUtilMock.prototype.updateShm = function () {
	let aStatusStr = this._statusInfo.join(',');
	let aReplyMsg = this._replyMessage.join(',');
	let aReplyAcc = this._replyAcc.join(',');
	let aLocList = [];
	for (let loc of this._locList) {
		//console.log(loc);
		let aLocInfo = [
			loc.addr.toString(16),
			loc.speed.toString(16),
			loc.direction.toString(),
			loc.funcVal.toString()
		];
		aLocList.push(aLocInfo.join(','));
	}
	for (let i = this._locList.length; i < this._maxLocNo; i++) {
		aLocList.push(['0', '0', '0', '0']);
	}
	let aReplyLoc = aLocList.join('/');
	let aResponse = [aStatusStr, aReplyMsg, aReplyAcc, aReplyLoc].join(';');
	//console.log('"%s"', aResponse);
	if (aResponse.length < this._responseLength) {
		aResponse += this._initVal.repeat(this._responseLength - aResponse.length);
	} else if (aResponse.length > this._responseLength) {
		aResponse = aResponse.substr(0, this._responseLength);
	}
	this._sharedMemory = this._sharedMemory.substr(0, 128) + aResponse;
};

FlashairUtilMock.prototype.getJson= function (filename, callbackObj, callbackMethod) {
	this.super.getJson.call(this, filename, callbackObj, callbackMethod);
	let jsonObj = JSON.parse(this._jsonData);
	setTimeout(function () {
		callbackObj[callbackMethod](jsonObj);
	}, this._responseTime);
};

FlashairUtilMock.prototype.setWritable = function () {
	this.super.setWritable.call(this);
	let self = this;
	setTimeout(function () {
		self.setUploadDir();
	}, this._responseTime);
};

FlashairUtilMock.prototype.setUploadDir = function () {
	this.super.setUploadDir.call(this);
	let self = this;
	setTimeout(function () {
		self.setUploadTime();
	}, this._responseTime);
};

FlashairUtilMock.prototype.setUploadTime = function () {
	this.super.setUploadTime.call(this);
	let self = this;
	setTimeout(function () {
		self.uploadFile();
	}, this._responseTime);
};

FlashairUtilMock.prototype.uploadFile = function () {
	this.super.setUploadTime.call(this);
	let self = this;
	setTimeout(function () {
		self._uploadArgs.callbackObject[self._uploadArgs.callbackMethod](true, 'upload file');
	}, this._responseTime);
};

