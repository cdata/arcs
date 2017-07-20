
const radToDeg = (() => {
  const scale = 180 / Math.PI;
  return rad => rad * scale;
})();

class XDebug extends Polymer.Element {
  static get template() {
    return `
<style>
  :host {
    position: absolute;
    top: 0;
    left: 0;
    color: #fff;
    font-family: sans-serif;
    z-index: 1;
  }

  #stats .x:before {
    content: 'x: ';
  }

  #stats .y:before {
    content: 'y: ';
  }

  #stats .z:before {
    content: 'z: ';
  }

  #stats .w:before {
    content: 'z: ';
  }

  #stats > #camera {
    display: flex;
    flex-direction: column;
  }
</style>
<span id="stats">
  <span id="camera">
    <span>Camera Orientation</span>
    <span class="x">[[cameraRot.x]]</span>
    <span class="y">[[cameraRot.y]]</span>
    <span class="z">[[cameraRot.z]]</span>
    <span class="w">[[cameraRot.w]]</span>
  </span>
</span>
`;
  }

  static get properties() {
    return {
      cameraRot: {
        type: Object
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    navigator.getVRDisplays &&
        navigator.getVRDisplays().then(vrDisplays => {
          this.vrDisplay = vrDisplays[0];
          if (this.vrDisplay) {
            this.cameraPose = new CameraPose(this.vrDisplay);
            this.measure();
          }
        });

    window.addEventListener('camera-stats', event => this.onStats(event));
  }

  onStats(event) {
    this.cameraRot = event.detail.camera
  }

  measure() {
    this.cameraPose.update();

    const orientation = this.cameraPose.orientation;
    const euler = new THREE.Euler();

    euler.setFromQuaternion(this.cameraPose.orientation);

    const rotDeg = {
      x: `${radToDeg(euler.x).toFixed(3)}deg`,
      y: `${radToDeg(euler.y).toFixed(3)}deg`,
      z: `${radToDeg(euler.z).toFixed(3)}deg`
    };

    this.cameraRot = rotDeg;
    this.vrDisplay.requestAnimationFrame(() => this.measure());
  }
}

customElements.define('x-debug', XDebug);
