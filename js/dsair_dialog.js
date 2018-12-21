/*eslint no-unused-vars:0*/
var DsairDialog = function (inDialogName, inClassName) {
    this._dialogName = inDialogName;
    this._className = inClassName;
    this._callbackObject = null;
    this._callbackMethodName = '';
};

DsairDialog.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'load':
            this.onLoad();
            break;
        default:
            break;
    }
};

DsairDialog.prototype.onLoad = function () {
    $(this._dialogName).dialog({ autoOpen: false });
};

DsairDialog.prototype.open = function(inCallbackObject, inCallbackMethodName) {
    this._callbackObject = inCallbackObject;
    this._callbackMethodName = inCallbackMethodName;
    $(this._dialogName).dialog('open');
}

DsairDialog.prototype.close = function (inVal) {
    if (this._callbackObject != null) {
        this._callbackObject[this._callbackMethodName](inVal);
    }
    $(this._dialogName).dialog('close');
}

