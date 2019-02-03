// flashairfile access utilities
var DsairFileControl = function (inCurrentPath) {
    this._command = null;
    this._controller = null;
    this._fileListMethod = null;

    this._currentPath = inCurrentPath;
    this._nextPath = '';

    this._fileList = new Array();
    window.addEventListener('load', this);
};

DsairFileControl.isUpDir = -1;

DsairFileControl.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'load':
            this.onLoad();
            break;
        default:
            break;
    }
};

DsairFileControl.prototype.onLoad = function () {
    //console.log(this._currentPath);
    this.getFileList('.');
};

DsairFileControl.prototype.addDsairCommand = function (inCommand) {
    this._command = inCommand;
};

DsairFileControl.prototype.addControl = function (inView, inMethodName) {
    this._controller = inView;
    this._fileListMethod = inMethodName;
};

DsairFileControl.prototype.isV1 = function () {
    if (this._fileList.length == undefined || this._fileList.length == 0) {
        // List is empty so the card version is not detectable. Assumes as V2.
        return false;
    } else if (this._fileList[0].length != undefined) {
        // Each row in the list is array. V1.
        return true;
    } else {
        // Otherwise V2.
        return false;
    }
};

// Convert data format from V1 to V2.
DsairFileControl.prototype.convertFileList = function () {
    var l = this._fileList.length;
    for (var i = 0; i < l; i++) {
        var elements = this._fileList[i].split(',');
        this._fileList[i] = new Array();
        this._fileList[i].r_uri = elements[0];
        this._fileList[i].fname = elements[1];
        this._fileList[i].fsize = parseInt(elements[2]);
        this._fileList[i].attr = parseInt(elements[3]);
        this._fileList[i].fdate = parseInt(elements[4]);
        this._fileList[i].ftime = parseInt(elements[5]);
    }
};

// Callback Function for sort()
DsairFileControl.prototype.cmpname = function (a, b) {
    var alc = a.fname.toLowerCase();
    var blc = b.fname.toLowerCase();
    if (alc < blc) {
        return -1;
    } else if (alc > blc) {
        return 1;
    }
    return 0;
};

// Making Path
DsairFileControl.prototype.makePath = function (dir) {
    var arrPath = this._currentPath.split('/');
    if (this._currentPath == '/') {
        arrPath.pop();
    }
    if (dir == '..' && this._currentPath != '/') {
        // Go to parent directory. Remove last fragment.
        arrPath.pop();
    } else if (dir != '.' && dir != '') {
        // Go to child directory. Append dir to the current path.
        arrPath.push(dir);
    }
    if (arrPath.length == 1) {
        arrPath.push('');
    }
    //console.log(arrPath);
    return arrPath.join('/');
};

DsairFileControl.prototype.getFileList = function (dir) {
    // Make a path to show next.
    this._nextPath = this.makePath(dir);
    // Make URL for CGI. (DIR must not end with '/' except if it is the root.)
    this._command.getFileList(this._nextPath, this, 'getFileListCallback');
};

DsairFileControl.prototype.getFileListCallback = function (data) {
    // Save the current path.
    this._currentPath = this._nextPath;
    // Split lines by new line characters.
    this._fileList = data.split(/\n/g);
    // Ignore the first line (title) and last line (blank).
    this._fileList.shift();
    this._fileList.pop();
    // Convert to V2 format.
    this.convertFileList();
    // Sort by name.
    var self = this;
    this._fileList.sort(function (a, b) { return self.cmpname(a, b); });
    // Show
    this._controller[this._fileListMethod](this._fileList);
};

DsairFileControl.prototype.chageDirectory = function (newDir) {
    this.getFileList(newDir);
};

DsairFileControl.prototype.getFileItem  = function (n) {
    if (n == DsairFileControl.isUpDir) {
        return { fname: '..', attr: 0x10};
    }
    return this._fileList[n];
};

DsairFileControl.prototype.getCurrentPath  = function () {
    return this._currentPath;
};

DsairFileControl.prototype.splitExt = function (filename) {
    return filename.split(/\.(?=[^.]+$)/);
};
