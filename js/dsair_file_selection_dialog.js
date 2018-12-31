//
var DsairFileSelectionDialog = function (inDialogName, inClassName, inOptArg) {
    DsairDialog.call(this, inDialogName, inClassName);
    this.super = DsairDialog.prototype;
    this._filename = '';
    this._filenameArea = inOptArg.filenameArea;
    this._directoryArea = inOptArg.directoryArea;
    this._listArea = inOptArg.filelistArea;
    this._fileList = [];
    this._buttonIdList = [];
    this._fileSelection = new FlashairFileSelection(this, 'onSelectCallback', 'getFileListCallback');
    this._fileSelectionCallbackObject = null;
    this._fileSelectionCallbackMethod = '';
    window.addEventListener('load', this);
};

inherits(DsairFileSelectionDialog, DsairDialog);

DsairFileSelectionDialog.prototype._initialDir = '';

DsairFileSelectionDialog.handleEvent = function (e) {
    this.super.handleEvent.call(this, e);
    switch (e.type) {
        case 'click':
            this.onButtonClick(e);
            break;
        default:
            break;
    }
};

DsairFileSelectionDialog.onLoad = function () {
    this.super.onLoad.call(this);
};

DsairFileSelectionDialog.onButtonClick = function (e) {
    console.log(e);
    e.preventDefault();
};

DsairFileSelectionDialog.prototype.addDsairCommand = function (inCommand) {
    this._fileSelection.addDsairCommand(inCommand);
};

DsairFileSelectionDialog.prototype.open = function(inCallbackObject, inCallbackMethodName) {
    this._fileSelectionCallbackObject = inCallbackObject;
    this._fileSelectionCallbackMethod = inCallbackMethodName;
    this._fileSelection.init(this._initialDir);
};

DsairFileSelectionDialog.prototype.splitExt = function (filename) {
    return filename.split(/\.(?=[^.]+$)/);
}

DsairFileSelectionDialog.prototype.getFileListCallback = function (path, filelist) {
    this._fileList = filelist;
    this._buttonIdList = [];
    $(this._listArea).html = '';
    $(this._directoryArea).val(path);
    $(this._filenameArea).val(this._filename);
    var len = this._fileList.length;
    for (var i = 0; i < len; i++) {
        var file = this._fileList[i];
        this._buttonIdList[i] = null;
        // Skip hidden file.
        if ((file.attr & 0x02) != 0) {
            continue;
        }
        var buttonId;
        if (this._dialogName.substr(0, 1) == '#') {
            buttonId = this._dialogName.substr(1) + "-" + i.toString();
        } else {
            buttonId = this._dialogName + "-" + i.toString();
        }
        this._buttonIdList[i] = buttonId;
        var caption;
        // directory
        if ((file.attr & 0x10) != 0) {
            caption = file.fname + '/';
        } else {
            // regular file
            var aExt = this.splitExt(file.fname.toLowerCase());
            if (aExt.length <= 1) {
                continue;
            } 
            // if (aExt[1] != 'mp3') {
            //     continue;
            // }
            caption = file.fname;
        }
        var buttonText = '<button id=' + buttonId + ' <label>' + caption + '</label> </button><br>'
        $(this._listArea).append(buttonText);
        // var button = document.getElementById(buttonId);
        // button.addEventListener('click', this);
        // console.log(button);
    }
    $('p').css({
        'display': 'block'
    });
    var self = this;
    $(this._dialogName).dialog({
        dialogClass: this._className,
        autoOpen: false,
        maxWidth: 600,
        maxHeight: 400,
        width: 500,
        height: 360,
        show: 'fade',
        hide: 'fade',
        modal: true,
        open: function () {
            self.onDialogOpen();
        }
    }).css('font-size', '1.5em');
    this.super.open.call(this, this._fileSelectionCallbackObject, this._fileSelectionCallbackMethod);
};

DsairFileSelectionDialog.prototype.onDialogOpen = function () {
    console.log('dialog open');
    var len = this._fileList.length;
    for (var i = 0; i < len; i++) {
        if (this._buttonIdList[i] != null) {
            var button = document.getElementById(this._buttonIdList[i]);
            button.addEventListener('click', this);
        }
    }
};

DsairFileSelectionDialog.prototype.onSelectCallback = function (inCurrentPath, inFileName) {
    //this._fileSelectionCallbackObject[this._fileSelectionCallbackMethod](inCurrentPath, inFileName);
};
