//
var DsairSoundView = function () {
    this._loaded = false;
    this._id = 'soundlist';
    this._controller = null;
    this._selectCbMethod = '';
    window.addEventListener('DOMContentLoaded', this);
    window.addEventListener('load', this);
};

DsairSoundView.prototype.dirIcon = DsairConst.documentRootDir + '/img/file_dir.png';
DsairSoundView.prototype.dirColor = 'blue';
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

DsairSoundView.prototype.addControl = function (inController, method) {
    this._controller = inController;
    this._selectCbMethod = method;
};7

DsairSoundView.prototype.makeButtonId = function (idstr) {
    return  this._id + '-button' + idstr;
}

DsairSoundView.prototype.makeButton = function (buttonIcon, buttonColor, buttonLabel, buttonId) {
    var filelink;

    filelink = '<button id=' + buttonId;
    if (buttonColor != null) {
        filelink += ' style="color:' + buttonColor + ';"';
    }
    filelink += '>';
    filelink += '<img src="' + buttonIcon + '" width=24 style="margin-right:0.2em;">';
    filelink += buttonLabel + '</button> <br>';
    
    return filelink;
};

DsairSoundView.prototype.setDirectoryName = function (dirname) {
    $('#sound-list-directory').html(dirname); 
};

DsairSoundView.prototype.clearFileList= function () {
    $('#' + this._id).html('');
};

DsairSoundView.prototype.appendLink = function (filelink, buttonId, idx) {
    $('#' + this._id).append(filelink);
    var self = this;
    $('#' + buttonId).on('click', function () {
        self.onSelectItem(idx);
    });
};

DsairSoundView.prototype.addRegularFile = function (filename, fileext, idx) {
    var buttonId = this.makeButtonId(idx.toString());
    var filelink = this.makeButton(this.extList[fileext].icon, null, filename, buttonId);
    this.appendLink(filelink, buttonId, idx);
};

DsairSoundView.prototype.addDirectory = function (dirname, idx) {
    var idstr;
    if (idx == DsairFileControl.isUpDir) {
        idstr = 'updir';
    } else {
        idstr = idx.toString();
    }
    var buttonId = this.makeButtonId(idstr);
    var filelink = this.makeButton(this.dirIcon, this.dirColor, dirname, buttonId);
    this.appendLink(filelink, buttonId, idx);
};

DsairSoundView.prototype.onSelectItem = function (idx) {
    this._controller[this._selectCbMethod](idx);
};
