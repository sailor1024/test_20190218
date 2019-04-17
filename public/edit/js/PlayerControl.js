//播放控制
function PlayerControl(data){
    this.data = data;
    //this.commands = [];
    this.commands = {};
    this.addCommand(new ScriptCommand());

    this.clock = new THREE.Clock();  //计时器
    this.playing = false;
    this.timeElapsed = 0.0;
    this.timeLast = 0;
}

Object.assign(PlayerControl.prototype, {
    play(name){
        this.playing = true;
        this.times = 0;
        this.clock.start();
    },
    pause(){

    },
    continue(){

    },
    stop(){

    },
    update(){
        if(!this.playing) return;
    },
    addCommand(command){
        this.commands[command.getType()] = command;
    }
});
