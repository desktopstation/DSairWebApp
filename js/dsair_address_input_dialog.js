//
var DsairAddressInputDialog = function (inDialogName, inClassName, inTextAreaName) {
    DsairDialog.call(this, inDialogName, inClassName);
    this.super = DsairDialog.prototype;
    this._textAreaName = inTextAreaName;
    this._locAddr = 0;
};

inherits(DsairAddressInputDialog, DsairDialog);

DsairAddressInputDialog.prototype.addOneDigit = function (inNum) {
    this._locAddr *= 10;
    this._locAddr += inNum;
    $(this._textAreaName).val(this._locAddr.toString());
};

DsairAddressInputDialog.prototype.open = function (inAddr, inCallerObject, inMethodName, inOptarg) {

    if (inAddr == 0) {
        $(this._textAreaName).val('');
    } else {
        $(this._textAreaName).val(inAddr.toString());
    }
    this._locAddr = inAddr;

    var self = this;
    $('p').css({
        'display': 'block'
    });
    $(this._dialogName).dialog({
        dialogClass: self._className,
        autoOpen: false,
        show: 'fade',
        hide: 'fade',
        maxWidth: 600,
        maxHeight: 320,
        width: 560,
        height: 300,
        modal: true,
        buttons: {
            '0': function () {
                self.addOneDigit(0);
            },
            '1': function () {
                self.addOneDigit(1);
            },
            '2': function () {
                self.addOneDigit(2);
            },
            '3': function () {
                self.addOneDigit(3);
            },
            '4': function () {
                self.addOneDigit(4);
            },
            '5': function () {
                self.addOneDigit(5);
            },
            '6': function () {
                self.addOneDigit(6);
            },
            '7': function () {
                self.addOneDigit(7);
            },
            '8': function () {
                self.addOneDigit(8);
            },
            '9': function () {
                self.addOneDigit(9);
            },
            'CLR': function () {
                self._locAddr = 0;
                $(self._textAreaName).val('');
            },
            'OK': function () {
                var val = {
                    addr: self._locAddr
                };
                self.super.close.call(self, val);
            }
        }
    }).css('font-size', '1.5em');
    if (inOptarg != null) {
        if ('html' in inOptarg) {
            $(this._dialogName).html(inOptarg.html);
        } else {
            $(this._dialogName).html('');
        }
    }
    this.super.open.call(this, inCallerObject, inMethodName);
};

DsairAddressInputDialog.prototype.onKeyDown = function (e) {
    var key = e.key;
    e.preventDefault();
    if (key >= '0' && key <= '9') {
        this.addOneDigit(parseInt(key));
        return;
    }
    switch (e.key) {
        case 'Enter':
            break;
        case 'Escape':
            break;
        case 'Backspace':
            break;
        case 'Delete':
            break;
        case '+':
            break;
        case '-':
            break;
        default:
            break;
    }
};
