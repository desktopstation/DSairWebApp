//
var DsairSoundControl = function () {
    this._command = null;
    this._view = null;

    this._audioElem = null;
    // let path = location.pathname;
    // console.log(path);
    // let index = path.lastIndexOf('/');
    // if (index >= 0) {
    //     this._currentPath = path.substr(0, index);
    // } else {
    //     console.info('invalid pathname "%s"', path);
    //     this._currentPath = '/';
    // }
    this._currentPath = '/';
    console.log(this._currentPath);
    this._nextPath = '';

    this._wlansd = new Array();
    this._audioElem = new Audio();

    window.addEventListener('load', this);
};

DsairSoundControl.prototype._soundRootDir = '';

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
    this.getFileList(this._soundRootDir);
};

DsairSoundControl.prototype.addDsairCommand = function (inCommand) {
    this._command = inCommand;
};

DsairSoundControl.prototype.addView = function (inView) {
    this._view = inView;
};

DsairSoundControl.prototype.isV1 = function () {
    if ( this._wlansd.length == undefined || this._wlansd.length == 0 ) {
        // List is empty so the card version is not detectable. Assumes as V2.
        return false;
    } else if ( this._wlansd[0].length != undefined ) {
        // Each row in the list is array. V1.
        return true;
    } else {
        // Otherwise V2.
        return false;
    }
};

// Convert data format from V1 to V2.
DsairSoundControl.prototype.convertFileList = function () {
    for (let i = 0; i < this._wlansd.length; i++) {
        let elements = this._wlansd[i].split(',');
        this._wlansd[i] = new Array();
        this._wlansd[i].r_uri = elements[0];
        this._wlansd[i].fname = elements[1];
        this._wlansd[i].fsize = parseInt(elements[2]);
        this._wlansd[i].attr  = parseInt(elements[3]);
        this._wlansd[i].fdate = parseInt(elements[4]);
        this._wlansd[i].ftime = parseInt(elements[5]);
    }
};

// Callback Function for sort()
DsairSoundControl.prototype.cmptime = function (a, b) {
    if (a.fdate == b.fdate) {
        return a.ftime - b.ftime;
    } else {
        return a.fdate - b.fdate;
    }
};

// Making Path
DsairSoundControl.prototype.makePath = function (dir) {
    let arrPath = this._currentPath.split('/');
    //console.log(arrPath);
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

DsairSoundControl.prototype.getFileList = function (dir) {
    // Make a path to show next.
    //console.log('dir = "%s"', dir);
    this._nextPath = this.makePath(dir);
    console.log('_nextPath = "%s"', this._nextPath);
    // Make URL for CGI. (DIR must not end with '/' except if it is the root.)
    this._command.getFileList(this._nextPath, this, 'getFileListCallback');
};

DsairSoundControl.prototype.getFileListCallback = function (data) {
    //console.log(data);
    // Save the current path.
    this._currentPath = this._nextPath;
    // Split lines by new line characters.
    this._wlansd = data.split(/\n/g);
    // Ignore the first line (title) and last line (blank).
    this._wlansd.shift();
    this._wlansd.pop();
    // Convert to V2 format.
    this.convertFileList();
    // Sort by name.
    this._wlansd.sort();
    // Show
    this._view.showFileList(this._currentPath, this._wlansd);
};

DsairSoundControl.prototype.playSound = function (n) {
    console.log('play', n);
    this._audioElem.src = this._currentPath + '/' + this._wlansd[n].fname;
    //console.log('play %d %s', n, this._wlansd[n].fname);
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
    let newDir;
    if (n == -1) {
        newDir = '..';
    } else {
        newDir = this._wlansd[n].fname;
    }
    this.getFileList(newDir);
};
