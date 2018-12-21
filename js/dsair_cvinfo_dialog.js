var DsairCVEditDialog = function (inDialogName, inClassName, inTextAreaName) {
    DsairDialog.call(this, inDialogName, inClassName);
    this.super = DsairDialog.prototype;
    this._textAreaName = inTextAreaName;
    this._value = 0;
};

inherits(DsairCVEditDialog, DsairDialog);

DsairCVEditDialog.prototype.open = function(inValue, inCallbackObject, inCallbackMethodName) {
    this._value = inValue;
    $(this._textAreaName).val(this._value.toString());

    let self = this;
    $('p').css({
        'display': 'block'
    });
    $(this._dialogName).dialog({
        dialogClass: this._className,
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
                self._value = 0;
                $(self._textAreaName).val(self._value.toString());
            },
            'OK': function () {
                let val = {
                    cvval: self._value
                };
                self.super.close.call(self, val);
            }
        }
    }).css('font-size', '1.5em');
    this.super.open.call(this, inCallbackObject, inCallbackMethodName);
};

DsairCVEditDialog.prototype.addOneDigit = function (inNum) {
    this._value *= 10;
    this._value += inNum;
    $(this._textAreaName).val(this._value.toString());
};
