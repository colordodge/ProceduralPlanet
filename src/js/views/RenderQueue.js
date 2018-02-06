

class RenderQueue {

  constructor() {
    this.actions = [];
    this.callbacks = [];
    this.skipFrame = false;
    this.lastTime = 0;
  }

  start() {
    this.startFrame = true;
    this.lastTime = Date.now();
  }

  update() {
    if (this.startFrame == false) {
      if (this.actions.length > 0) {
        this.doNextAction();
      } else {
        this.checkCallbacks();
      }
    } else {
      this.startFrame = false;
    }
  }

  doNextAction() {

    let thisTime = Date.now();
    let totalTime = thisTime - this.lastTime;
    // console.log(totalTime + " ms");
    this.lastTime = thisTime;

    this.actions[0]();
    this.actions.shift();
    // console.log("do action " + this.actions.length);
  }

  addAction(action) {
    this.actions.push(action);
  }

  addCallback(callback) {
    this.callbacks.push(callback);
  }

  checkCallbacks() {
    if (this.callbacks.length > 0) {
      this.executeCallbacks();
    }
  }

  executeCallbacks() {
    for (let i=0; i<this.callbacks.length; i++) {
      this.callbacks[i]();
      console.log("callback");
    }

    this.callbacks = [];
  }

}

export default RenderQueue;
