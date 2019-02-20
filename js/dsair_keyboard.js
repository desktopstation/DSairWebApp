//
var DsairKeyboardControl = function () {
    this._controller = null;
    document.addEventListener('keydown', this);
};

// https://www.usb.org/sites/default/files/documents/hut1_12v2.pdf
// https://developer.mozilla.org/ja/docs/Web/API/KeyboardEvent/key/Key_Values

DsairKeyboardControl.prototype.eventMap = {
    ' ': {
        none: { method: 'powerControl' }
    },
    '+': {
        none:  { method: '' },
        shift: { method: '' }
    },
    '-': {
        none:  { method: '' },
        shift: { method: '' }
    },
    'z': {
        none: { method: '' }
    },
    'q': {
        none: { method: '' }
    },
    '0': {
        none:  { method: 'functionControl', arg: 0 },
        shift: { method: 'functionControl', arg: 10 }
    },
    '1': {
        none:  { method: 'functionControl', arg: 1 },
        shift: { method: 'functionControl', arg: 11 }
    },
    '2': {
        none:  { method: 'functionControl', arg: 2 },
        shift: { method: 'functionControl', arg: 12 }
    },
    '3': {
        none:  { method: 'functionControl', arg: 3 },
        shift: { method: 'functionControl', arg: 13 }
    },
    '4': {
        none:  { method: 'functionControl', arg: 4 },
        shift: { method: 'functionControl', arg: 14 }
    },
    '5': {
        none:  { method: 'functionControl', arg: 5 },
        shift: { method: 'functionControl', arg: 15 }
    },
    '6': {
        none:  { method: 'functionControl', arg: 6 },
        shift: { method: 'functionControl', arg: 16 }
    },
    '7': {
        none:  { method: 'functionControl', arg: 7 },
        shift: { method: 'functionControl', arg: 17 }
    },
    '8': {
        none:  { method: 'functionControl', arg: 8 },
        shift: { method: 'functionControl', arg: 18 }
    },
    '9': {
        none:  { method: 'functionControl', arg: 9 },
        shift: { method: 'functionControl', arg: 19 }
    }
};

DsairKeyboardControl.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'keydown':
            this.onKeyDown(e);
            break;
        default:
            break;
    }
};

DsairKeyboardControl.prototype.addController = function (inController) {
	this._controller = inController;
};

DsairKeyboardControl.prototype.onKeyDown = function (e) {
    var key = e.key;

    if (key in this.eventMap) {
        var methodInfoList = this.eventMap[key];
        var methodInfo;
        if (e.shiftKey && 'shift' in methodInfoList) {
            methodInfo = methodInfoList['shift'];
        } else {
            methodInfo = methodInfoList['none'];
        }
        if (methodInfo['method'] in this) {
            if ('arg' in methodInfo) {
                this[methodInfo['method']](methodInfo['arg']);
            } else {
                this[methodInfo['method']]();
            }
        }
    }
};

DsairKeyboardControl.prototype.powerControl = function () {

};

DsairKeyboardControl.prototype.forceStop = function () {

};

DsairKeyboardControl.prototype.directionControl = function () {

};

DsairKeyboardControl.prototype.speedControlUp = function () {

};

DsairKeyboardControl.prototype.speedControlDown = function () {

};


DsairKeyboardControl.prototype.functionControl = function () {

};

