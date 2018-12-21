// global variables
// グローバル変数
/*eslint no-unused-vars:0*/

if (DsairDebug === undefined) {
    var DsairDebug = false;
}

let DsairGlobal = {

};

// common constants
// 共通定数
const DsairConst = Object.freeze({
    powerOn: 1,
    powerOff: 0,
    dirFWD: 1,
    dirREV: 2,
    protocolMM2: 'MM2',
    protocolDCC: 'DCC',
    maxAccessories: 2044,
    documentRootDir: DsairDebug ? '.' : 'SD_WLAN'
});

