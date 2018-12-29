// DSair main
/*eslint no-unused-vars:0*/
var dsairApp = {
    //
    util: DsairDebug ? new FlashairUtilMock() : new FlashairUtil(),
    device: new Device(),
    storage: new Storage(),
    command: new DsairCommand(),
    powerArbitor: new DsairPowerArbitor(),
    toast: new Toast(),

    speedMeter: new DsairMeter('myCanvas'),
    cabView: new DsairCabView(),
    cabDialog: new DsairAddressInputDialog('#dialogAL', 'LocEditDlgClass', '#DblAddr'),
    cabController: new DsairCabControl(),
    meterController: new DsairMeterControl(),

    analogController: new DsairAnalogControl(),
    analogView: new DsairAnalogView(),
    analogBar: new DsairAnalogBar('speedobar'),
    analogBarController: new DsairAnalogBarControl(),

    accManager: new DsairAccManager(),
    accController: new DsairAccControl(),
    accView: new DsairAccView('accCanvas'),

    mapController : new DsairMapControl(),
    mapToolView: new DsairMapToolView('mapCanvasTool'),
    mapPanelView: new DsairMapPanelView('mapCanvasMain'),
    mapAddressDialog: new DsairAddressInputDialog('#dialogAL', 'LocEditDlgClass', '#DblAddr'),
    mapMsgDialog: new DsairMsgDialog('#dialogMsg', 'MsgDlgClass'),

    cvController: new DsairCVControl(),
    cvView: new DsairCVView(),
    cvValueDialog: new DsairCVEditDialog('#dialogCVInfo', 'CVEditDlgClass', '#cvValue'),
    cvMsgDialog: new DsairMsgDialog('#dialogMsg', 'MsgDlgClass'), 

    configController: new DsairConfigControl(),
    configView: new DsairConfigView(),

    statusController: new DsairStatusControl(),
    statusView: new DsairStatusView(),

    soundController: new DsairSoundControl(),
    soundView: new DsairSoundView(),
    
    tabControl: new DsairTabControl()
};

//
dsairApp.command.addUtil(dsairApp.util);

// cab
dsairApp.cabController.addDevice(dsairApp.device);
dsairApp.cabController.addDsairCommand(dsairApp.command);
dsairApp.cabController.addStorege(dsairApp.storage);
dsairApp.cabController.addSpeedMeter(dsairApp.speedMeter);
dsairApp.cabController.addCabView(dsairApp.cabView);
dsairApp.cabController.addCabDialog(dsairApp.cabDialog);
dsairApp.cabController.addCfgControl(dsairApp.configController);
dsairApp.cabController.addPowerArbitor(dsairApp.powerArbitor);
dsairApp.cabController.addToast(dsairApp.toast);
dsairApp.meterController.addCabController(dsairApp.cabController);
dsairApp.speedMeter.addMeterController(dsairApp.meterController);

// analog
dsairApp.analogController.addDsairCommand(dsairApp.command);
dsairApp.analogController.addView(dsairApp.analogView);
dsairApp.analogController.addSpeedMeter(dsairApp.analogBar);
dsairApp.analogController.addPowerArbitor(dsairApp.powerArbitor);
dsairApp.analogBarController.addCabController(dsairApp.analogController);
dsairApp.analogBar.addMeterController(dsairApp.analogBarController);

// accesory
dsairApp.accManager.addDsairCommand(dsairApp.command);
dsairApp.accManager.addStorage(dsairApp.storage);
dsairApp.accManager.addCfgControl(dsairApp.configController);

dsairApp.accController.addStorage(dsairApp.storage);
dsairApp.accController.addAccManager(dsairApp.accManager);
dsairApp.accController.addView(dsairApp.accView);

// map
dsairApp.mapController.addStorage(dsairApp.storage);
dsairApp.mapController.addToolView(dsairApp.mapToolView);
dsairApp.mapController.addPanelView(dsairApp.mapPanelView);
dsairApp.mapController.addAccManager(dsairApp.accManager);
dsairApp.mapController.addMsgDialog(dsairApp.mapMsgDialog);
dsairApp.mapController.addAddressInputDialog(dsairApp.mapAddressDialog);
dsairApp.mapController.addFileSelectionDialog(dsairApp.mapFileSelectionDialog);
dsairApp.mapController.addDsairCommand(dsairApp.command);
dsairApp.mapController.addToast(dsairApp.toast);

// cv
dsairApp.cvController.addDsairCommand(dsairApp.command);
dsairApp.cvController.addView(dsairApp.cvView);
dsairApp.cvController.addMsgDialog(dsairApp.cvMsgDialog);
dsairApp.cvController.addEditDialog(dsairApp.cvValueDialog);

// config
dsairApp.configController.addDsairCommand(dsairApp.command);
dsairApp.configController.addStorage(dsairApp.storage);
dsairApp.configController.addCabControl(dsairApp.cabController);
dsairApp.configController.addAccControl(dsairApp.accController);
dsairApp.configController.addView(dsairApp.configView);

// status
dsairApp.statusController.addView(dsairApp.statusView);
dsairApp.cabController.addDistStateNotifyCallback(dsairApp.statusController);
dsairApp.statusView.setDevice(dsairApp.device);
// sound
dsairApp.soundController.addDsairCommand(dsairApp.command);
dsairApp.soundController.addView(dsairApp.soundView);


// -------------------------
// cab

var onClickPon = function (inPon) {
    dsairApp.cabController.onClickPon(inPon);
};

var onSelectLoc = function () {
    dsairApp.cabController.onSelectLoc();
};

var onClickAddLoc = function () {
    dsairApp.cabController.onClickAddLoc();
};

var onClickStop = function ()
{
    dsairApp.cabController.onClickStop();
};

var onClickFwd = function (inFwd) {
    dsairApp.cabController.onClickFwd(inFwd);
};

var onClickFunction = function (inFuncNo) {
    dsairApp.cabController.onClickFunction(inFuncNo);
};

var onSetDoubleHeading = function () {
    dsairApp.cabController.onSetDoubleHeading();
};

var onSetDirReverse = function () {
    dsairApp.cabController.onSetDirReverse ();
};

//

var ANA_Stop = function () {
    dsairApp.analogController.Stop();
};

var onClickAnalogLight = function () {
    dsairApp.analogController.onClickAnalogLight();
};

var onClickAnalogSlowMotion = function () {
    dsairApp.analogController.onClickAnalogSlowMotion();
};

var ANA_Fwd = function(val) {
    dsairApp.analogController.Fwd(val);
};

var ANA_Mode = function(mode) {
    dsairApp.analogController.mode(mode);
};

//

var onSetAccEdit = function() {
    dsairApp.accController.onSetAccEdit();
};

var onClickAccPage = function(n) {
    dsairApp.accController.onClickAccPage(n);
};

//

var onClickSaveMaps = function() {
    dsairApp.mapController.onClickSaveMaps();
};

var onClickDownloadMaps = function() {
    dsairApp.mapController.download();
};

var onClickSaveFlashair = function() {
    dsairApp.mapController.saveFlashair();
};

var onClickUploadMaps = function() {
    dsairApp.mapController.upload();
};

var onClickLoadFlashair = function() {
    dsairApp.mapController.loadFlashair();
};

var onClickClearMaps = function () {
    dsairApp.mapController.onClickClearMaps();
};

//

var OpenCVValEdit = function () {
    dsairApp.cvController.OpenCVValEdit();
};

var onClickCVRead = function () {
    dsairApp.cvController.onClickCVRead();
};

var onClickCVWrite = function () {
    dsairApp.cvController.onClickCVWrite();
};

//
var onSelectAccProtocol = function () {
    dsairApp.configController.onSelectProtocol();
};

var onSelectProtocol = function () {
    dsairApp.configController.onSelectAccProtocol();
};

//

var playSound = function (n) {
    dsairApp.soundController.playSound(n);
};

var stopSound = function () {
    dsairApp.soundController.stopSound();
};

var chageDirectory = function (n) {
    dsairApp.soundController.chageDirectory(n);
};

//

var onLoad = function () {
    
};
