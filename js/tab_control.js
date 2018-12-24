//
var DsairTabControl = function() {
    window.addEventListener('load', this);
};

DsairTabControl.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'load':
            this.onLoad();
            break;
        default:
            break;
    }
};

DsairTabControl.prototype.onLoad = function () {
    $('input[type=submit], a, button')
        .button()
        .click(function (event) {
            event.preventDefault();
        });
    $('button').button();
    $('#tabcontrol').tabs().addClass('ui-tabs-vertical ui-helper-clearfix');
    $('#tabcontrol li').removeClass('ui-corner-top').addClass('ui-corner-left');

    $('#dialogAL').dialog({ autoOpen: false });
    $('#dialogMsg').dialog({ autoOpen: false });
    $('#dialogCVInfo').dialog({ autoOpen: false });
    $('#fileSelection').dialog({ autoOpen: false });

    $("#tabcontrol").bind('tabsactivate', function (event, ui) {
        switch (ui.newTab.index()) {
            case 0:
                break;
            case 1:
                dsairApp.accController.onActivate();
                break;
            case 2:
                dsairApp.mapController.onActivate();
                break;
            default:
                break;
        }
    });
};

