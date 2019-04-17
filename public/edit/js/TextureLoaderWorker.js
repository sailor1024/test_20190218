// var scope = this;
// this.worker = new Worker("js/TestLoaderWorker.js"); //异步加载woker
// this.worker.onmessage = function(e){
//     var item = this._getIdle();
//     item.index = e.data.index;
//     item.visitNum = ++this.visitNum;
//     item.texture = e.data.texture;
//     this.cbLoadComplete(item.index, item.texture);
// }
//
// this.worker.postMessage({index:index, url:this.viewPoints[index]});
