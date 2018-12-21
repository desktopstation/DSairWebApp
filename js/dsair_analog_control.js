var DsairAnalogControl = function () {
    this._view = null;
    this._speedMeter = [];
    this._command = null;
    this._powerArbitor = null;

    this._LocSpeed = 0;
    this._LocSpeedLast = 0;
    this._Direction = DsairConst.dirFWD;
    this._SpeedMode = 0;
    this._LastUpdateTime = 0;
    this._LightMode = false;
    this._LightThreshold = 72;
    this._MaxSpeed = 100;
    this._SpeedDelayOn = false;
    this._SpeedDelayTime = 0;
    this._SpeedDelaySpeed1 = 0;
    this._SpeedDelaySpeed2 = 0;
    this._SpeedDelaySpeedTemp = 0;
    this._SpeedDelayDiff = 0;
    this._DelayInterval = 0;
    this._SpeedDelaySpeedCnt = 1;
    this._powerStatus = DsairConst.powerOff;
};
//
DsairAnalogControl.prototype._name = 'Analog controller';
//

DsairAnalogControl.prototype.addDsairCommand= function (inCommand) {
    this._command = inCommand;
};

DsairAnalogControl.prototype.addView = function (inView) {
    this._view = inView;
    this._view.setController(this);
};

DsairAnalogControl.prototype.addSpeedMeter = function (inSpeedMeter) {
    this._speedMeter.push(inSpeedMeter);
};

DsairAnalogControl.prototype.addPowerArbitor = function (inArbitor) {
    this._powerArbitor = inArbitor;
    this._powerArbitor.addPowerStateChangeCallback(this);
};

//

DsairAnalogControl.prototype.Free = function () {
    this._LocSpeed = 0;
    this._LocSpeedLast = 0;
    this._LightMode = false;
};

DsairAnalogControl.prototype.SpeedCurve = function (inMode, inSpeed) {
    let aSpd = inSpeed;
    let aSpd_unit = inSpeed / 1023;

    switch (inMode) {
        case 1:
            aSpd = inSpeed;
            break;
        case 2:
            aSpd = 1023 * (1 - (1 - aSpd_unit) * (1 - aSpd_unit));
            break;
        case 3:
            aSpd = 1023 * (aSpd_unit * aSpd_unit);
            break;
        default:
            break;
    }

    return Math.round(aSpd * this._MaxSpeed / 100);
};

DsairAnalogControl.prototype.onChangeMaxVoltage = function (inMaxSpeed) {
    this._MaxSpeed = inMaxSpeed;
};

DsairAnalogControl.prototype.onChangeLightThreshold = function (inLightThreshold) {
    this._LightThreshold = Math.round(inLightThreshold * 1023 / 100)
};

DsairAnalogControl.prototype.onClickAnalogLight = function () {

    if (!this._LightMode) {
        this._LightMode = true;
    }
    else {
        this._LightMode = false;
    }
    this._view.setLightMode(this._LightMode);
    this.Speed(this._LocSpeed);
};

DsairAnalogControl.prototype.onClickAnalogSlowMotion = function () {

    if (!this._SpeedDelayOn) {
        this._SpeedDelayOn = true;
    }
    else {
        this._SpeedDelayOn = false;
    }
    this._view.setSpeedDelay(this._SpeedDelayOn);
};

DsairAnalogControl.prototype.DelaySpeedProgress = function () {

    if ((this._SpeedDelayTime > 0) && (this._SpeedDelayOn)) {

        this._SpeedDelaySpeedTemp = this._SpeedDelaySpeedTemp + this._SpeedDelayDiff;
        this._SpeedDelayTime = this._SpeedDelayTime - 111;

        if (this._SpeedDelaySpeedTemp < 0) {
            this._SpeedDelaySpeedTemp = 0;
        }

        this.onDrawMeter(this._SpeedDelaySpeedTemp);

        if (this._SpeedDelaySpeedCnt > 2) {
            this.Speed(this._SpeedDelaySpeedTemp);
            this._SpeedDelaySpeedCnt = 0;
        }
        else {
            this._SpeedDelaySpeedCnt = this._SpeedDelaySpeedCnt + 1;
        }
    }
    else {
        this._SpeedDelayTime = 0;

        this.onDrawMeter(this._LocSpeed);
        this.Speed(this._LocSpeed);
        clearInterval(this._DelayInterval);
    }

};

DsairAnalogControl.prototype.onChangeSpeed = function (inSpeed, inUpdateFlag) {
    let powerOwner = this._powerArbitor.getPowerOwner();
    if (!((powerOwner == '') || (powerOwner == this._name))) {
        // DCCがONの時は無効
        return;
    }

    if (this._SpeedDelayOn) {
        if (this._SpeedDelayTime == 0) {
            this._LocSpeed = inSpeed;

            //Speed Delay Start
            this._SpeedDelaySpeed2 = this._LocSpeed;
            this._SpeedDelaySpeed1 = this._LocSpeedLast;
            this._SpeedDelaySpeedTemp = this._LocSpeedLast;
            this._SpeedDelayTime = Math.abs(this._LocSpeed - this._LocSpeedLast) * 30000 / 1023;//0->max speed == 30sec
            this._SpeedDelayDiff = (this._LocSpeed - this._LocSpeedLast) * 111 / this._SpeedDelayTime;

            let self = this;
            this._DelayInterval = setInterval(function () {self.DelaySpeedProgress();}, 111);
        }
        else {
            //動作中は無視
        }
    }
    else {
        //速度を反映
        this._LocSpeed = inSpeed;

        this.onDrawMeter(this._LocSpeed);
        let date = new Date();

        if ((Math.abs(date.getTime() - this._LastUpdateTime) >= 500) || inUpdateFlag) {
            if (this._LocSpeedLast != this._LocSpeed) {
                //前回より500ms経過時
                this.Speed(this._LocSpeed);
            }
            this._LastUpdateTime = date.getTime();
        } else {
            /*表示のみ（速度を送信しない）*/
        }
    }
};

DsairAnalogControl.prototype.Mode = function (inMode) {
    this._SpeedMode = inMode;
    this._view.setSpeedMode(this._SpeedMode);
};

DsairAnalogControl.prototype.Fwd = function (inMode) {

    if (this._Direction != inMode) {
        this._LocSpeed = 0;
        this._Direction = inMode;

        this.Speed(this._LocSpeed);
        this.onDrawMeter(this._LocSpeed);

        this._view.setDirection(this._Direction);
     }
};

DsairAnalogControl.prototype.Speed = function (inSpeed) {
    this._LocSpeedLast = inSpeed;
    //console.log(inSpeed);

    let aSpeed = this.SpeedCurve(this._SpeedMode, inSpeed);

    if ((aSpeed < this._LightThreshold) && (this._LightMode)) {
        aSpeed = this._LightThreshold;
    }

    this._command.setAnalogSpeed(aSpeed, this._Direction);
    if (aSpeed > 0) {
        if (this._powerStatus == DsairConst.powerOff) {
            this._powerArbitor.tryPowerOn(this._name);
        }
    } else {
        if (this._powerStatus == DsairConst.powerOn) {
            this._powerArbitor.powerOff(this._name);
        }
    }
    //this._view.setPowerStatus(this._powerStatus);
};

DsairAnalogControl.prototype.Stop = function () {
    this._SpeedDelayTime = 0;
    this._LocSpeed = 0;
    this.Speed(this._LocSpeed);
    this.onDrawMeter(this._LocSpeed);
};

DsairAnalogControl.prototype.onDrawMeter = function (inSpeed) {
    for (let meter of this._speedMeter) {
        meter.onDrawMeter(inSpeed, this._Direction);
    }
    this._view.setSpeed(inSpeed);
};

DsairAnalogControl.prototype.onPowerStateChange = function (inName, inPower) {
    if (inName == this._name) {
        this._powerStatus = inPower;
        //this._dsairCommand.setPower(this._powerStatus);
    } else {
        this._powerStatus = DsairConst.powerOff;
    }
    this._view.setPowerStatus(this._powerStatus);
    this._view.setVisibleItems(this._powerStatus);
};
