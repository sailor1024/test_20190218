//播放控制
function ScriptCommand(){

}

Object.assign(ScriptCommand.prototype, {
    getType(){
        return "script";
    },
    start(frame){
        eval(frame.data);
    },
    update(frame, timeElapsed){
    },
    pause(frame){
    },
    continue(frame){
    },
    stop(frame){
    }
});
