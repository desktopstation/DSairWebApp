// 
var DsairMsgDialog = function (inDialogName, inClassName) {
    DsairDialog.call(this, inDialogName, inClassName);
    this.super = DsairDialog.prototype;
    this._message = '';
};

inherits(DsairMsgDialog, DsairDialog);

DsairMsgDialog.prototype.open = function(inMessage, cancelable, inCallbackObject, inMethodName) {
    this._message = inMessage;

    let self = this;
    let buttons = [
        {
            text: 'Ok',
            click: function () {
                let result = {
                    isOK: true
                };
                self.super.close.call(self, result);
            }
        }
    ];
    if (cancelable) {
        buttons.push(
            {
                text: 'Cancel',
                click: function () {
                    let result = {
                        isOK: false
                    };
                    self.super.close.call(self, result);
                }
            }
        );
    }
    $('p').css({
        'display': 'block'
    });
    $(this._dialogName).dialog({
        dialogClass: this._className,
        autoOpen: false,
        maxWidth: 400,
        maxHeight: 200,
        width: 420,
        height: 220,
        show: 'fade',
        hide: 'fade',
        modal: true,
        buttons: buttons
    }).css('font-size', '1.5em');
    $(this._dialogName).html(this._message);
    this.super.open.call(this, inCallbackObject, inMethodName);
};
