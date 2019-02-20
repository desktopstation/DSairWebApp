//
var DsairFileSelectionDialog = function (inDialogName, inClassName, inOptArg) {
    DsairDialog.call(this, inDialogName, inClassName);
    this.super = DsairDialog.prototype;
    this._filename = '';
    this._filenameArea = inOptArg.filenameArea;
    this._directoryArea = inOptArg.directoryArea;
    this._listArea = inOptArg.fileListArea;
    this._buttonIdList = [];
    this._fileControl = new DsairFileControl(this._initialDir);
    this._fileControl.addControl(this, 'getFileListCallback');
    this._fileSelectionCallbackObject = null;
    this._fileSelectionCallbackMethod = '';
    window.addEventListener('load', this);
};

inherits(DsairFileSelectionDialog, DsairDialog);

DsairFileSelectionDialog.prototype._initialDir = '/';

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
    this._fileControl.addDsairCommand(inCommand);
};

DsairFileSelectionDialog.prototype.open = function(inCallbackObject, inCallbackMethodName) {
    this._fileSelectionCallbackObject = inCallbackObject;
    this._fileSelectionCallbackMethod = inCallbackMethodName;
    this._fileControl.getFileList();
};
a
DsairFileSelectionDialog.prototype.getFileListCallback = function (fileList) {
    var currentPath = this._fileControl.getCurrentPath(); 
    this._buttonIdList = [];
    $(this._listArea).html = '';
    $(this._directoryArea).val(currentPath);
    $(this._filenameArea).val(this._filename);
    var len = fileList.length;
    for (var i = 0; i < len; i++) {
        var file = fileList[i];
        // Skip hidden file.
        if (this._fileControl.isHidden(file)) {
            continue;
        }
        if (this._fileControl.isDirectory(file)) {
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
