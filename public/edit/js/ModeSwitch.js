function ModeSwitch(surroundBox, materialSwitch, cb){
    this.ModeOrbit = 1;
    this.ModePointerLock = 2;
    this.Orthographic = 3;

    this.cbModeChange = cb;
    this.currentMode = this.ModeOrbit;

    this.materialSwitch = materialSwitch;
    this.surroundBox = surroundBox;
}

Object.assign(ModeSwitch.prototype, {
    isOverallMode(){
        return this.currentMode == this.ModeOrbit;
    },
    isWalkingMode(){
        return this.currentMode == this.ModePointerLock;
    },
    isOrthographic(){
        return this.currentMode == this.Orthographic;
    },
    // getMode(){
    //     return this.currentMode;
    // },
    setOverallMode(){
        this.surroundBox.visible = false;
        this.materialSwitch.restore();
        this.currentMode = this.ModeOrbit;

        this.cbModeChange && this.cbModeChange(this);
    },
    setWalkingMode(){
        if(this.isOverallMode()){
            this.surroundBox.visible = true;
            this.materialSwitch.useCubemap();
            this.currentMode = this.ModePointerLock;
        }

        this.cbModeChange && this.cbModeChange(this);
    },
    setOrthographic(){
        this.currentMode = this.Orthographic;
        this.cbModeChange && this.cbModeChange(this);
    }
});

