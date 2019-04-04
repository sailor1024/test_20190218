//播放控制
function videoCommand() {

}

Object.assign(videoCommand.prototype, {
    getType() {
        return "script";
    },
    start(frame) {
        eval(frame.data);
    },
    update(frame, timeElapsed) {},
    pause(frame) {},
    continue (frame) {},
    stop(frame) {}
});