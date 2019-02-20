//
var DsairSoundControl = function () {
    this._command = null;
    this._view = null;
    this._fileControl = new DsairFileControl(this._soundRootDir);
    this._fileControl.addControl(this, 'getFileListCallback');

    this._audioElem = null;
    this._currentPath = '/';
    //console.log(this._currentPath);
    this._nextPath = '';

    this._wlansd = new Array();
    this._audioElem = new Audio();

    window.addEventListener('load', this);
};

DsairSoundControl.prototype._soundRootDir = '/';
DsairSoundControl.prototype.fileActions = [];
DsairSoundControl.prototype.fileActions['mp3'] = { action: 'playSound'};
DsairSoundControl.prototype.fileActions['pdf'] = { action: 'openPDF'};

DsairSoundControl.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'load':
            this.onLoad();
            break;
        default:
            break;
    }
};

DsairSoundControl.prototype.onLoad = function () {
    //console.log(this._currentPath);
    this._fileControl.getFileList();
};

DsairSoundControl.prototype.addDsairCommand = function (inCommand) {
    this._command = inCommand;
    this._fileControl.addDsairCommand(inCommand);
};

DsairSoundControl.prototype.addView = function (inView) {
    this._view = inView;
    this._view.addControl(this, 'fileItemSelect');
};

DsairSoundControl.prototype.getFileListCallback = function (fileList) {
    this._view.clearFileList();
    var currentPath = this._fileControl.getCurrentPath();
    this._view.setDirectoryName(currentPath);
    if (currentPath != '/') {
        // add '..'
        this._view.addDirectory('..', DsairFileControl.isUpDir);
    }
    var len = fileList.length;
    for (var i = 0; i < len; i++) {
        var file = fileList[i];
        if (this._fileControl.isHidden(file)) {
            // skip hidden file
            continue;
        }
        if (this._fileControl.isDirectory(file)) {
            // directory
            this._view.addDirectory(file.fname, i);
        } else {
            // regular file
            var aExt = this._fileControl.getExt(file.fname);
            if (!(aExt in this.fileActions)) {
                continue;
            }
            this._view.addRegularFile(file.fname, aExt, i);
        }
    }
};

DsairSoundControl.prototype.fileItemSelect = function (n) {
    if (n == DsairSoundControl.isUpDir) {
        this.chageDirectory(n);
        return;
    }
    var fileInfo = this._fileControl.getFileInfo(n);
    if (this._fileControl.isDirectory(fileInfo)) {
        this.chageDirectory(n);
        return;
    }
    var aExt = this._fileControl.getExt(fileInfo.fname);
    if (!(aExt in this.fileActions)) {
        return;
    }
    var currentPath = this._fileControl.getCurrentPath();
    var filename;
    if (currentPath == '/') {
        filename = fileInfo.fname;
    } else {
        filename = currentPath + '/' + fileInfo.fname;
    }
    var method = this.fileActions[aExt].action;
    if (method in this) {
        this[method](filename);
    }
};

DsairSoundControl.prototype.playSound = function (soundfile) {
    this._audioElem.src = soundfile;
    try {
        this._audioElem.play();
    } catch (e) {
        console.log(e);
    }
};

DsairSoundControl.prototype.stopSound = function () {
    this._audioElem.pause();
    this._audioElem.currentTime = 0;
};

DsairSoundControl.prototype.chageDirectory = function (n) {
    var fileInfo = this._fileControl.getFileInfo(n);
    this._fileControl.chageDirectory(fileInfo.fname);
};

DsairSoundControl.prototype.openPDF = function (pdffile) {
    try {
        window.open(pdffile);
    } catch (e) {
        console.log(e);
    }
};
