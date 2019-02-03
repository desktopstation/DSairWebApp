var DsairSoundView = function () {
    this._loaded = false;
    window.addEventListener('DOMContentLoaded', this);
    window.addEventListener('load', this);
};

DsairSoundView.prototype.dirIcon = DsairConst.documentRootDir + '/img/file_dir.png';
DsairSoundView.prototype.extList = [];
DsairSoundView.prototype.extList['mp3'] = { icon: DsairConst.documentRootDir + '/img/file_mp3.png'};
DsairSoundView.prototype.extList['pdf'] = { icon: DsairConst.documentRootDir + '/img/file_pdf.png'};

DsairSoundView.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'DOMContentLoaded':
            this.onLoad();
            break;
        case 'load':
            this.onLoad();
            break;
        default:
            break;
    }
};

DsairSoundView.prototype.onLoad = function () {
    if (this._loaded) {
        return;
    }
    this._loaded = true;
    $('.soundbutton').buttonset();
};

DsairSoundView.prototype.splitExt = function (filename) {
    return filename.split(/\.(?=[^.]+$)/);
};

DsairSoundView.prototype.makeButton = function (buttonIcon, buttonColor, buttonLabel, buttonId) {
    var filelink = '<button onclick=fileItemSelect(' + buttonId.toString() + ')';
    if (buttonColor != null) {
        filelink += ' style="color:' + buttonColor + ';"';
    }
    filelink += '>';
    filelink += '<img src="' + buttonIcon + '" width=24 style="margin-right:0.2em;">';
    filelink += buttonLabel + '</button> <br>';
    return filelink;
};

// Show file list
DsairSoundView.prototype.showFileList = function (path, filelist) {
    // Clear box.
    $('#soundlist').html('');
    // Output a link to the parent directory if it is not the root directory.
    if (path != '/') {
        $('#soundlist').append(this.makeButton(this.dirIcon, 'blue', '..', DsairSoundControl.isUpDir));
    }
    var len = filelist.length;
    for (var i = 0; i < len; i++) {
        var file = filelist[i];
        //console.log('%s %d', file.fname, file.attr);
        // Skip hidden file.
        if ((file.attr & 0x02) != 0) {
            continue;
        }
        var filelink;
        // directory
        if ((file.attr & 0x10) != 0) {
            filelink = this.makeButton(this.dirIcon, 'blue', file.fname, i);
        } else {
            // regular file
            var aExt = this.splitExt(file.fname.toLowerCase());
            if (aExt.length <= 1) {
                continue;
            } 
            if (!(aExt[1] in this.extList)) {
                continue;
            }
            // Make a link to a file.
            filelink = this.makeButton(this.extList[aExt[1]].icon, null, file.fname, i);
        }
        // Append a file entry or directory to the end of the list.
        $('#soundlist').append(filelink);
    }
};
