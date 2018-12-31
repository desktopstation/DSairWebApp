var DsairSoundView = function () {
    window.addEventListener('load', this);
};

DsairSoundView.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'load':
            this.onLoad();
            break;
        default:
            break;
    }
};

DsairSoundView.prototype.onLoad = function () {
    $('.soundbutton').buttonset();
};

DsairSoundView.prototype.splitExt = function (filename) {
    return filename.split(/\.(?=[^.]+$)/);
};

// Show file list
DsairSoundView.prototype.showFileList = function (path, filelist) {
    // Clear box.
    $('#soundlist').html('');
    // Output a link to the parent directory if it is not the root directory.
    if (path != '/') {
        $('#soundlist').append('<button onclick=chageDirectory(' +
            (-1).toString() + ')> <label>' +
            '../' + '</label> </button><br>');
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
                filelink = '<button onclick=chageDirectory(' + i.toString() + ')> <label>' + file.fname + '/' + '</label> </button><br>';
        } else {
            // regular file
            var aExt = this.splitExt(file.fname.toLowerCase());
            if (aExt.length <= 1) {
                continue;
            } 
            if (aExt[1] != 'mp3') {
                continue;
            }
            var caption = file.fname;
            // Make a link to a file.
            filelink = '<button onclick=playSound(' + i.toString() + ')> <label>' + caption + '</label> </button><br>';
        }
        // Append a file entry or directory to the end of the list.
        $('#soundlist').append(filelink);
    }
};
