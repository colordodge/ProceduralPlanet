
export default class LoadingBar {

  constructor() {
    this.base = document.createElement("div");
    this.base.id = "loadingBarHolder";
    this.base.innerHTML = 'Rendering</br><div id="loadingBarBase"><div id="loadingBar"></div></div>';
  }

  update(progress) {
    this.bar = document.getElementById("loadingBar");
    this.bar.style.width = "" + progress * 100 + "%";
  }

  show() {
    document.body.appendChild(this.base);
    this.bar = document.getElementById("loadingBar");
    this.bar.style.width = "0%";
  }

  hide() {
    document.body.removeChild(this.base);
  }

}
