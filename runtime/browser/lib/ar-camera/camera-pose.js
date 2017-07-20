const DEFAULT_VR_POSE = {
  orientation: Float32Array.from([0, 0, 0, 1]),
  position: Float32Array.from([0, 0, 0])
};

const NO_DISPLAY = {};

const $orientation = Symbol('orientation');
const $position = Symbol('position');

class CameraPoseCache {
  constructor() {
    this.cache = new WeakMap();
  }

  allocateFor(display = NO_DISPLAY) {
    const poses = this.getFreePosesFor(display);

    return poses.length
        ? poses.pop()
        : new CameraPose(display);
  }

  free(cameraPose) {
    if (cameraPose == null) {
      return;
    }

    const poses = this.getFreePosesFor(cameraPose.vrDisplay);

    if (poses.indexOf(cameraPose) === -1) {
      poses.push(cameraPose);
    }
  }

  getFreePosesFor(display = NO_DISPLAY) {
    const cacheHasDisplay = this.cache.has(display);
    const poses = cacheHasDisplay
        ? this.cache.get(display)
        : [];

    if (!cacheHasDisplay) {
      this.cache.set(display, poses);
    }

    return poses;
  }
}

class CameraPose {
  static get defaultVrPose() {
    return DEFAULT_VR_POSE;
  }

  static from(other, cache = null) {
    const cameraPose = cache != null
        ? new CameraPose(other.vrDisplay)
        : cache.allocateFor(other.vrDisplay);

    cameraPose.position.copy(other.position);
    cameraPose.orientation.copy(other.orientation);

    return cameraPose;
  }

  constructor(vrDisplay = NO_DISPLAY) {
    this.vrDisplay = vrDisplay;
    this.vrFrameData = new VRFrameData();
    this[$position] = new THREE.Vector3();
    this[$orientation] = new THREE.Quaternion();
  }

  get vrPose() {
    const pose = this.vrFrameData.pose;

    return pose != null &&
        pose.position != null &&
        pose.orientation != null
            ? pose
            : this.constructor.defaultVrPose;
  }

  get position() {
    return this[$position];
  }

  get orientation() {
    return this[$orientation];
  }

  update() {
    if (this.vrDisplay != NO_DISPLAY) {
      this.vrDisplay.getFrameData(this.vrFrameData);
    }
    this[$position].set(...this.vrPose.position);
    this[$orientation].set(...this.vrPose.orientation);
  }

  distanceTo(other) {
    return this.position.distanceTo(other.position);
  }
}
